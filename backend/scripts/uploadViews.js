import { pool } from "../config/database.js";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

console.log("Starting View Upload Script");

async function uploadViews() {
  try {
    console.log("Testing database connection...");
    
    // Validate environment variables
    const requiredVars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
    }

    const client = await pool.connect();
    const result = await client.query("SELECT current_database() as database_name");
    const dbInfo = result.rows[0];
    
    console.log(`✅ Connected to database: ${dbInfo.database_name}`);
    client.release();

    // Initialize dedicated client for view operations
    console.log("Initializing database client...");
    const viewClient = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await viewClient.connect();
    console.log("Database client connected");

    // Read SQL files from directories
    const datasetViewsDir = path.resolve(__dirname, "..", "sql", "datasetviews");
    const dhis2ViewsDir = path.resolve(__dirname, "..", "sql", "dhis2views");

    console.log(`Looking for files in: ${datasetViewsDir}`);
    console.log(`Looking for files in: ${dhis2ViewsDir}`);

    const allFiles = [];

    // Read dataset views
    if (fs.existsSync(datasetViewsDir)) {
      const datasetFiles = fs.readdirSync(datasetViewsDir)
        .filter(f => f.toLowerCase().endsWith(".sql"))
        .sort();
      console.log(`Found ${datasetFiles.length} files in datasetviews`);
      allFiles.push(...datasetFiles.map(f => path.join(datasetViewsDir, f)));
    }

    // Read DHIS2 views
    if (fs.existsSync(dhis2ViewsDir)) {
      const dhis2Files = fs.readdirSync(dhis2ViewsDir)
        .filter(f => f.toLowerCase().endsWith(".sql"))
        .sort();
      console.log(`Found ${dhis2Files.length} files in dhis2views`);
      allFiles.push(...dhis2Files.map(f => path.join(dhis2ViewsDir, f)));
    }

    if (allFiles.length === 0) {
      console.log("No SQL files found");
      await viewClient.end();
      return;
    }

    console.log(`Total files to process: ${allFiles.length}`);

    // Extract view names and drop existing views
    console.log("Dropping existing views...");
    const allViews = [];
    
    for (const filePath of allFiles) {
      try {
        const sql = fs.readFileSync(filePath, "utf8");
        const viewRegex = /create\s+(?:or\s+replace\s+)?view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/gi;
        let match;
        while ((match = viewRegex.exec(sql)) !== null) {
          allViews.push(match[1].trim());
        }
      } catch (error) {
        console.log(`Error reading ${path.basename(filePath)}: ${error.message}`);
      }
    }

    // Remove duplicates
    const uniqueViews = [...new Set(allViews)];
    console.log(`Found ${uniqueViews.length} unique views to drop`);

    // Drop views
    let droppedCount = 0;
    for (const viewName of uniqueViews.reverse()) {
      try {
        await viewClient.query(`DROP VIEW IF EXISTS ${viewName} CASCADE;`);
        droppedCount++;
      } catch (err) {
        // Try dropping as table if view fails
        try {
          await viewClient.query(`DROP TABLE IF EXISTS ${viewName} CASCADE;`);
          droppedCount++;
        } catch (err2) {
          // Ignore errors
        }
      }
    }

    console.log(`✅ Dropped ${droppedCount} existing views`);

    // Execute SQL files
    console.log("Processing SQL files...");
    let successCount = 0;
    let errorCount = 0;

    for (const filePath of allFiles) {
      try {
        const sql = fs.readFileSync(filePath, "utf8");
        
        if (sql && sql.trim().length > 0) {
          await viewClient.query(sql);
          console.log(`✅ ${path.basename(filePath)}`);
          successCount++;
        }
      } catch (error) {
        console.log(`❌ Error executing ${path.basename(filePath)}: ${error.message}`);
        errorCount++;
      }
    }

    await viewClient.end();
    
    console.log(`\nCompleted: ${successCount} successful, ${errorCount} failed`);

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the upload
uploadViews().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});