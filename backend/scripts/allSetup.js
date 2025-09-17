import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { sequelize } from "../config/database.js";
import Dataset from "../models/dataset.js";
import UserModel from "../models/usermodel.js";
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

// Enhanced logging and tracking utilities
class Logger {
  constructor() {
    this.startTime = Date.now();
    this.steps = [];
    this.errors = [];
    this.warnings = [];
  }

  logStep(stepNumber, stepName, status, details = "", duration = null) {
    const timestamp = new Date().toISOString();
    const step = {
      stepNumber,
      stepName,
      status, // 'success', 'error', 'warning', 'info'
      details,
      timestamp,
      duration,
    };
    this.steps.push(step);

    const statusIcon = this.getStatusIcon(status);
    const durationStr = duration ? ` (${duration}ms)` : "";
    console.log(
      `\n${statusIcon} Step ${stepNumber}: ${stepName}${durationStr}`
    );

    if (details) {
      console.log(`   Details: ${details}`);
    }

    if (status === "error") {
      this.errors.push(step);
    } else if (status === "warning") {
      this.warnings.push(step);
    }
  }

  getStatusIcon(status) {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📋";
    }
  }

  logInfo(message) {
    console.log(`ℹ️  ${message}`);
  }

  logError(message, error = null) {
    console.error(`❌ ${message}`);
    if (error) {
      console.error(`   Error: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack.split("\n")[1]?.trim()}`);
      }
    }
  }

  logWarning(message) {
    console.warn(`⚠️  ${message}`);
  }

  logSuccess(message) {
    console.log(`✅ ${message}`);
  }

  printFinalSummary() {
    const totalDuration = Date.now() - this.startTime;
    const successCount = this.steps.filter(
      (s) => s.status === "success"
    ).length;
    const errorCount = this.steps.filter((s) => s.status === "error").length;
    const warningCount = this.steps.filter(
      (s) => s.status === "warning"
    ).length;

    console.log("\n" + "=".repeat(80));
    console.log("🏁 UNIFIED SETUP SUMMARY");
    console.log("=".repeat(80));
    console.log(`⏱️  Total Duration: ${this.formatDuration(totalDuration)}`);
    console.log(`📊 Steps Completed: ${successCount}/${this.steps.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`⚠️  Warnings: ${warningCount}`);
    console.log("");

    // Detailed step breakdown
    console.log("📋 STEP-BY-STEP BREAKDOWN:");
    console.log("-".repeat(80));
    this.steps.forEach((step) => {
      const icon = this.getStatusIcon(step.status);
      const duration = step.duration ? ` (${step.duration}ms)` : "";
      console.log(
        `${icon} Step ${step.stepNumber}: ${step.stepName}${duration}`
      );
      if (step.details) {
        console.log(`   ${step.details}`);
      }
    });

    // Errors summary
    if (this.errors.length > 0) {
      console.log("\n❌ ERRORS ENCOUNTERED:");
      console.log("-".repeat(80));
      this.errors.forEach((error) => {
        console.log(`❌ Step ${error.stepNumber}: ${error.stepName}`);
        console.log(`   ${error.details}`);
      });
    }

    // Warnings summary
    if (this.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      console.log("-".repeat(80));
      this.warnings.forEach((warning) => {
        console.log(`⚠️  Step ${warning.stepNumber}: ${warning.stepName}`);
        console.log(`   ${warning.details}`);
      });
    }

    console.log("\n" + "=".repeat(80));
    if (errorCount === 0) {
      console.log("🎉 SETUP COMPLETED SUCCESSFULLY!");
    } else {
      console.log(
        "⚠️  SETUP COMPLETED WITH ERRORS - Please review and fix issues above"
      );
    }
    console.log("=".repeat(80));
  }

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
}

// Configuration
const sqlFiles = [
  "deleteAllTables.sql",
  "001_import_tables.sql",
  "002_stage_tables.sql",
  "003_dwh_tables.sql"
];

const datasets = [
  {
    dataset_id: "HMIS_105_01",
    dataset_name:
      "HMIS 105:01 - OPD Monthly Report (Attendances, Referrals, Conditions)",
    sections: [
      { section_id: "1.1", section_name: "Attendance and Referral" },
      { section_id: "1.3.1", section_name: "Epidemic Prone Diseases" },
      {
        section_id: "1.3.2",
        section_name: "Other Infectious / Communicable Diseases",
      },
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
      { section_id: "1.3.29", section_name: "Gender Based Violence Services" },
    ],
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
      { section_id: "2.6.4", section_name: "Vaccine Availability" },
    ],
  },
  {
    dataset_id: "HMIS_105_06",
    dataset_name: "HMIS 105:06 - OPD Monthly Report (Essential Medicines)",
    sections: [
      {
        section_id: "6.1",
        section_name: "Essential Medicines and Health Supplies",
      },
    ],
  },
  {
    dataset_id: "HMIS_105_10",
    dataset_name: "HMIS 105:10 - OPD Monthly Report (Laboratory)",
    sections: [
      { section_id: "10.1", section_name: "Total Laboratory Client Visits" },
      { section_id: "10.1.2", section_name: "Specimen Collected" },
      { section_id: "10.2.1", section_name: "Laboratory Routine Tests" },
    ],
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
      { section_id: "11", section_name: "Rehabilitation" },
    ],
  },
];

const defaultUsers = [
  {
    username: "admin",
    role: "admin",
    password: "admin1234",
    firstname: "System",
    lastname: "Administrator",
    phoneNo: "+254700000000",
    module: "all",
  },
  {
    username: "user",
    role: "user",
    password: "user1234",
    firstname: "Regular",
    lastname: "User",
    phoneNo: "+254700000001",
    module: "reports",
  },
];

const materializedViewIds = [
  // OPD Clinics
  { name: "General Outpatient", category: "Clinics" },
  { name: "Antenatal Clinic", category: "Clinics" },
  { name: "Family Planning", category: "Clinics" },
  { name: "YCC or Immunization Clinic", category: "Clinics" },
  { name: "Eye Clinic", category: "Clinics" },
  { name: "ENT", category: "Clinics" },
  { name: "ART", category: "Clinics" },
  { name: "Chronic Care Clinic", category: "Clinics" },
  { name: "Dental Clinic", category: "Clinics" },

  // Specialized Clinics
  { name: "NICU OP REVIEWS", category: "Clinics" },
  { name: "Accident & Emergency Clinic", category: "Clinics" },
  { name: "Specialist Clinic", category: "Clinics" },
  { name: "Cervical Cancer Screening", category: "Clinics" },
  { name: "Elective Surgical Procedures", category: "Clinics" },
  { name: "Postnatal Review OP Clinic", category: "Clinics" },
  { name: "Nutrition Clinic", category: "Clinics" },
  { name: "Adolescent Clinic", category: "Clinics" },
  { name: "Mental Health Clinic", category: "Clinics" },
  { name: "Immunisation/EPI", category: "Clinics" },

  // Wards
  { name: "Gynaecology Ward", category: "Wards" },
  { name: "Paed Ward", category: "Wards" },
  { name: "Surgical Ward", category: "Wards" },
  { name: "Accident and Emergency Ward", category: "Wards" },
  { name: "Maternity Ward", category: "Wards" },
  { name: "NICU", category: "Wards" },
  { name: "ICU", category: "Wards" },
  { name: "Postnatal Ward", category: "Wards" },

  // Theatre Rooms
  { name: "Main Theatre", category: "Theatres" },
  { name: "Eye Theatre", category: "Theatres" },
  { name: "ENT Theatre", category: "Theatres" },

  // Stores and Vaccines
  { name: "Main Store", category: "Stores" },
  { name: "HPV Vaccine", category: "Vaccines" },
];

class UnifiedSetup {
  constructor() {
    this.logger = new Logger();
    this.uploadsDir = path.join(__dirname, "..", "sql", "uploads");
    this.materializedViewsDir = path.resolve(
      __dirname,
      "..",
      "sql",
      "materializedviews"
    );
    this.viewsDir = path.resolve(__dirname, "..", "sql", "views");
    this.csvResults = [];
    this.csvErrors = [];
    this.dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };
    this.setupSteps = [
      { id: 1, name: "Database Connection Test" },
      { id: 2, name: "Database Structure Setup" },
      { id: 3, name: "Datasets Creation" },
      { id: 4, name: "Default Users Creation" },
      { id: 5, name: "Materialized View IDs Creation" },
      { id: 6, name: "CSV Files Upload" },
      { id: 7, name: "Views Setup" },
    ];
  }

  async executeWithTiming(stepId, stepName, fn, details = "") {
    const stepStartTime = Date.now();
    try {
      this.logger.logInfo(`Starting ${stepName}...`);
      const result = await fn();
      const duration = Date.now() - stepStartTime;

      if (result === true || result === undefined) {
        this.logger.logStep(stepId, stepName, "success", details, duration);
      } else if (result === false) {
        this.logger.logStep(
          stepId,
          stepName,
          "warning",
          details || "Completed with warnings",
          duration
        );
      } else {
        this.logger.logStep(stepId, stepName, "success", details, duration);
      }
      return result;
    } catch (error) {
      const duration = Date.now() - stepStartTime;
      this.logger.logStep(stepId, stepName, "error", error.message, duration);
      this.logger.logError(`Failed to execute ${stepName}`, error);
      throw error;
    }
  }

  // 1. Test database connection
  async testConnection() {
    try {
      this.logger.logInfo("Testing database connection...");

      // Validate environment variables first
      const missingVars = [];
      if (!process.env.DB_HOST) missingVars.push("DB_HOST");
      if (!process.env.DB_PORT) missingVars.push("DB_PORT");
      if (!process.env.DB_NAME) missingVars.push("DB_NAME");
      if (!process.env.DB_USER) missingVars.push("DB_USER");
      if (!process.env.DB_PASSWORD) missingVars.push("DB_PASSWORD");

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required environment variables: ${missingVars.join(", ")}`
        );
      }

      const client = await pool.connect();

      const result = await client.query(
        "SELECT NOW() as current_time, current_database() as database_name, current_user as username"
      );

      const dbInfo = result.rows[0];
      const details = `Connected to database: ${dbInfo.database_name} as user: ${dbInfo.username}`;

      this.logger.logSuccess("Database connection established successfully!");
      this.logger.logInfo(`   Database: ${dbInfo.database_name}`);
      this.logger.logInfo(`   User: ${dbInfo.username}`);
      this.logger.logInfo(`   Time: ${dbInfo.current_time}`);

      client.release();
      return { success: true, details };
    } catch (error) {
      let errorDetails = error.message;

      if (error.message.includes("password")) {
        errorDetails +=
          ". Please check your .env file and ensure DB_PASSWORD is set correctly.";
      } else if (error.message.includes("ECONNREFUSED")) {
        errorDetails += ". Check if PostgreSQL is running and accessible.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorDetails += ". Check if DB_HOST is correct and accessible.";
      } else if (
        error.message.includes("database") &&
        error.message.includes("does not exist")
      ) {
        errorDetails += ". The specified database does not exist.";
      }

      this.logger.logError("Database connection failed", error);
      throw new Error(errorDetails);
    }
  }

  // 2. Execute SQL files for database structure
  async executeSqlFile(filename) {
    try {
      this.logger.logInfo(`Executing SQL file: ${filename}`);

      const filePath = join(__dirname, "..", "sql", "tablescripts", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`SQL file not found: ${filePath}`);
      }

      const sqlContent = await readFile(filePath, "utf8");

      if (!sqlContent || sqlContent.trim().length === 0) {
        this.logger.logWarning(`SQL file is empty: ${filename}`);
        return { success: true, statementsExecuted: 0, errors: 0 };
      }

      // Better SQL statement parsing that handles multi-line statements
      const statements = [];
      const lines = sqlContent.split("\n");
      let currentStatement = "";
      let inComment = false;

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) continue;

        // Handle comments
        if (trimmedLine.startsWith("--")) {
          continue; // Skip comment lines
        }

        // Add line to current statement
        currentStatement += (currentStatement ? " " : "") + trimmedLine;

        // Check if statement ends with semicolon
        if (trimmedLine.endsWith(";")) {
          const statement = currentStatement.slice(0, -1).trim(); // Remove trailing semicolon
          if (statement.length > 0) {
            statements.push(statement);
          }
          currentStatement = "";
        }
      }

      // Add any remaining statement (in case file doesn't end with semicolon)
      if (currentStatement.trim().length > 0) {
        statements.push(currentStatement.trim());
      }

      this.logger.logInfo(
        `   Found ${statements.length} SQL statements to execute`
      );

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            await pool.query(statement);
            successCount++;
            this.logger.logInfo(
              `   ✅ Statement ${i + 1} executed successfully`
            );
          } catch (error) {
            errorCount++;
            const errorMsg = `Statement ${i + 1}: ${error.message}`;
            errors.push(errorMsg);
            this.logger.logError(`   ❌ ${errorMsg}`);

            // Log the problematic statement for debugging
            this.logger.logInfo(
              `   Problematic statement: ${statement.substring(0, 100)}...`
            );
          }
        }
      }

      const details = `Executed ${successCount}/${statements.length} statements successfully. ${errorCount} errors.`;

      if (errorCount > 0) {
        this.logger.logWarning(
          `Completed ${filename} with ${errorCount} errors`
        );
        return {
          success: false,
          statementsExecuted: successCount,
          errors: errorCount,
          errorDetails: errors,
        };
      } else {
        this.logger.logSuccess(`Completed ${filename} successfully`);
        return { success: true, statementsExecuted: successCount, errors: 0 };
      }
    } catch (error) {
      this.logger.logError(`Failed to process SQL file ${filename}`, error);
      throw error;
    }
  }

  // 3. Create database structure
  async setupDatabaseStructure() {
    this.logger.logInfo("Setting up database structure...");

    try {
      let totalStatements = 0;
      let totalErrors = 0;
      let totalFiles = 0;
      const fileResults = [];

      for (const filename of sqlFiles) {
        totalFiles++;
        const result = await this.executeSqlFile(filename);
        fileResults.push({ filename, ...result });

        if (result.statementsExecuted !== undefined) {
          totalStatements += result.statementsExecuted;
        }
        if (result.errors !== undefined) {
          totalErrors += result.errors;
        }
      }

      const details = `Processed ${totalFiles} SQL files. Executed ${totalStatements} statements with ${totalErrors} errors.`;

      if (totalErrors > 0) {
        this.logger.logWarning(
          "Database structure setup completed with errors"
        );
        this.logger.logInfo(details);

        // Log files with errors
        const filesWithErrors = fileResults.filter((f) => f.errors > 0);
        if (filesWithErrors.length > 0) {
          this.logger.logWarning("Files with errors:");
          filesWithErrors.forEach((f) => {
            this.logger.logInfo(`   ${f.filename}: ${f.errors} errors`);
          });
        }

        return { success: false, details, fileResults };
      } else {
        this.logger.logSuccess(
          "Database structure setup completed successfully!"
        );
        this.logger.logInfo(details);
        return { success: true, details, fileResults };
      }
    } catch (error) {
      this.logger.logError("Database structure setup failed", error);
      throw error;
    }
  }

  // 4. Create datasets
  async createDatasets() {
    this.logger.logInfo("Creating datasets...");

    try {
      // Sync the Dataset model to ensure the table exists
      await Dataset.sync({ force: false });

      // Check existing datasets using Sequelize
      const existingDatasets = await Dataset.findAll({
        where: {
          dataset_id: datasets.map((d) => d.dataset_id),
        },
      });

      const existingIds = existingDatasets.map((dataset) => dataset.dataset_id);
      const newDatasets = datasets.filter(
        (d) => !existingIds.includes(d.dataset_id)
      );

      if (newDatasets.length === 0) {
        const details = `All ${datasets.length} datasets already exist`;
        this.logger.logSuccess("All datasets already exist, skipping creation");
        return {
          success: true,
          details,
          created: 0,
          existing: datasets.length,
        };
      }

      // Create new datasets using Sequelize
      const createdDatasets = await Dataset.bulkCreate(
        newDatasets.map((dataset) => ({
          dataset_id: dataset.dataset_id,
          dataset_name: dataset.dataset_name,
          sections: dataset.sections,
        }))
      );

      const details = `Created ${createdDatasets.length} new datasets. ${existingIds.length} already existed.`;
      this.logger.logSuccess("Datasets created successfully!");
      this.logger.logInfo(`Created ${createdDatasets.length} new datasets`);
      this.logger.logInfo(`Skipped ${existingIds.length} existing datasets`);

      return {
        success: true,
        details,
        created: createdDatasets.length,
        existing: existingIds.length,
        createdDatasets: createdDatasets.map((dataset) => dataset.dataset_id),
      };
    } catch (error) {
      this.logger.logError("Error creating datasets", error);
      throw error;
    }
  }

  // 5. Create users
  async createUsers() {
    this.logger.logInfo("Creating default users...");

    try {
      // Sync the UserModel to ensure the table exists
      await UserModel.sync({ force: false });

      let createdCount = 0;
      let existingCount = 0;
      let errorCount = 0;
      const userResults = [];

      for (const userData of defaultUsers) {
        try {
          const existingUser = await UserModel.findOne({
            where: { username: userData.username },
          });

          if (existingUser) {
            this.logger.logInfo(
              `   User '${userData.username}' already exists, skipping...`
            );
            existingCount++;
            userResults.push({
              username: userData.username,
              status: "existing",
            });
            continue;
          }

          const hashedPassword = await bcrypt.hash(userData.password, 10);

          const user = await UserModel.create({
            username: userData.username,
            role: userData.role,
            password: hashedPassword,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phoneNo: userData.phoneNo,
            module: userData.module,
          });
          this.logger.logSuccess(
            `   User '${user.username}' created successfully`
          );
          createdCount++;
          userResults.push({
            username: userData.username,
            status: "created",
            role: userData.role,
          });
        } catch (error) {
          this.logger.logError(
            `   Error creating user '${userData.username}'`,
            error
          );
          errorCount++;
          userResults.push({
            username: userData.username,
            status: "error",
            error: error.message,
          });
        }
      }

      const details = `Created ${createdCount} users, ${existingCount} already existed, ${errorCount} errors.`;

      if (errorCount > 0) {
        this.logger.logWarning("User creation completed with errors");
        this.logger.logInfo(details);
        return {
          success: false,
          details,
          created: createdCount,
          existing: existingCount,
          errors: errorCount,
          userResults,
        };
      } else {
        this.logger.logSuccess("Default users created successfully!");
        this.logger.logInfo(details);
        return {
          success: true,
          details,
          created: createdCount,
          existing: existingCount,
          errors: 0,
          userResults,
        };
      }
    } catch (error) {
      this.logger.logError("Error creating users", error);
      throw error;
    }
  }

  // 6. Create materialized view IDs
  async createMaterializedViewIds() {
    this.logger.logInfo("Creating materialized view IDs...");

    try {
      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'reporting'
          AND table_name = 'materialized_view_ids'
        );
      `;

      const tableExists = await pool.query(checkTableQuery);
      const tableAlreadyExists = tableExists.rows[0].exists;

      if (!tableAlreadyExists) {
        const createTableQuery = `
          CREATE TABLE reporting.materialized_view_ids (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255),
            mapping_id INTEGER,
            mapping_name VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, mapping_id)
          );
        `;

        await pool.query(createTableQuery);
        this.logger.logSuccess(
          "Table 'materialized_view_ids' created successfully"
        );
      } else {
        this.logger.logInfo("Table 'materialized_view_ids' already exists");
      }

      let insertedCount = 0;
      let skippedCount = 0;

      for (const row of materializedViewIds) {
        const insertQuery = `
          INSERT INTO reporting.materialized_view_ids (name, category, mapping_id, mapping_name)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name, mapping_id) DO NOTHING
          RETURNING id;
        `;

        const result = await pool.query(insertQuery, [
          row.name,
          row.category,
          0,
          null,
        ]);

        if (result.rows.length > 0) {
          insertedCount++;
          this.logger.logInfo(`   Inserted: ${row.name} (${row.category})`);
        } else {
          skippedCount++;
          this.logger.logInfo(
            `   Skipped (already exists): ${row.name} (${row.category})`
          );
        }
      }

      const details = `Inserted ${insertedCount} new entries, skipped ${skippedCount} existing entries`;
      this.logger.logSuccess(
        "Materialized view IDs setup completed successfully!"
      );
      this.logger.logInfo(details);

      return {
        success: true,
        details,
        inserted: insertedCount,
        skipped: skippedCount,
      };
    } catch (error) {
      this.logger.logError("Error creating materialized view IDs", error);
      throw error;
    }
  }

  // 7. CSV Upload functionality
  getCSVFiles() {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        this.logger.logWarning(
          `Uploads directory not found: ${this.uploadsDir}`
        );
        return [];
      }
      const files = fs.readdirSync(this.uploadsDir);
      const csvFiles = files.filter((file) => file.endsWith(".csv"));
      this.logger.logInfo(
        `Found ${csvFiles.length} CSV files in uploads directory`
      );
      return csvFiles;
    } catch (error) {
      this.logger.logError("Error reading uploads directory", error);
      return [];
    }
  }

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

  async createTableFromCSV(tableName, data) {
    if (!data || data.length === 0) {
      throw new Error("No data provided to create table");
    }

    const columns = Object.keys(data[0]);
    const cleanColumns = columns.map((col) => {
      let cleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      if (cleanCol === "id") cleanCol = "csv_id";
      if (cleanCol === "created_at" || cleanCol === "updated_at") {
        cleanCol = `csv_${cleanCol}`;
      }
      return cleanCol;
    });

    const uniqueColumns = [...new Set(cleanColumns)];

    const dropTableSQL = `DROP TABLE IF EXISTS reporting."${tableName}" CASCADE;`;
    try {
      await pool.query(dropTableSQL);
      this.logger.logInfo(
        `   Dropped existing table ${tableName} if it existed`
      );
    } catch (error) {
      this.logger.logError(`   Error dropping table ${tableName}`, error);
    }

    // Detect numeric columns and use appropriate data types
    const columnDefinitions = uniqueColumns
      .map((cleanCol) => {
        // Check if this column contains only numeric values
        const isNumeric = data.every((row) => {
          const value = row[columns[uniqueColumns.indexOf(cleanCol)]];
          return (
            value === null ||
            value === undefined ||
            value === "" ||
            /^\d+$/.test(value.toString())
          );
        });

        // Check if this column contains big integers (larger than INT range)
        const hasLargeNumbers = data.some((row) => {
          const value = row[columns[uniqueColumns.indexOf(cleanCol)]];
          return (
            value &&
            /^\d+$/.test(value.toString()) &&
            parseInt(value) > 2147483647
          );
        });

        if (isNumeric) {
          return hasLargeNumbers
            ? `"${cleanCol}" BIGINT`
            : `"${cleanCol}" INTEGER`;
        } else {
          return `"${cleanCol}" TEXT`;
        }
      })
      .join(", ");

    const createTableSQL = `
      CREATE TABLE reporting."${tableName}" (
        id SERIAL PRIMARY KEY,
        ${columnDefinitions},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableSQL);
    this.logger.logInfo(
      `   Table ${tableName} created successfully with ${uniqueColumns.length} columns`
    );
    return true;
  }

  async insertData(tableName, data) {
    if (!data || data.length === 0) {
      this.logger.logInfo(`   No data to insert for table ${tableName}`);
      return 0;
    }

    const columns = Object.keys(data[0]);
    const cleanColumns = columns.map((col) => {
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
    let batchCount = 0;

    this.logger.logInfo(
      `   Inserting ${data.length} rows in batches of ${batchSize}...`
    );

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      batchCount++;

      const placeholders = batch
        .map((_, rowIndex) => {
          const rowPlaceholders = uniqueColumns.map(
            (_, colIndex) =>
              `$${rowIndex * uniqueColumns.length + colIndex + 1}`
          );
          return `(${rowPlaceholders.join(", ")})`;
        })
        .join(", ");

      const values = batch.flatMap((row) =>
        uniqueColumns.map((cleanCol) => {
          const originalCol = columns.find((col, index) => {
            let testCleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
            if (testCleanCol === "id") testCleanCol = "csv_id";
            if (
              testCleanCol === "created_at" ||
              testCleanCol === "updated_at"
            ) {
              testCleanCol = `csv_${testCleanCol}`;
            }
            return testCleanCol === cleanCol;
          });
          return row[originalCol] || null;
        })
      );

      const insertSQL = `
        INSERT INTO reporting."${tableName}" (${uniqueColumns
        .map((col) => `"${col}"`)
        .join(", ")})
        VALUES ${placeholders}
        ON CONFLICT DO NOTHING;
      `;

      const result = await pool.query(insertSQL, values);
      totalInserted += result.rowCount;

      if (
        batchCount % 10 === 0 ||
        batchCount === Math.ceil(data.length / batchSize)
      ) {
        this.logger.logInfo(
          `   Batch ${batchCount}: Inserted ${result.rowCount} rows (${totalInserted}/${data.length} total)`
        );
      }
    }

    this.logger.logInfo(
      `   Completed: ${totalInserted} rows inserted into ${tableName}`
    );
    return totalInserted;
  }

  async uploadCSVFiles() {
    this.logger.logInfo("Starting CSV upload process...");

    const csvFiles = this.getCSVFiles();

    if (csvFiles.length === 0) {
      const details =
        "No CSV files found in uploads directory - skipping CSV upload step";
      this.logger.logInfo(details);
      return {
        success: true,
        details,
        filesProcessed: 0,
        totalRows: 0,
        errors: 0,
      };
    }

    let totalRows = 0;
    let totalInserted = 0;
    let totalErrors = 0;
    const fileResults = [];

    for (const file of csvFiles) {
      const filePath = path.join(this.uploadsDir, file);
      const tableName = file.replace(".csv", "").toLowerCase();

      try {
        this.logger.logInfo(`Processing file: ${file}`);

        const csvData = await this.parseCSV(filePath);
        this.logger.logInfo(`   Parsed ${csvData.length} rows from CSV`);

        await this.createTableFromCSV(tableName, csvData);
        const insertedRows = await this.insertData(tableName, csvData);

        totalRows += csvData.length;
        totalInserted += insertedRows;

        const fileResult = {
          file: file,
          table: `reporting.${tableName}`,
          rows: csvData.length,
          inserted: insertedRows,
          status: "success",
        };

        fileResults.push(fileResult);
        this.csvResults.push(fileResult);

        this.logger.logSuccess(
          `   Successfully uploaded ${file} to reporting.${tableName} (${insertedRows}/${csvData.length} rows)`
        );
      } catch (error) {
        totalErrors++;
        this.logger.logError(`   Error uploading ${file}`, error);

        const fileError = {
          file: file,
          table: `reporting.${tableName}`,
          error: error.message,
          status: "error",
        };

        fileResults.push(fileError);
        this.csvErrors.push(fileError);
      }
    }

    const details = `Processed ${csvFiles.length} files: ${totalInserted}/${totalRows} rows inserted, ${totalErrors} errors`;

    if (totalErrors > 0) {
      this.logger.logWarning(`CSV upload completed with ${totalErrors} errors`);
      this.logger.logInfo(details);
      return {
        success: false,
        details,
        filesProcessed: csvFiles.length,
        totalRows,
        totalInserted,
        errors: totalErrors,
        fileResults,
      };
    } else {
      this.logger.logSuccess("CSV upload completed successfully!");
      this.logger.logInfo(details);
      return {
        success: true,
        details,
        filesProcessed: csvFiles.length,
        totalRows,
        totalInserted,
        errors: 0,
        fileResults,
      };
    }
  }

  // 8. Materialized views functionality
  readSqlFiles(dir) {
    if (!fs.existsSync(dir)) {
      this.logger.logWarning(`Materialized views directory not found: ${dir}`);
      return [];
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".sql"))
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      );

    this.logger.logInfo(`Found ${files.length} materialized view SQL files`);
    return files.map((f) => ({ name: f, full: path.join(dir, f) }));
  }

  extractViews(sql) {
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

  isSafeIdentifier(id) {
    const seg = /(?:[a-z_][a-z0-9_$]*|"[^"]+")/i.source;
    const dotted = new RegExp(`^${seg}(\\.${seg})?$`, "i");
    return dotted.test(id.trim());
  }

  async dropViewsFirst(client, files) {
    const seen = new Set();
    const toDrop = [];

    for (let i = files.length - 1; i >= 0; i--) {
      const sql = fs.readFileSync(files[i].full, "utf8");
      const views = this.extractViews(sql);
      for (const v of views) {
        const key = `${v.type}:${v.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          toDrop.push(v);
        }
      }
    }

    if (toDrop.length === 0) {
      this.logger.logInfo("No views detected to drop.");
      return;
    }

    this.logger.logInfo(`Dropping ${toDrop.length} view(s) before recreate...`);
    let droppedCount = 0;
    let skippedCount = 0;

    for (const v of toDrop) {
      if (!this.isSafeIdentifier(v.name)) {
        this.logger.logWarning(`Skipping suspicious identifier: ${v.name}`);
        skippedCount++;
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
          await client.query(dropSql);
          if (!dropped) {
            this.logger.logInfo(`   DROP -> ${dropSql}`);
            droppedCount++;
            dropped = true;
          }
        } catch (err) {
          // Ignore errors for commands that don't match the object type
          // This is expected behavior when trying different DROP types
        }
      }

      if (!dropped) {
        this.logger.logWarning(
          `   Could not drop ${v.name} - object may not exist or may be protected`
        );
      }
    }

    this.logger.logInfo(
      `Views cleanup completed: ${droppedCount} dropped, ${skippedCount} skipped`
    );
  }

  async setupMaterializedViews() {
    this.logger.logInfo("Setting up materialized views...");

    const files = this.readSqlFiles(this.materializedViewsDir);
    if (files.length === 0) {
      const details =
        "No materialized view SQL files found - skipping materialized views setup";
      this.logger.logInfo(details);
      return { success: true, details, filesProcessed: 0, errors: 0 };
    }

    const client = new Client(this.dbConfig);
    try {
      await client.connect();
      this.logger.logInfo("Connected to database for materialized views setup");

      await this.dropViewsFirst(client, files);

      let successCount = 0;
      let errorCount = 0;
      const fileResults = [];

      for (const f of files) {
        try {
          const sql = fs.readFileSync(f.full, "utf8");
          this.logger.logInfo(`   Executing: ${f.name}`);
          await client.query(sql);
          successCount++;
          fileResults.push({ file: f.name, status: "success" });
          this.logger.logInfo(`   ✅ ${f.name} executed successfully`);
        } catch (error) {
          errorCount++;
          fileResults.push({
            file: f.name,
            status: "error",
            error: error.message,
          });
          this.logger.logError(`   ❌ Error executing ${f.name}`, error);
        }
      }

      const details = `Processed ${files.length} files: ${successCount} successful, ${errorCount} errors`;

      if (errorCount > 0) {
        this.logger.logWarning(
          "Materialized views setup completed with errors"
        );
        this.logger.logInfo(details);
        return {
          success: false,
          details,
          filesProcessed: files.length,
          errors: errorCount,
          fileResults,
        };
      } else {
        this.logger.logSuccess(
          "Materialized views setup completed successfully!"
        );
        this.logger.logInfo(details);
        return {
          success: true,
          details,
          filesProcessed: files.length,
          errors: 0,
          fileResults,
        };
      }
    } catch (err) {
      this.logger.logError("Materialized views setup failed", err);
      throw err;
    } finally {
      await client.end();
      this.logger.logInfo("Database connection closed for materialized views");
    }
  }

  // 8. Views functionality
  async setupViews() {
    this.logger.logInfo("Setting up views...");

    const files = this.readSqlFiles(this.viewsDir);
    if (files.length === 0) {
      const details = "No view SQL files found - skipping views setup";
      this.logger.logInfo(details);
      return { success: true, details, filesProcessed: 0, errors: 0 };
    }

    const client = new Client(this.dbConfig);
    try {
      await client.connect();
      this.logger.logInfo("Connected to database for views setup");

      await this.dropViewsFirst(client, files);

      let successCount = 0;
      let errorCount = 0;
      const fileResults = [];

      for (const f of files) {
        try {
          const sql = fs.readFileSync(f.full, "utf8");
          this.logger.logInfo(`   Executing: ${f.name}`);
          await client.query(sql);
          successCount++;
          fileResults.push({ file: f.name, status: "success" });
          this.logger.logInfo(`   ✅ ${f.name} executed successfully`);
        } catch (error) {
          errorCount++;
          fileResults.push({
            file: f.name,
            status: "error",
            error: error.message,
          });
          this.logger.logError(`   ❌ Error executing ${f.name}`, error);
        }
      }

      const details = `Processed ${files.length} files: ${successCount} successful, ${errorCount} errors`;

      if (errorCount > 0) {
        this.logger.logWarning("Views setup completed with errors");
        this.logger.logInfo(details);
        return {
          success: false,
          details,
          filesProcessed: files.length,
          errors: errorCount,
          fileResults,
        };
      } else {
        this.logger.logSuccess("Views setup completed successfully!");
        this.logger.logInfo(details);
        return {
          success: true,
          details,
          filesProcessed: files.length,
          errors: 0,
          fileResults,
        };
      }
    } catch (err) {
      this.logger.logError("Views setup failed", err);
      throw err;
    } finally {
      await client.end();
      this.logger.logInfo("Database connection closed for views");
    }
  }

  // Main execution function
  async run() {
    this.logger.logInfo("Starting unified database setup...");
    this.logger.logInfo("=====================================");

    try {
      // Step 1: Test database connection
      const connectionResult = await this.executeWithTiming(
        1,
        "Database Connection Test",
        () => this.testConnection(),
        "Validating environment variables and establishing database connection"
      );
      if (!connectionResult.success) {
        throw new Error("Database connection failed");
      }

      // Step 2: Setup database structure
      const structureResult = await this.executeWithTiming(
        2,
        "Database Structure Setup",
        () => this.setupDatabaseStructure(),
        "Creating tables, schemas, and database objects"
      );
      if (!structureResult.success) {
        this.logger.logWarning(
          "Database structure setup completed with errors, but continuing..."
        );
      }

      // Step 3: Create datasets
      const datasetsResult = await this.executeWithTiming(
        3,
        "Datasets Creation",
        () => this.createDatasets(),
        "Creating HMIS datasets and sections"
      );
      if (!datasetsResult.success) {
        this.logger.logWarning(
          "Datasets creation had issues, but continuing..."
        );
      }

      // Step 4: Create users
      const usersResult = await this.executeWithTiming(
        4,
        "Default Users Creation",
        () => this.createUsers(),
        "Creating admin and regular user accounts"
      );
      if (!usersResult.success) {
        this.logger.logWarning("Users creation had issues, but continuing...");
      }

      // Step 5: Create materialized view IDs
      const viewIdsResult = await this.executeWithTiming(
        5,
        "Materialized View IDs Creation",
        () => this.createMaterializedViewIds(),
        "Setting up materialized view identifiers"
      );
      if (!viewIdsResult.success) {
        this.logger.logWarning(
          "Materialized view IDs creation had issues, but continuing..."
        );
      }

      // Step 6: Upload CSV files
      const csvResult = await this.executeWithTiming(
        6,
        "CSV Files Upload",
        () => this.uploadCSVFiles(),
        "Processing and uploading CSV data files"
      );
      if (!csvResult.success) {
        this.logger.logWarning("CSV uploads had issues, but continuing...");
      }

      // Step 7: Setup views
      const viewsResult = await this.executeWithTiming(
        7,
        "Views Setup",
        () => this.setupViews(),
        "Creating views for reporting"
      );
      if (!viewsResult.success) {
        this.logger.logWarning("Views setup had issues, but continuing...");
      }

      // Print comprehensive summary
      this.logger.printFinalSummary();
      this.printCredentials();
    } catch (error) {
      this.logger.logError("Setup failed with fatal error", error);
      this.logger.printFinalSummary();
      throw error;
    } finally {
      await pool.end();
      this.logger.logInfo("Database connection pool closed");
    }
  }

  printCredentials() {
    console.log("\n" + "=".repeat(80));
    console.log("🔑 LOGIN CREDENTIALS");
    console.log("=".repeat(80));

    console.log("\n👤 Admin User:");
    console.log(`   Username: ${defaultUsers[0].username}`);
    console.log(`   Password: ${defaultUsers[0].password}`);
    console.log(
      `   Role: ${defaultUsers[0].role} (Full access to all modules)`
    );
    console.log(
      `   Name: ${defaultUsers[0].firstname} ${defaultUsers[0].lastname}`
    );
    console.log(`   Module: ${defaultUsers[0].module}`);

    console.log("\n👤 Regular User:");
    console.log(`   Username: ${defaultUsers[1].username}`);
    console.log(`   Password: ${defaultUsers[1].password}`);
    console.log(
      `   Role: ${defaultUsers[1].role} (Limited access to reports module)`
    );
    console.log(
      `   Name: ${defaultUsers[1].firstname} ${defaultUsers[1].lastname}`
    );
    console.log(`   Module: ${defaultUsers[1].module}`);

    console.log("\n⚠️  SECURITY NOTICE:");
    console.log(
      "   Remember to change the default passwords after first login!"
    );
    console.log("   These are temporary credentials for initial setup.");

    console.log("\n" + "=".repeat(80));
  }
}

// Run the unified setup
const setup = new UnifiedSetup();
setup.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

export { UnifiedSetup };
