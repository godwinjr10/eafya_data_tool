// run-views.js
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const SQL_DIR = process.env.SQL_DIR || './sql';

const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// --- helpers ---
function readSqlFiles(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.sql'))
    // sort with numeric awareness so 01_, 02_... run in order
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return files.map(f => ({ name: f, full: path.join(dir, f) }));
}

function extractViews(sql) {
  const results = [];
  const mvRe = /create\s+(?:or\s+replace\s+)?materialized\s+view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/ig;
  const vRe  = /create\s+(?:or\s+replace\s+)?view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/ig;

  let m;
  while ((m = mvRe.exec(sql)) !== null) {
    results.push({ type: 'materialized', name: m[1] });
  }
  while ((m = vRe.exec(sql)) !== null) {
    results.push({ type: 'view', name: m[1] });
  }
  return results;
}

function isSafeIdentifier(id) {
  // Matches: schema.view or "Schema"."View Name", with optional dot
  const seg = /(?:[a-z_][a-z0-9_$]*|"[^"]+")/i.source;
  const dotted = new RegExp(`^${seg}(\\.${seg})?$`, 'i');
  return dotted.test(id.trim());
}

async function dropViewsFirst(client, files) {
  // Build a reverse-ordered drop list (last file dropped first)
  const seen = new Set();
  const toDrop = [];

  for (let i = files.length - 1; i >= 0; i--) {
    const sql = fs.readFileSync(files[i].full, 'utf8');
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
    console.log('No views detected to drop.');
    return;
  }

  console.log(`Dropping ${toDrop.length} view(s) before recreate...`);
  for (const v of toDrop) {
    const kind = v.type === 'materialized' ? 'MATERIALIZED VIEW' : 'VIEW';
    if (!isSafeIdentifier(v.name)) {
      console.warn(`⚠️  Skipping suspicious identifier: ${v.name}`);
      continue;
    }
    const dropSql = `DROP ${kind} IF EXISTS ${v.name} CASCADE;`;
    console.log(`DROP -> ${dropSql}`);
    try {
      await client.query(dropSql);
    } catch (err) {
      console.error(`Drop failed for ${v.name}: ${err.message}`);
      // continue trying to drop others
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
    console.log('No .sql files found.');
    return;
  }

  const client = new Client(DB_CONFIG);
  await client.connect();
  try {
    // 1) Drop views first (reverse order to reduce dependency issues)
    await dropViewsFirst(client, files);

    // 2) Recreate by executing each file in order
    for (const f of files) {
      const sql = fs.readFileSync(f.full, 'utf8');
      console.log(`---- Running: ${f.name}`);
      await client.query(sql);
    }

    console.log('✅ Done: views dropped & recreated.');
  } catch (err) {
    console.error('❌ Execution failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
