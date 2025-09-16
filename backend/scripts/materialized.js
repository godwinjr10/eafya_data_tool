import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const materializedViewsPath = path.resolve(
  __dirname,
  "..",
  "sql",
  "materializedviews"
);
const viewsPath = path.resolve(__dirname, "..", "sql", "views");

// Get the directory from command line argument or default to views
const SQL_DIR =
  process.argv[2] === "materialized" ? materializedViewsPath : viewsPath;
const isMaterialized = process.argv[2] === "materialized";

const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// --- helpers ---
function readSqlFiles(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".sql"))
    // sort with numeric awareness so 01_, 02_... run in order
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  return files.map((f) => ({ name: f, full: path.join(dir, f) }));
}

function extractViews(sql) {
  const results = [];
  const mvRe =
    /create\s+(?:or\s+replace\s+)?materialized\s+view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/gi;
  const vRe =
    /create\s+(?:or\s+replace\s+)?view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/gi;

  let m;
  while ((m = mvRe.exec(sql)) !== null) {
    results.push({ type: "materialized", name: m[1] });
  }
  while ((m = vRe.exec(sql)) !== null) {
    results.push({ type: "view", name: m[1] });
  }
  return results;
}

function isSafeIdentifier(id) {
  // Matches: schema.view or "Schema"."View Name", with optional dot
  const seg = /(?:[a-z_][a-z0-9_$]*|"[^"]+")/i.source;
  const dotted = new RegExp(`^${seg}(\\.${seg})?$`, "i");
  return dotted.test(id.trim());
}

async function dropViewsFirst(client, files) {
  // Build a reverse-ordered drop list (last file dropped first)
  const seen = new Set();
  const toDrop = [];

  for (let i = files.length - 1; i >= 0; i--) {
    const sql = fs.readFileSync(files[i].full, "utf8");
    const views = extractViews(sql);
    for (const v of views) {
      const key = `${v.type}:${v.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        toDrop.push(v);
      }
    }
  }

  if (toDrop.length === 0) {
    console.log("No views detected to drop.");
    return;
  }

  console.log(`Dropping ${toDrop.length} view(s) before recreate...`);
  for (const v of toDrop) {
    if (!isSafeIdentifier(v.name)) {
      console.warn(`⚠️  Skipping suspicious identifier: ${v.name}`);
      continue;
    }

    // Try to drop as different types of objects
    const dropCommands = [
      `DROP VIEW IF EXISTS ${v.name} CASCADE;`,
      `DROP TABLE IF EXISTS ${v.name} CASCADE;`,
      `DROP MATERIALIZED VIEW IF EXISTS ${v.name} CASCADE;`,
    ];

    let dropped = false;
    for (const dropSql of dropCommands) {
      try {
        console.log(`DROP -> ${dropSql}`);
        await client.query(dropSql);
        dropped = true;
        break; // Successfully dropped, no need to try other commands
      } catch (err) {
        // Continue to next drop command
        continue;
      }
    }

    if (!dropped) {
      console.warn(
        `   Could not drop ${v.name} - object may not exist or may be protected`
      );
    }
  }
}

async function run() {
  if (!fs.existsSync(SQL_DIR)) {
    console.error(`SQL_DIR not found: ${SQL_DIR}`);
    process.exit(1);
  }

  const files = readSqlFiles(SQL_DIR);
  if (files.length === 0) {
    console.log("No .sql files found.");
    return;
  }

  console.log(
    `🔧 Setting up ${
      isMaterialized ? "materialized views" : "views"
    } from: ${SQL_DIR}`
  );
  console.log(`📁 Found ${files.length} SQL files`);

  const client = new Client(DB_CONFIG);
  await client.connect();
  try {
    // 1) Drop views first (reverse order to reduce dependency issues)
    await dropViewsFirst(client, files);

    // 2) Recreate by executing each file in order
    let successCount = 0;
    let errorCount = 0;

    for (const f of files) {
      const sql = fs.readFileSync(f.full, "utf8");
      console.log(`   Executing: ${f.name}`);
      try {
        // Handle "already exists" errors by using CREATE OR REPLACE
        let modifiedSql = sql;
        if (
          sql.toLowerCase().includes("create view") &&
          !sql.toLowerCase().includes("materialized")
        ) {
          modifiedSql = sql.replace(/CREATE VIEW/gi, "CREATE OR REPLACE VIEW");
        } else if (sql.toLowerCase().includes("create table")) {
          modifiedSql = sql.replace(
            /CREATE TABLE/gi,
            "CREATE OR REPLACE TABLE"
          );
        } else if (sql.toLowerCase().includes("create materialized view")) {
          // For materialized views, we need to drop first then create
          // Don't modify the SQL, just execute as-is since we already dropped it
          modifiedSql = sql;
        }

        await client.query(modifiedSql);
        console.log(`   ✅ ${f.name} executed successfully`);
        successCount++;
      } catch (err) {
        console.error(`   ❌ Error executing ${f.name}`);
        console.error(`   Error: ${err.message}`);
        errorCount++;
      }
    }

    console.log(
      `✅ ${isMaterialized ? "Materialized views" : "Views"} setup completed!`
    );
    console.log(
      `📊 Processed ${files.length} files: ${successCount} successful, ${errorCount} errors`
    );
  } catch (err) {
    console.error("❌ Execution failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log(
      `ℹ️  Database connection closed for ${
        isMaterialized ? "materialized views" : "views"
      }`
    );
  }
}

run();
