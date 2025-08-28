import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import { pool } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSVUploadService {
	constructor() {
		this.uploadsDir = path.join(__dirname, "..", "sql", "uploads");
		this.results = [];
		this.errors = [];
	}

	/**
	 * Ensure reporting schema exists
	 */
	async ensureReportingSchema() {
		try {
			const createSchemaSQL = `
        CREATE SCHEMA IF NOT EXISTS reporting;
      `;
			await pool.query(createSchemaSQL);
			console.log("✅ Reporting schema ensured");
			return true;
		} catch (error) {
			console.error("Error creating reporting schema:", error);
			throw error;
		}
	}

	/**
	 * Get all CSV files from the uploads directory
	 */
	getCSVFiles() {
		try {
			const files = fs.readdirSync(this.uploadsDir);
			return files.filter((file) => file.endsWith(".csv"));
		} catch (error) {
			console.error("Error reading uploads directory:", error);
			return [];
		}
	}

	/**
	 * Parse CSV file and return data
	 */
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

	/**
	 * Create table from CSV data
	 */
	async createTableFromCSV(tableName, data) {
		if (!data || data.length === 0) {
			throw new Error("No data provided to create table");
		}

		const columns = Object.keys(data[0]);
		const cleanColumns = columns.map((col) => {
			let cleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();

			// Handle column name conflicts with reserved words and our auto-generated columns
			if (cleanCol === "id") {
				cleanCol = "csv_id"; // Rename 'id' to 'csv_id' to avoid conflict
			}
			if (cleanCol === "created_at" || cleanCol === "updated_at") {
				cleanCol = `csv_${cleanCol}`; // Rename timestamp columns to avoid conflict
			}

			return cleanCol;
		});

		// Remove duplicate columns
		const uniqueColumns = [...new Set(cleanColumns)];

		// First, drop the table if it exists to ensure clean structure
		const dropTableSQL = `DROP TABLE IF EXISTS reporting."${tableName}" CASCADE;`;
		try {
			await pool.query(dropTableSQL);
			console.log(`Dropped existing table ${tableName} if it existed`);
		} catch (error) {
			console.error(`Error dropping table ${tableName}:`, error);
			// Continue anyway as the table might not exist
		}

		const columnDefinitions = uniqueColumns
			.map((cleanCol) => {
				return `"${cleanCol}" TEXT`;
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

		try {
			await pool.query(createTableSQL);
			console.log(`Table ${tableName} created successfully`);
			return true;
		} catch (error) {
			console.error(`Error creating table ${tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Insert data into table
	 */
	async insertData(tableName, data) {
		if (!data || data.length === 0) {
			console.log(`No data to insert for table ${tableName}`);
			return 0;
		}

		const columns = Object.keys(data[0]);
		const cleanColumns = columns.map((col) => {
			let cleanCol = col.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();

			// Handle column name conflicts with reserved words and our auto-generated columns
			if (cleanCol === "id") {
				cleanCol = "csv_id"; // Rename 'id' to 'csv_id' to avoid conflict
			}
			if (cleanCol === "created_at" || cleanCol === "updated_at") {
				cleanCol = `csv_${cleanCol}`; // Rename timestamp columns to avoid conflict
			}

			return cleanCol;
		});

		// Remove duplicate columns and get unique column names
		const uniqueColumns = [...new Set(cleanColumns)];

		// Create a mapping from original columns to clean columns
		const columnMapping = {};
		columns.forEach((col, index) => {
			columnMapping[col] = uniqueColumns[index];
		});

		// Process data in batches to avoid parameter limit issues
		const batchSize = 100; // Process 100 rows at a time
		let totalInserted = 0;

		for (let i = 0; i < data.length; i += batchSize) {
			const batch = data.slice(i, i + batchSize);

			// Create placeholders for this batch
			const placeholders = batch
				.map((_, rowIndex) => {
					const rowPlaceholders = uniqueColumns.map(
						(_, colIndex) =>
							`$${
								rowIndex * uniqueColumns.length +
								colIndex +
								1
							}`
					);
					return `(${rowPlaceholders.join(", ")})`;
				})
				.join(", ");

			// Flatten data for this batch, using only unique columns
			const values = batch.flatMap((row) =>
				uniqueColumns.map((cleanCol) => {
					// Find the original column that maps to this clean column
					const originalCol = Object.keys(columnMapping).find(
						(key) => columnMapping[key] === cleanCol
					);
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

			try {
				const result = await pool.query(insertSQL, values);
				totalInserted += result.rowCount;
				console.log(
					`  Batch ${Math.floor(i / batchSize) + 1}: Inserted ${
						result.rowCount
					} rows`
				);
			} catch (error) {
				console.error(
					`Error inserting batch ${
						Math.floor(i / batchSize) + 1
					} into ${tableName}:`,
					error
				);
				throw error;
			}
		}

		console.log(`Total inserted ${totalInserted} rows into ${tableName}`);
		return totalInserted;
	}

  /**
   * Drop table if it exists
   */
  async dropTableIfExists(tableName) {
    const dropTableSQL = `
      DROP TABLE IF EXISTS reporting."${tableName}";
    `;
    try {
      await pool.query(dropTableSQL);
      console.log(`Table ${tableName} dropped successfully`);
    } catch (error) {
      console.error(`Error dropping table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Clean and convert column data to integers
   */
  async cleanAndConvertColumn(tableName, columnName) {
    const tempColumnName = `${columnName}_temp`;
    const createTempColumnSQL = `
      ALTER TABLE reporting."${tableName}"
      ADD COLUMN ${tempColumnName} int;
    `;
    const updateNullsSQL = `
      UPDATE reporting."${tableName}"
      SET ${columnName} = 0
      WHERE ${columnName} IS NULL;
    `;
    const updateTempColumnSQL = `
      UPDATE reporting."${tableName}"
      SET ${tempColumnName} = CAST(${columnName} AS int)
      WHERE ${columnName} ~ '^[0-9]+$';
    `;
    const dropOldColumnSQL = `
      ALTER TABLE reporting."${tableName}"
      DROP COLUMN ${columnName};
    `;
    const renameTempColumnSQL = `
      ALTER TABLE reporting."${tableName}"
      RENAME COLUMN ${tempColumnName} TO ${columnName};
    `;

    try {
      await pool.query(createTempColumnSQL);
      await pool.query(updateNullsSQL);
      await pool.query(updateTempColumnSQL);
      await pool.query(dropOldColumnSQL);
      await pool.query(renameTempColumnSQL);
      console.log(`Column ${columnName} cleaned and converted to int for table ${tableName}`);
    } catch (error) {
      console.error(`Error cleaning and converting column ${columnName} for table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Alter column types for specific tables
   */
  async alterColumnTypes(tableName) {
    const columnMappings = {
      'dhis_eafya_mapping_commodities': 'eafya_product_id',
      'dhis_eafya_mapping_conditions_final': 'eafya_disease_id',
      'dhis_eafya_mapping_familyplanning': 'eafya_id',
      'dhis_eafya_mapping_labtests': 'eafya_labtest_id',
      'dhis_eafya_mapping_vaccines': 'eafya_vaccine_id'
    };

    if (columnMappings[tableName]) {
      await this.cleanAndConvertColumn(tableName, columnMappings[tableName]);
    }
  }

  /**
   * Upload single CSV file
   */
  async uploadCSVFile(fileName) {
    const filePath = path.join(this.uploadsDir, fileName);
    const tableName = fileName.replace('.csv', '').toLowerCase();

    try {
      console.log(`\nProcessing file: ${fileName}`);
      console.log(`Dropping table if exists: reporting.${tableName}`);

      // Drop table if exists
      await this.dropTableIfExists(tableName);

      console.log(`Creating table: reporting.${tableName}`);

			// Parse CSV data
			const csvData = await this.parseCSV(filePath);
			console.log(`Parsed ${csvData.length} rows from CSV`);

			// Create table
			await this.createTableFromCSV(tableName, csvData);

      // Alter column types
      await this.alterColumnTypes(tableName);

      // Insert data
      const insertedRows = await this.insertData(tableName, csvData);

			this.results.push({
				file: fileName,
				table: `reporting.${tableName}`,
				rows: csvData.length,
				inserted: insertedRows,
				status: "success",
			});

			console.log(
				`✅ Successfully uploaded ${fileName} to reporting.${tableName}`
			);
			return true;
		} catch (error) {
			console.error(`❌ Error uploading ${fileName}:`, error.message);
			this.errors.push({
				file: fileName,
				table: `reporting.${tableName}`,
				error: error.message,
				status: "error",
			});
			return false;
		}
	}

	/**
	 * Upload all CSV files
	 */
	async uploadAllCSVFiles() {
		console.log("🚀 Starting CSV upload process...");
		console.log(`📁 Uploads directory: ${this.uploadsDir}`);

		// Ensure reporting schema exists
		await this.ensureReportingSchema();

		const csvFiles = this.getCSVFiles();
		console.log(`📊 Found ${csvFiles.length} CSV files to process`);

		if (csvFiles.length === 0) {
			console.log("No CSV files found in uploads directory");
			return;
		}

		// Process files sequentially to avoid overwhelming the database
		for (const file of csvFiles) {
			await this.uploadCSVFile(file);
		}

		this.printSummary();

		// Print reporting schema summary
		await this.printReportingSummary();
	}

	/**
	 * Upload specific CSV file by name
	 */
	async uploadSpecificFile(fileName) {
		const csvFiles = this.getCSVFiles();
		if (!csvFiles.includes(fileName)) {
			throw new Error(
				`File ${fileName} not found in uploads directory`
			);
		}

		// Ensure reporting schema exists
		await this.ensureReportingSchema();

		return await this.uploadCSVFile(fileName);
	}

	/**
	 * Print upload summary
	 */
	printSummary() {
		console.log("\n" + "=".repeat(60));
		console.log("📊 CSV UPLOAD SUMMARY");
		console.log("=".repeat(60));

		if (this.results.length > 0) {
			console.log("\n✅ SUCCESSFUL UPLOADS:");
			this.results.forEach((result) => {
				console.log(
					`  📁 ${result.file} → ${result.table} (${result.inserted}/${result.rows} rows)`
				);
			});
		}

		if (this.errors.length > 0) {
			console.log("\n❌ FAILED UPLOADS:");
			this.errors.forEach((error) => {
				console.log(
					`  📁 ${error.file} → ${error.table}: ${error.error}`
				);
			});
		}

		console.log(
			`\n📈 Total files processed: ${
				this.results.length + this.errors.length
			}`
		);
		console.log(`✅ Successful: ${this.results.length}`);
		console.log(`❌ Failed: ${this.errors.length}`);
		console.log("=".repeat(60));
	}

	/**
	 * Get upload results
	 */
	getResults() {
		return {
			results: this.results,
			errors: this.errors,
			totalProcessed: this.results.length + this.errors.length,
			successful: this.results.length,
			failed: this.errors.length,
		};
	}

	/**
	 * Clear results
	 */
	clearResults() {
		this.results = [];
		this.errors = [];
	}

	/**
	 * List tables in reporting schema
	 */
	async listReportingTables() {
		try {
			const listTablesSQL = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        ORDER BY table_name;
      `;
			const result = await pool.query(listTablesSQL);
			return result.rows.map((row) => row.table_name);
		} catch (error) {
			console.error("Error listing reporting tables:", error);
			return [];
		}
	}

	/**
	 * Print reporting schema summary
	 */
	async printReportingSummary() {
		const tables = await this.listReportingTables();
		console.log("\n" + "=".repeat(60));
		console.log("📊 REPORTING SCHEMA SUMMARY");
		console.log("=".repeat(60));
		console.log(`📁 Schema: reporting`);
		console.log(`📋 Tables: ${tables.length}`);

		if (tables.length > 0) {
			console.log("\n📊 Tables in reporting schema:");
			tables.forEach((table) => {
				console.log(`  • ${table}`);
			});
		}
		console.log("=".repeat(60));
	}
}

// Export the service
export default CSVUploadService;

// If running directly, execute upload
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log("🚀 Starting CSV upload process...");

	const uploadService = new CSVUploadService();

	// Check if specific file is provided as argument
	const specificFile = process.argv[2];

	if (specificFile) {
		console.log(`📁 Uploading specific file: ${specificFile}`);
		uploadService
			.uploadSpecificFile(specificFile)
			.then(() => {
				uploadService.printSummary();
				process.exit(0);
			})
			.catch((error) => {
				console.error("Error:", error.message);
				process.exit(1);
			});
	} else {
		console.log("📁 Uploading all CSV files...");
		uploadService
			.uploadAllCSVFiles()
			.then(() => {
				process.exit(0);
			})
			.catch((error) => {
				console.error("Error:", error.message);
				process.exit(1);
			});
	}
}
