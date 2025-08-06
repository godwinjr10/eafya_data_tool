const fs = require("fs");
const path = require("path");

/**
 * Clean CSV file by removing null bytes and other problematic characters
 */
function cleanCSVFile(inputFile, outputFile) {
  try {
    console.log(`🧹 Cleaning CSV file: ${inputFile}`);

    // Read the file as buffer first to handle encoding issues
    const buffer = fs.readFileSync(inputFile);
    let content = buffer.toString("utf8");

    // Remove null bytes (0x00)
    content = content.replace(/\0/g, "");

    // Remove other problematic control characters except newlines, carriage returns, and tabs
    content = content.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    // Normalize line endings to Unix style
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Remove any trailing whitespace from lines
    content = content
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");

    // Remove empty lines at the end
    content = content.replace(/\n+$/, "\n");

    // Write the cleaned content
    fs.writeFileSync(outputFile, content, "utf8");

    console.log(`✅ Cleaned CSV saved to: ${outputFile}`);

    // Show file statistics
    const originalSize = buffer.length;
    const cleanedSize = Buffer.byteLength(content, "utf8");
    const linesCount = content.split("\n").length - 1; // -1 for final newline

    console.log(`📊 File Statistics:`);
    console.log(`  Original size: ${originalSize} bytes`);
    console.log(`  Cleaned size: ${cleanedSize} bytes`);
    console.log(
      `  Size difference: ${originalSize - cleanedSize} bytes removed`
    );
    console.log(`  Total lines: ${linesCount}`);

    return {
      success: true,
      linesCount,
      sizeDifference: originalSize - cleanedSize,
    };
  } catch (error) {
    console.error(`❌ Error cleaning CSV file:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate CSV structure and encoding
 */
function validateCSV(filePath) {
  try {
    console.log(`🔍 Validating CSV file: ${filePath}`);

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Check header
    const header = lines[0];
    const expectedColumns = [
      "hmis_id",
      "hmis_code",
      "hmis_name",
      "hmis_section",
      "hmis_section_id",
      "dhis2_dataElement_id",
      "dhis2_code",
      "dhis2_name",
      "dhis2_shortName",
      "dhis2_dataset",
      "dhis2_categoryCombo_id",
      "dhis2_categoryOptionCombo_id",
      "dhis2_categoryOptionCombo_name",
      "match_score",
      "match_confidence",
      "alternative_matches",
    ];

    const headerColumns = header.split(",");
    console.log(`📋 Header columns found: ${headerColumns.length}`);
    console.log(`📋 Expected columns: ${expectedColumns.length}`);

    // Check for missing columns
    const missingColumns = expectedColumns.filter(
      (col) => !headerColumns.includes(col)
    );
    if (missingColumns.length > 0) {
      console.log(`⚠️  Missing columns: ${missingColumns.join(", ")}`);
    }

    // Check for extra columns
    const extraColumns = headerColumns.filter(
      (col) => !expectedColumns.includes(col)
    );
    if (extraColumns.length > 0) {
      console.log(`ℹ️  Extra columns: ${extraColumns.join(", ")}`);
    }

    // Validate a few sample rows
    const sampleSize = Math.min(5, lines.length - 1);
    for (let i = 1; i <= sampleSize; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);

      if (columns.length !== headerColumns.length) {
        console.log(
          `⚠️  Row ${i + 1} has ${columns.length} columns, expected ${
            headerColumns.length
          }`
        );
      }
    }

    console.log(
      `✅ CSV validation completed. ${lines.length} total lines (including header)`
    );
    return {
      success: true,
      totalLines: lines.length,
      headerColumns: headerColumns.length,
    };
  } catch (error) {
    console.error(`❌ Error validating CSV:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Create a database-ready version of the CSV
 */
function createDatabaseReadyCSV(inputFile, outputFile) {
  try {
    console.log(`🗄️  Creating database-ready CSV: ${inputFile}`);

    const content = fs.readFileSync(inputFile, "utf8");
    const lines = content.split("\n").filter((line) => line.trim());

    let dbContent = "";

    lines.forEach((line, index) => {
      if (index === 0) {
        // Header - keep as is but ensure proper formatting
        dbContent += line + "\n";
      } else {
        // Data rows - ensure proper escaping for PostgreSQL
        const columns = parseCSVLine(line);
        const cleanedColumns = columns.map((col) => {
          // Remove any remaining problematic characters
          let cleaned = col.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

          // Escape quotes properly for CSV
          if (
            cleaned.includes(",") ||
            cleaned.includes('"') ||
            cleaned.includes("\n")
          ) {
            cleaned = `"${cleaned.replace(/"/g, '""')}"`;
          }

          return cleaned;
        });

        dbContent += cleanedColumns.join(",") + "\n";
      }
    });

    fs.writeFileSync(outputFile, dbContent, "utf8");
    console.log(`✅ Database-ready CSV saved to: ${outputFile}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ Error creating database-ready CSV:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const mappingsDir = path.join(
    __dirname,
    "..",
    "backend",
    "routes",
    "mappings"
  );
  const inputFile = path.join(mappingsDir, "hmis_dhis2_reference.csv");
  const cleanedFile = path.join(
    mappingsDir,
    "hmis_dhis2_reference_cleaned.csv"
  );
  const dbReadyFile = path.join(
    mappingsDir,
    "hmis_dhis2_reference_db_ready.csv"
  );

  console.log("🚀 Starting CSV cleaning process...");

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  // Step 1: Clean the CSV file
  const cleanResult = cleanCSVFile(inputFile, cleanedFile);
  if (!cleanResult.success) {
    console.error("❌ Failed to clean CSV file");
    process.exit(1);
  }

  // Step 2: Validate the cleaned file
  const validateResult = validateCSV(cleanedFile);
  if (!validateResult.success) {
    console.error("❌ CSV validation failed");
    process.exit(1);
  }

  // Step 3: Create database-ready version
  const dbResult = createDatabaseReadyCSV(cleanedFile, dbReadyFile);
  if (!dbResult.success) {
    console.error("❌ Failed to create database-ready CSV");
    process.exit(1);
  }

  console.log("\n✅ CSV cleaning process completed successfully!");
  console.log("\n📁 Files created:");
  console.log(`  • hmis_dhis2_reference_cleaned.csv - Cleaned version`);
  console.log(`  • hmis_dhis2_reference_db_ready.csv - Database-ready version`);
  console.log(
    "\n💡 Use the database-ready version for importing to your database."
  );
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] === "help") {
    console.log("📋 CSV Cleaning Tool");
    console.log("Usage:");
    console.log(
      "  node clean_csv_file.js          - Clean the reference CSV file"
    );
    console.log("  node clean_csv_file.js help     - Show this help");
    return;
  }

  main().catch(console.error);
}

module.exports = {
  cleanCSVFile,
  validateCSV,
  createDatabaseReadyCSV,
};
