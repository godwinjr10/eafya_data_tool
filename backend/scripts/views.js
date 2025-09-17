import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Paths to SQL directories
const VIEWS_PATH = path.resolve(__dirname, "..", "sql", "views");
const MATERIALIZED_VIEWS_PATH = path.resolve(__dirname, "..", "sql", "materializedviews");

async function createViews() {
  const client = new Client(DB_CONFIG);
  
  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Process regular views
    await processDirectory(client, VIEWS_PATH, "views");
    
    // Process materialized views
    await processDirectory(client, MATERIALIZED_VIEWS_PATH, "materialized views");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

async function processDirectory(client, dirPath, type) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => file.toLowerCase().endsWith('.sql'))
    .sort(); // Simple alphabetical sort

  if (files.length === 0) {
    console.log(`📁 No SQL files found in ${type} directory`);
    return;
  }

  console.log(`\n🔧 Creating ${type} from ${files.length} files...`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await client.query(sql);
      console.log(`   ✅ ${file}`);
    } catch (error) {
      console.error(`   ❌ ${file}: ${error.message}`);
    }
  }
}

// Run the script
createViews();
