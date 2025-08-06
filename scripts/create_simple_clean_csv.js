const fs = require("fs");
const path = require("path");

/**
 * Create a simple clean CSV with basic structure
 */
function createSimpleCleanCSV() {
  try {
    console.log("🚀 Creating simple clean HMIS-DHIS2 reference CSV...");

    const mappingsDir = path.join(
      __dirname,
      "..",
      "backend",
      "routes",
      "mappings"
    );

    // Read HMIS mappings
    const hmisContent = fs.readFileSync(
      path.join(mappingsDir, "dim_all_mappings.csv"),
      "utf8"
    );
    const hmisLines = hmisContent.trim().split("\n");

    console.log(`📖 Found ${hmisLines.length - 1} HMIS items`);

    // Create clean CSV structure
    const headers = [
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

    let csvContent = headers.join(",") + "\n";

    // Process HMIS items (skip header)
    for (let i = 1; i < hmisLines.length; i++) {
      const line = hmisLines[i].trim();
      if (!line) continue;

      // Parse CSV line safely
      const columns = parseCSVLine(line);
      if (columns.length < 5) continue;

      const hmisId = columns[0] || "";
      const sectionName = columns[1] || "";
      const sectionId = columns[2] || "";
      const itemName = columns[3] || "";
      const itemCode = columns[4] || "";

      // Create row with clean values
      const row = [
        cleanValue(hmisId),
        cleanValue(itemCode),
        cleanValue(itemName),
        cleanValue(sectionName),
        cleanValue(sectionId),
        "", // dhis2_dataElement_id - empty for now
        "", // dhis2_code - empty for now
        "", // dhis2_name - empty for now
        "", // dhis2_shortName - empty for now
        "", // dhis2_dataset - empty for now
        "", // dhis2_categoryCombo_id - empty for now
        "", // dhis2_categoryOptionCombo_id - empty for now
        "", // dhis2_categoryOptionCombo_name - empty for now
        "0.000", // match_score - default
        "PENDING", // match_confidence - default
        "", // alternative_matches - empty for now
      ];

      csvContent += row.join(",") + "\n";
    }

    // Save the file
    const outputFile = path.join(mappingsDir, "hmis_dhis2_reference_clean.csv");
    fs.writeFileSync(outputFile, csvContent, "utf8");

    const lineCount = csvContent.split("\n").length - 1;

    console.log(
      `✅ Created clean CSV with ${lineCount} lines (including header)`
    );
    console.log(`📁 File: hmis_dhis2_reference_clean.csv`);

    // Validate the file
    console.log("\n🔍 Validating output...");

    // Check for null bytes
    if (csvContent.includes("\x00")) {
      console.log("❌ Output contains null bytes");
    } else {
      console.log("✅ No null bytes found");
    }

    // Check structure
    const testLines = csvContent.split("\n").filter((line) => line.trim());
    console.log(`✅ ${testLines.length} valid lines`);

    // Check first few data rows
    for (let i = 1; i <= Math.min(3, testLines.length - 1); i++) {
      const cols = parseCSVLine(testLines[i]);
      console.log(`✅ Row ${i + 1}: ${cols.length} columns`);
    }

    console.log("\n💡 This CSV is ready for database import!");
    console.log(
      "💡 DHIS2 mappings can be populated later using the query tools."
    );

    return { success: true, lineCount, outputFile };
  } catch (error) {
    console.error("❌ Error creating clean CSV:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Parse CSV line handling quotes
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
 * Clean value by removing problematic characters and escaping for CSV
 */
function cleanValue(value) {
  if (!value) return "";

  // Remove null bytes and control characters
  let cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  cleaned = cleaned.trim();

  // Escape for CSV if needed
  if (
    cleaned.includes(",") ||
    cleaned.includes('"') ||
    cleaned.includes("\n")
  ) {
    cleaned = `"${cleaned.replace(/"/g, '""')}"`;
  }

  return cleaned;
}

// Run the script
if (require.main === module) {
  createSimpleCleanCSV();
}

module.exports = {
  createSimpleCleanCSV,
  cleanValue,
  parseCSVLine,
};
