const fs = require("fs");
const path = require("path");

/**
 * Parse and restructure the CSV to ensure proper formatting
 */
function fixCSVStructure(inputFile, outputFile) {
  try {
    console.log(`🔧 Fixing CSV structure: ${inputFile}`);

    const content = fs.readFileSync(inputFile, "utf8");
    const lines = content.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Expected header structure
    const expectedHeaders = [
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

    let fixedContent = expectedHeaders.join(",") + "\n";
    let validRows = 0;
    let skippedRows = 0;

    // Process each line starting from line 2 (skip original header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);

      // Skip malformed rows
      if (columns.length < expectedHeaders.length) {
        console.log(
          `⚠️  Skipping malformed row ${i + 1}: ${
            columns.length
          } columns (expected ${expectedHeaders.length})`
        );
        skippedRows++;
        continue;
      }

      // Take only the expected number of columns
      const validColumns = columns.slice(0, expectedHeaders.length);

      // Clean and escape each column
      const cleanedColumns = validColumns.map((col, index) => {
        // Remove null bytes and control characters
        let cleaned = col.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

        // Trim whitespace
        cleaned = cleaned.trim();

        // Handle empty values
        if (!cleaned && index > 0) {
          cleaned = "";
        }

        // Properly escape for CSV
        if (
          cleaned.includes(",") ||
          cleaned.includes('"') ||
          cleaned.includes("\n") ||
          cleaned.includes("\r")
        ) {
          cleaned = `"${cleaned.replace(/"/g, '""')}"`;
        }

        return cleaned;
      });

      fixedContent += cleanedColumns.join(",") + "\n";
      validRows++;
    }

    // Write the fixed content
    fs.writeFileSync(outputFile, fixedContent, "utf8");

    console.log(`✅ Fixed CSV saved to: ${outputFile}`);
    console.log(`📊 Processing Results:`);
    console.log(`  Valid rows processed: ${validRows}`);
    console.log(`  Skipped malformed rows: ${skippedRows}`);
    console.log(`  Total output lines: ${validRows + 1} (including header)`);

    return { success: true, validRows, skippedRows };
  } catch (error) {
    console.error(`❌ Error fixing CSV structure:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Parse CSV line handling quoted values properly
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
 * Validate the final CSV
 */
function validateFinalCSV(filePath) {
  try {
    console.log(`🔍 Validating final CSV: ${filePath}`);

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Check header
    const headerLine = lines[0];
    const headerColumns = headerLine.split(",");

    console.log(`📋 Header has ${headerColumns.length} columns`);

    // Check first 5 data rows
    const sampleSize = Math.min(5, lines.length - 1);
    let allRowsValid = true;

    for (let i = 1; i <= sampleSize; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);

      if (columns.length !== headerColumns.length) {
        console.log(
          `❌ Row ${i + 1} has ${columns.length} columns, expected ${
            headerColumns.length
          }`
        );
        allRowsValid = false;
      } else {
        console.log(`✅ Row ${i + 1} has correct ${columns.length} columns`);
      }
    }

    // Check for null bytes
    if (content.includes("\x00")) {
      console.log(`❌ File still contains null bytes`);
      allRowsValid = false;
    } else {
      console.log(`✅ No null bytes found`);
    }

    console.log(`📊 Final validation: ${allRowsValid ? "PASSED" : "FAILED"}`);
    console.log(`📊 Total lines: ${lines.length} (including header)`);

    return { success: allRowsValid, totalLines: lines.length };
  } catch (error) {
    console.error(`❌ Error validating final CSV:`, error);
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
  const inputFile = path.join(mappingsDir, "hmis_dhis2_reference_cleaned.csv");
  const outputFile = path.join(mappingsDir, "hmis_dhis2_reference_final.csv");

  console.log("🚀 Starting CSV structure fix...");

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    console.log("ℹ️  Make sure to run clean_csv_file.js first");
    process.exit(1);
  }

  // Step 1: Fix CSV structure
  const fixResult = fixCSVStructure(inputFile, outputFile);
  if (!fixResult.success) {
    console.error("❌ Failed to fix CSV structure");
    process.exit(1);
  }

  // Step 2: Validate the final file
  const validateResult = validateFinalCSV(outputFile);
  if (!validateResult.success) {
    console.error("❌ Final CSV validation failed");
    process.exit(1);
  }

  console.log("\n✅ CSV structure fix completed successfully!");
  console.log("\n📁 File created:");
  console.log(
    `  • hmis_dhis2_reference_final.csv - Clean, properly structured file`
  );
  console.log("\n💡 Use this final version for database import.");
  console.log("\n🗄️  PostgreSQL COPY command example:");
  console.log(
    `COPY your_table_name FROM 'path/to/hmis_dhis2_reference_final.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');`
  );
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  fixCSVStructure,
  validateFinalCSV,
  parseCSVLine,
};
