import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import Dataset from "../models/dataset.js";
import UserModel from "../models/usermodel.js";
import Facility from "../models/facility.js";
import CustomizationSet from "../models/customizationsets.js";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Client } from "pg";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Simple logger
class SimpleLogger {
  constructor() {
    this.startTime = Date.now();
    this.steps = [];
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const icon = this.getIcon(type);
    console.log(`${icon} ${message}`);
    this.steps.push({ message, type, timestamp });
  }

  getIcon(type) {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️"
    };
    return icons[type] || "📋";
  }

  printSummary() {
    const duration = Date.now() - this.startTime;
    const successCount = this.steps.filter(s => s.type === "success").length;
    const errorCount = this.steps.filter(s => s.type === "error").length;
    
    console.log("\n" + "=".repeat(60));
    console.log("🏁 SETUP SUMMARY");
    console.log("=".repeat(60));
    console.log(`⏱️  Duration: ${this.formatDuration(duration)}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log("=".repeat(60));
  }

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
}

// Configuration
const CONFIG = {
  sqlFiles: [
  "deleteAllTables.sql",
  "001_import_tables.sql",
  "002_stage_tables.sql",
  "003_dwh_tables.sql"
  ],

  datasets: [
  {
    dataset_id: "HMIS_105_01",
      dataset_name: "HMIS 105:01 - OPD Monthly Report (Attendances, Referrals, Conditions)",
    sections: [
      { section_id: "1.1", section_name: "Attendance and Referral" },
      { section_id: "1.3.1", section_name: "Epidemic Prone Diseases" },
        { section_id: "1.3.2", section_name: "Other Infectious / Communicable Diseases" },
      { section_id: "1.3.3", section_name: "Neonatal Diseases" },
      { section_id: "1.3.4", section_name: "Non-Communicable Diseases" },
      { section_id: "1.3.5", section_name: "Oral Diseases" },
      { section_id: "1.3.6", section_name: "ENT Conditions" },
      { section_id: "1.3.7", section_name: "Eye Conditions" },
      { section_id: "1.3.8", section_name: "Mental Health" },
      { section_id: "1.3.9", section_name: "Neurological Disorders" },
      { section_id: "1.3.10", section_name: "Chronic Respiratory" },
      { section_id: "1.3.11", section_name: "Cancers" },
      { section_id: "1.3.12", section_name: "Palliative" },
      { section_id: "1.3.14", section_name: "Disabilities" },
      { section_id: "1.3.15", section_name: "Cardiovascular Diseases" },
      { section_id: "1.3.16", section_name: "Renal Diseases" },
      { section_id: "1.3.17", section_name: "Liver Diseases" },
      { section_id: "1.3.18", section_name: "Endocrine Metabolic Disorders" },
      { section_id: "1.3.19", section_name: "Injuries" },
      { section_id: "1.3.20", section_name: "Minor Operations OPD" },
      { section_id: "1.3.21", section_name: "Neglected Tropical Diseases" },
      { section_id: "1.3.22", section_name: "Maternal Conditions" },
      { section_id: "1.3.24", section_name: "Deaths in OPD" },
      { section_id: "1.3.25", section_name: "Emergency Medical Services" },
      { section_id: "1.3.26", section_name: "TB Screening" },
      { section_id: "1.3.27", section_name: "Leprosy Services" },
      { section_id: "1.3.28", section_name: "Nutrition Services" },
        { section_id: "1.3.29", section_name: "Gender Based Violence Services" }
      ]
  },
  {
    dataset_id: "HMIS_105_02",
    dataset_name: "HMIS 105:02 - OPD Monthly Report (MCH, FP, EPI)",
    sections: [
      { section_id: "2.1", section_name: "Antenatal" },
      { section_id: "2.2", section_name: "Maternity" },
      { section_id: "2.3", section_name: "Postnatal" },
      { section_id: "2.4.1", section_name: "Family Planning" },
      { section_id: "2.6", section_name: "Child Health Services" },
      { section_id: "2.6.2", section_name: "Tetanus Vaccination" },
      { section_id: "2.6.3", section_name: "Child Immunization" },
        { section_id: "2.6.4", section_name: "Vaccine Availability" }
      ]
  },
  {
    dataset_id: "HMIS_105_06",
    dataset_name: "HMIS 105:06 - OPD Monthly Report (Essential Medicines)",
    sections: [
        { section_id: "6.1", section_name: "Essential Medicines and Health Supplies" }
      ]
  },
  {
    dataset_id: "HMIS_105_10",
    dataset_name: "HMIS 105:10 - OPD Monthly Report (Laboratory)",
    sections: [
      { section_id: "10.1", section_name: "Total Laboratory Client Visits" },
      { section_id: "10.1.2", section_name: "Specimen Collected" },
        { section_id: "10.2.1", section_name: "Laboratory Routine Tests" }
      ]
  },
  {
    dataset_id: "HMIS_108",
    dataset_name: "HMIS 108 - Inpatient Monthly Report",
    sections: [
      { section_id: "1", section_name: "Census Information" },
      { section_id: "2", section_name: "Referrals" },
      { section_id: "3", section_name: "Surgical Procedures" },
      { section_id: "4", section_name: "Blood Transfusion Services" },
      { section_id: "5", section_name: "Radiology and Imaging" },
      { section_id: "6", section_name: "Admissions Deaths by Diagnosis" },
      { section_id: "7", section_name: "Mental Health, Risk Behaviour TB" },
      { section_id: "10", section_name: "Nutrition" },
      { section_id: "11", section_name: "Rehabilitation" }
      ]
    }
    ],

  users: [
  {
    username: "admin",
    role: "admin",
    password: "admin1234",
    firstname: "System",
    lastname: "Administrator",
    phoneNo: "+254700000000",
      module: "all"
  },
  {
    username: "user",
    role: "user",
    password: "user1234",
    firstname: "Regular",
    lastname: "User",
    phoneNo: "+254700000001",
      module: "reports"
    }
  ],

  customizationSets: [
  { name: "Antenatal Clinic", category: "Clinics" },
  { name: "Family Planning Clinic", category: "Clinics" },
  { name: "Immunization Clinic", category: "Clinics" },
  { name: "Chronic Care Clinic", category: "Clinics" },
  { name: "Dental Clinic", category: "Clinics" },
  { name: "Specialist Clinic", category: "Clinics" },
  { name: "Nutrition Clinic", category: "Clinics" },
  { name: "Adolescent Clinic", category: "Clinics" },
  { name: "Mental Health Clinic", category: "Clinics" },
  { name: "Paed Ward", category: "Wards" },
  { name: "Accident and Emergency Ward", category: "Wards" },
  { name: "Maternity Ward", category: "Wards" },
  { name: "Postnatal Ward", category: "Wards" },
  { name: "Main Store", category: "Stores" },
  { name: "HPV Vaccine", category: "Vaccines" },
  { name: "Tetanus Vaccine", category: "Vaccines" },
  { name: "Blood Group", category: "LabTest" },
  ]
};

class SimpleSetup {
  constructor() {
    this.logger = new SimpleLogger();
    this.uploadsDir = path.join(__dirname, "..", "sql", "uploads");
    this.datasetViewsDir = path.resolve(__dirname, "..", "sql", "datasetviews");
    this.dhis2ViewsDir = path.resolve(__dirname, "..", "sql", "dhis2views");
  }

  // Test database connection
  async testConnection() {
    try {
      this.logger.log("Testing database connection...", "info");
      
      // Validate environment variables
      const requiredVars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
      }

      const client = await pool.connect();
      const result = await client.query("SELECT NOW() as current_time, current_database() as database_name, current_user as username");
      const dbInfo = result.rows[0];
      
      this.logger.log(`Connected to database: ${dbInfo.database_name} as user: ${dbInfo.username}`, "success");
      client.release();
      return true;
    } catch (error) {
      this.logger.log(`Database connection failed: ${error.message}`, "error");
      throw error;
    }
  }

  // Execute SQL file
  async executeSqlFile(filename) {
    try {
      this.logger.log(`Executing SQL file: ${filename}`, "info");

      const filePath = join(__dirname, "..", "sql", "tablescripts", filename);

      if (!fs.existsSync(filePath)) {
        throw new Error(`SQL file not found: ${filePath}`);
      }

      const sqlContent = await readFile(filePath, "utf8");
      if (!sqlContent || sqlContent.trim().length === 0) {
        this.logger.log(`SQL file is empty: ${filename}`, "warning");
        return { success: true, statementsExecuted: 0 };
      }

      // Parse SQL statements
      const statements = sqlContent
        .split(";")
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith("--"));

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
          try {
            await pool.query(statement);
            successCount++;
          } catch (error) {
            errorCount++;
          this.logger.log(`Statement error: ${error.message}`, "error");
        }
      }

      const result = { success: errorCount === 0, statementsExecuted: successCount, errors: errorCount };
      this.logger.log(`Completed ${filename}: ${successCount}/${statements.length} statements executed`, 
        errorCount > 0 ? "warning" : "success");
      return result;
    } catch (error) {
      this.logger.log(`Failed to process SQL file ${filename}: ${error.message}`, "error");
      throw error;
    }
  }

  // Setup database structure
  async setupDatabaseStructure() {
    this.logger.log("Setting up database structure...", "info");

      let totalStatements = 0;
      let totalErrors = 0;

    for (const filename of CONFIG.sqlFiles) {
        const result = await this.executeSqlFile(filename);
          totalStatements += result.statementsExecuted;
          totalErrors += result.errors;
    }

    this.logger.log(`Database structure setup completed: ${totalStatements} statements executed, ${totalErrors} errors`, 
      totalErrors > 0 ? "warning" : "success");
    return { success: totalErrors === 0, totalStatements, totalErrors };
  }

  // Create datasets
  async createDatasets() {
    try {
      this.logger.log("Creating datasets...", "info");
      
      await Dataset.sync({ force: false });

      const existingDatasets = await Dataset.findAll({
        where: { dataset_id: CONFIG.datasets.map(d => d.dataset_id) }
      });
      
      const existingIds = existingDatasets.map(dataset => dataset.dataset_id);
      const newDatasets = CONFIG.datasets.filter(d => !existingIds.includes(d.dataset_id));

      if (newDatasets.length === 0) {
        this.logger.log(`All ${CONFIG.datasets.length} datasets already exist`, "success");
        return { success: true, created: 0, existing: CONFIG.datasets.length };
      }

      const createdDatasets = await Dataset.bulkCreate(
        newDatasets.map(dataset => ({
          dataset_id: dataset.dataset_id,
          dataset_name: dataset.dataset_name,
          sections: dataset.sections
        }))
      );

      this.logger.log(`Created ${createdDatasets.length} new datasets, ${existingIds.length} already existed`, "success");
      return { success: true, created: createdDatasets.length, existing: existingIds.length };
    } catch (error) {
      this.logger.log(`Error creating datasets: ${error.message}`, "error");
      throw error;
    }
  }

  // Create users
  async createUsers() {
    try {
      this.logger.log("Creating default users...", "info");
      
      await UserModel.sync({ force: false });

      let createdCount = 0;
      let existingCount = 0;
      let errorCount = 0;

      for (const userData of CONFIG.users) {
        try {
          const existingUser = await UserModel.findOne({
            where: { username: userData.username }
          });

          if (existingUser) {
            this.logger.log(`User '${userData.username}' already exists`, "info");
            existingCount++;
            continue;
          }

          const hashedPassword = await bcrypt.hash(userData.password, 10);
          await UserModel.create({
            username: userData.username,
            role: userData.role,
            password: hashedPassword,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phoneNo: userData.phoneNo,
            module: userData.module
          });
          
          this.logger.log(`User '${userData.username}' created successfully`, "success");
          createdCount++;
        } catch (error) {
          this.logger.log(`Error creating user '${userData.username}': ${error.message}`, "error");
          errorCount++;
        }
      }

      this.logger.log(`User creation completed: ${createdCount} created, ${existingCount} existing, ${errorCount} errors`, 
        errorCount > 0 ? "warning" : "success");
      return { success: errorCount === 0, created: createdCount, existing: existingCount, errors: errorCount };
    } catch (error) {
      this.logger.log(`Error creating users: ${error.message}`, "error");
      throw error;
    }
  }

  // Create facility table
  async createFacilityTable() {
    try {
      this.logger.log("Creating facility table...", "info");
      
      await Facility.sync({ force: false });
      
      this.logger.log("Facility table created/verified successfully", "success");
      return { success: true };
    } catch (error) {
      this.logger.log(`Error creating facility table: ${error.message}`, "error");
      throw error;
    }
  }

  // Create customization sets
  async createCustomizationSets() {
    try {
      this.logger.log("Creating CustomizationSets...", "info");

      await CustomizationSet.sync({ force: false });

      let insertedCount = 0;
      let skippedCount = 0;

      for (const row of CONFIG.customizationSets) {
        // Check if the customization set already exists
        const checkQuery = `
          SELECT id FROM reporting.customizationset 
          WHERE name = $1 AND mapping_id = $2
        `;
        
        const existingRecord = await pool.query(checkQuery, [row.name, 0]);

        if (existingRecord.rows.length === 0) {
          // Insert new record
          const insertQuery = `
            INSERT INTO reporting.customizationset (name, category, mapping_id, mapping_name, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id;
          `;

          const result = await pool.query(insertQuery, [row.name, row.category, 0, null]);
          insertedCount++;
        } else {
          skippedCount++;
        }
      }

      this.logger.log(`CustomizationSets setup completed: ${insertedCount} inserted, ${skippedCount} skipped`, "success");
      return { success: true, inserted: insertedCount, skipped: skippedCount };
    } catch (error) {
      this.logger.log(`Error creating CustomizationSets: ${error.message}`, "error");
      throw error;
    }
  }

  // Ensure reporting schema exists (from uploads.js)
  async ensureReportingSchema() {
    try {
      const createSchemaSQL = `CREATE SCHEMA IF NOT EXISTS reporting;`;
      await pool.query(createSchemaSQL);
      this.logger.log("✅ Reporting schema ensured", "success");
      return true;
    } catch (error) {
      this.logger.log(`Error creating reporting schema: ${error.message}`, "error");
      throw error;
    }
  }

  // Upload CSV files
  async uploadCSVFiles() {
    try {
      this.logger.log("Processing CSV files...", "info");
      
      // Ensure reporting schema exists
      await this.ensureReportingSchema();
      
      if (!fs.existsSync(this.uploadsDir)) {
        this.logger.log(`Uploads directory not found: ${this.uploadsDir}`, "warning");
        return { success: true, filesProcessed: 0 };
      }

      const files = fs.readdirSync(this.uploadsDir).filter(file => file.endsWith(".csv"));
      
      if (files.length === 0) {
        this.logger.log("No CSV files found in uploads directory", "info");
        return { success: true, filesProcessed: 0 };
      }

      let totalRows = 0;
      let totalInserted = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          const filePath = path.join(this.uploadsDir, file);
          const tableName = file.replace(".csv", "").toLowerCase();
          
          this.logger.log(`Processing file: ${file}`, "info");
          
          // Parse CSV
          const csvData = await this.parseCSV(filePath);
          this.logger.log(`Parsed ${csvData.length} rows from ${file}`, "info");
          
          // Create table and insert data
          await this.createTableFromCSV(tableName, csvData);
          
          // Alter column types for specific tables
          await this.alterColumnTypes(tableName);
          
          const insertedRows = await this.insertData(tableName, csvData);
          
          totalRows += csvData.length;
          totalInserted += insertedRows;
          
          this.logger.log(`Successfully uploaded ${file}: ${insertedRows}/${csvData.length} rows`, "success");
    } catch (error) {
          this.logger.log(`Error uploading ${file}: ${error.message}`, "error");
          errorCount++;
        }
      }

      this.logger.log(`CSV upload completed: ${totalInserted}/${totalRows} rows inserted, ${errorCount} errors`, 
        errorCount > 0 ? "warning" : "success");
      return { success: errorCount === 0, filesProcessed: files.length, totalRows, totalInserted, errors: errorCount };
    } catch (error) {
      this.logger.log(`Error processing CSV files: ${error.message}`, "error");
      throw error;
    }
  }

  // Parse CSV file
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }

  // Check if table already exists
  async checkTableExists(tableName) {
    try {
      const checkTableSQL = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'reporting'
          AND table_name = $1
        );
      `;
      
      const result = await pool.query(checkTableSQL, [tableName]);
      return result.rows[0].exists;
    } catch (error) {
      this.logger.log(`Error checking if table ${tableName} exists: ${error.message}`, "error");
      return false;
    }
  }

  // Create table from CSV data
  async createTableFromCSV(tableName, data) {
    if (!data || data.length === 0) {
      throw new Error("No data provided to create table");
    }

    // Check if table already exists
    const tableExists = await this.checkTableExists(tableName);
    
    if (tableExists) {
      this.logger.log(`Table ${tableName} already exists, skipping creation`, "info");
      return;
    }

    this.logger.log(`Creating new table ${tableName}`, "info");

    const columns = Object.keys(data[0]);
    const cleanColumns = columns.map(col => {
      let cleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      if (cleanCol === "id") cleanCol = "csv_id";
      if (cleanCol === "created_at" || cleanCol === "updated_at") {
        cleanCol = `csv_${cleanCol}`;
      }
      return cleanCol;
    });

    const uniqueColumns = [...new Set(cleanColumns)];

    // Detect column types
    const columnDefinitions = uniqueColumns.map(cleanCol => {
      const isNumeric = data.every(row => {
          const value = row[columns[uniqueColumns.indexOf(cleanCol)]];
        return value === null || value === undefined || value === "" || /^\d+$/.test(value.toString());
      });

      const hasLargeNumbers = data.some(row => {
          const value = row[columns[uniqueColumns.indexOf(cleanCol)]];
        return value && /^\d+$/.test(value.toString()) && parseInt(value) > 2147483647;
        });

        if (isNumeric) {
        return hasLargeNumbers ? `"${cleanCol}" BIGINT` : `"${cleanCol}" INTEGER`;
        } else {
          return `"${cleanCol}" TEXT`;
        }
    }).join(", ");

    const createTableSQL = `
      CREATE TABLE reporting."${tableName}" (
        id SERIAL PRIMARY KEY,
        ${columnDefinitions},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableSQL);
    this.logger.log(`Table ${tableName} created with ${uniqueColumns.length} columns`, "success");
  }

  // Insert data into table
  async insertData(tableName, data) {
    if (!data || data.length === 0) {
      return 0;
    }

    // Check if table exists before trying to insert
    const tableExists = await this.checkTableExists(tableName);
    if (!tableExists) {
      this.logger.log(`Table ${tableName} does not exist, skipping data insertion`, "warning");
      return 0;
    }

    const columns = Object.keys(data[0]);
    const cleanColumns = columns.map(col => {
      let cleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      if (cleanCol === "id") cleanCol = "csv_id";
      if (cleanCol === "created_at" || cleanCol === "updated_at") {
        cleanCol = `csv_${cleanCol}`;
      }
      return cleanCol;
    });

    const uniqueColumns = [...new Set(cleanColumns)];
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const placeholders = batch.map((_, rowIndex) => {
        const rowPlaceholders = uniqueColumns.map((_, colIndex) => 
              `$${rowIndex * uniqueColumns.length + colIndex + 1}`
          );
          return `(${rowPlaceholders.join(", ")})`;
      }).join(", ");

      const values = batch.flatMap(row =>
        uniqueColumns.map(cleanCol => {
          const originalCol = columns.find((col, index) => {
            let testCleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
            if (testCleanCol === "id") testCleanCol = "csv_id";
            if (testCleanCol === "created_at" || testCleanCol === "updated_at") {
              testCleanCol = `csv_${testCleanCol}`;
            }
            return testCleanCol === cleanCol;
          });
          return row[originalCol] || null;
        })
      );

      const insertSQL = `
        INSERT INTO reporting."${tableName}" (${uniqueColumns.map(col => `"${col}"`).join(", ")})
        VALUES ${placeholders}
        ON CONFLICT DO NOTHING;
      `;

      const result = await pool.query(insertSQL, values);
      totalInserted += result.rowCount;
    }

    return totalInserted;
  }

  // Clean and convert column data to integers (from uploads.js)
  async cleanAndConvertColumn(tableName, columnName) {
    try {
      // First check if column exists and its current type
      const checkColumnSQL = `
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'reporting' 
        AND table_name = $1 
        AND column_name = $2;
      `;
      
      const columnInfo = await pool.query(checkColumnSQL, [tableName, columnName]);
      
      if (columnInfo.rows.length === 0) {
        this.logger.log(`Column ${columnName} does not exist in table ${tableName}, skipping conversion`, "warning");
        return;
      }
      
      const currentType = columnInfo.rows[0].data_type;
      
      // If already integer type, just clean nulls and invalid values
      if (currentType === 'integer' || currentType === 'bigint') {
        const cleanSQL = `
          UPDATE reporting."${tableName}"
          SET ${columnName} = CASE 
            WHEN ${columnName} IS NULL THEN 0
            WHEN ${columnName}::text ~ '^[0-9]+$' THEN ${columnName}
            ELSE 0
          END;
        `;
        await pool.query(cleanSQL);
        this.logger.log(`Column ${columnName} cleaned (already integer type) for table ${tableName}`, "info");
      return;
    }

      // If text type, convert to integer
      const tempColumnName = `${columnName}_temp`;
      const createTempColumnSQL = `
        ALTER TABLE reporting."${tableName}"
        ADD COLUMN ${tempColumnName} int;
      `;
      const updateTempColumnSQL = `
        UPDATE reporting."${tableName}"
        SET ${tempColumnName} = CASE 
          WHEN ${columnName} IS NULL THEN 0
          WHEN ${columnName} ~ '^[0-9]+$' THEN CAST(${columnName} AS int)
          ELSE 0
        END;
      `;
      const dropOldColumnSQL = `
        ALTER TABLE reporting."${tableName}"
        DROP COLUMN ${columnName};
      `;
      const renameTempColumnSQL = `
        ALTER TABLE reporting."${tableName}"
        RENAME COLUMN ${tempColumnName} TO ${columnName};
      `;

      await pool.query(createTempColumnSQL);
      await pool.query(updateTempColumnSQL);
      await pool.query(dropOldColumnSQL);
      await pool.query(renameTempColumnSQL);
      this.logger.log(`Column ${columnName} converted to int for table ${tableName}`, "info");
        } catch (error) {
      this.logger.log(`Error cleaning and converting column ${columnName} for table ${tableName}: ${error.message}`, "error");
      throw error;
    }
  }

  // Alter column types for specific tables (from uploads.js)
  async alterColumnTypes(tableName) {
    const columnMappings = {
      'dhis_eafya_mapping_commodities': 'eafya_product_id',
      'dhis_eafya_mapping_conditions_final': 'eafya_disease_id',
      'dhis_eafya_mapping_familyplanning': 'eafya_id',
      'dhis_eafya_mapping_labtests': 'eafya_labtest_id',
      'dhis_eafya_mapping_vaccines': 'eafya_vaccine_id'
    };

    if (columnMappings[tableName]) {
      // Check if table exists before trying to alter columns
      const tableExists = await this.checkTableExists(tableName);
      if (tableExists) {
        await this.cleanAndConvertColumn(tableName, columnMappings[tableName]);
      } else {
        this.logger.log(`Table ${tableName} does not exist, skipping column type conversion`, "warning");
      }
    }
  }

  // Read SQL files from directory
  readSqlFiles(dir) {
    if (!fs.existsSync(dir)) {
      this.logger.log(`Directory not found: ${dir}`, "warning");
      return [];
    }

    const files = fs
      .readdirSync(dir)
      .filter(f => f.toLowerCase().endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    this.logger.log(`Found ${files.length} SQL files`, "info");
    return files.map(f => ({ name: f, full: path.join(dir, f) }));
  }

  // Extract view names from SQL content
  extractViewNames(sql) {
    const results = [];
    const vRe = /create\s+(?:or\s+replace\s+)?view\s+(?:if\s+not\s+exists\s+)?([^\s(]+)\s/gi;

    let m;
    while ((m = vRe.exec(sql)) !== null) {
      results.push({ type: "view", name: m[1] });
    }
    return results;
  }

  // Drop views before recreating them
  async dropViewsBeforeRecreate(client, files) {
    this.logger.log("Dropping existing views before recreation...", "info");
    
    const allViews = [];
    
    // Collect all view names from all files
    for (const file of files) {
      const sql = fs.readFileSync(file.full, "utf8");
      const views = this.extractViewNames(sql);
      allViews.push(...views);
    }

    // Remove duplicates
    const uniqueViews = [];
    const seen = new Set();
    for (const view of allViews) {
      const key = `${view.type}:${view.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueViews.push(view);
      }
    }

    // Drop views in reverse order
    for (const view of uniqueViews.reverse()) {
      const dropCommands = [
        `DROP VIEW IF EXISTS ${view.name} CASCADE;`,
        `DROP TABLE IF EXISTS ${view.name} CASCADE;`,
      ];

      for (const dropSql of dropCommands) {
        try {
          await client.query(dropSql);
          this.logger.log(`   Dropped ${view.type}: ${view.name}`, "info");
          break; // If one command succeeds, no need to try others
        } catch (err) {
          // Continue to next command if this one fails
        }
      }
    }
  }

  // Execute individual view file
  async executeViewFile(client, file) {
    try {
      const sql = fs.readFileSync(file.full, "utf8");
      this.logger.log(`Executing: ${file.name}`, "info");
      await client.query(sql);
      this.logger.log(`✅ ${file.name} executed successfully`, "success");
      return { success: true };
    } catch (error) {
      this.logger.log(`❌ Error executing ${file.name}: ${error.message}`, "error");
      return { success: false, error: error.message };
    }
  }

  // Setup views
  async setupViews() {
    try {
      this.logger.log("Setting up views...", "info");
      
      const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });

      await client.connect();
      this.logger.log("Connected to database for views setup", "info");

      // Collect all files from existing directories only
      const allViewFiles = [];
      const datasetViewsFiles = this.readSqlFiles(this.datasetViewsDir);
      const dhis2ViewsFiles = this.readSqlFiles(this.dhis2ViewsDir);
      
      allViewFiles.push(...datasetViewsFiles, ...dhis2ViewsFiles);

      // Drop existing views before recreating them
      if (allViewFiles.length > 0) {
        await this.dropViewsBeforeRecreate(client, allViewFiles);
      }

      let totalSuccessCount = 0;
      let totalErrorCount = 0;
      let totalFilesProcessed = 0;

      // Process dataset views directory first
      if (datasetViewsFiles.length > 0) {
        this.logger.log(`Processing dataset views from ${datasetViewsFiles.length} files...`, "info");
        for (const file of datasetViewsFiles) {
          const result = await this.executeViewFile(client, file);
          totalSuccessCount += result.success ? 1 : 0;
          totalErrorCount += result.success ? 0 : 1;
          totalFilesProcessed++;
        }
      }

      // Process DHIS2 views directory second
      if (dhis2ViewsFiles.length > 0) {
        this.logger.log(`Processing DHIS2 views from ${dhis2ViewsFiles.length} files...`, "info");
        for (const file of dhis2ViewsFiles) {
          const result = await this.executeViewFile(client, file);
          totalSuccessCount += result.success ? 1 : 0;
          totalErrorCount += result.success ? 0 : 1;
          totalFilesProcessed++;
        }
      }

      await client.end();
      
      if (totalFilesProcessed === 0) {
        this.logger.log("No view SQL files found in any directory", "info");
        return { success: true, filesProcessed: 0, errors: 0 };
      }

      this.logger.log(`Views setup completed: ${totalSuccessCount} successful, ${totalErrorCount} errors`, 
        totalErrorCount > 0 ? "warning" : "success");
      return { success: totalErrorCount === 0, filesProcessed: totalFilesProcessed, errors: totalErrorCount };
    } catch (error) {
      this.logger.log(`Error setting up views: ${error.message}`, "error");
      throw error;
    }
  }

  // Main execution function
  async run() {
    this.logger.log("Starting database setup...", "info");
    this.logger.log("=".repeat(40), "info");

    try {
      // Step 1: Test connection
      //await this.testConnection();

      // Step 2: Setup database structure
      //await this.setupDatabaseStructure();

      // Step 3: Create datasets
      //await this.createDatasets();

      // Step 4: Create users
      //await this.createUsers();

      // Step 5: Create facility table
      //await this.createFacilityTable();

      // Step 6: Create CustomizationSets
      //await this.createCustomizationSets();

      // Step 7: Upload CSV files
      await this.uploadCSVFiles();

      // Step 8: Setup views
      //await this.setupViews();

      // Print summary
      this.logger.printSummary();
      this.printCredentials();
      
    } catch (error) {
      this.logger.log(`Setup failed: ${error.message}`, "error");
      this.logger.printSummary();
      throw error;
    } finally {
      await pool.end();
      this.logger.log("Database connection closed", "info");
    }
  }

  // Print login credentials
  printCredentials() {
    console.log("\n" + "=".repeat(60));
    console.log("🔑 LOGIN CREDENTIALS");
    console.log("=".repeat(60));

    console.log("\n👤 Admin User:");
    console.log(`   Username: ${CONFIG.users[0].username}`);
    console.log(`   Password: ${CONFIG.users[0].password}`);
    console.log(`   Role: ${CONFIG.users[0].role} (Full access)`);

    console.log("\n👤 Regular User:");
    console.log(`   Username: ${CONFIG.users[1].username}`);
    console.log(`   Password: ${CONFIG.users[1].password}`);
    console.log(`   Role: ${CONFIG.users[1].role} (Reports access)`);
  }
}

// Run the setup
const setup = new SimpleSetup();
setup.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

export { SimpleSetup };