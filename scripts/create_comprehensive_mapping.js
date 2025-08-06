const fs = require("fs");
const path = require("path");

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
 * Parse CSV file and return array of objects
 */
function parseCSV(filePath) {
  try {
    console.log(`📖 Reading CSV file: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.trim().split("\n");

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const headers = parseCSVLine(lines[0]);
    console.log(`   Headers: ${headers.join(", ")}`);

    return lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const obj = {};

      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]
          ? values[index].replace(/^"|"$/g, "").replace(/""/g, '"')
          : "";
      });

      return obj;
    });
  } catch (error) {
    console.error(`Error parsing CSV file ${filePath}:`, error);
    return [];
  }
}

/**
 * Simple fuzzy matching function
 */
function fuzzyMatch(str1, str2) {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Word matching
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  let matchingWords = 0;
  words1.forEach((word1) => {
    if (
      words2.some((word2) => word1.includes(word2) || word2.includes(word1))
    ) {
      matchingWords++;
    }
  });

  return matchingWords / Math.max(words1.length, words2.length);
}

/**
 * Find best DHIS2 match for an HMIS item
 */
function findBestDHIS2Match(hmisItem, dhis2Elements) {
  const hmisName = hmisItem.section_item_name || "";
  const hmisCode = hmisItem.section_item_code || "";
  const hmisSection = hmisItem.section_name || "";

  let bestMatch = null;
  let bestScore = 0;

  dhis2Elements.forEach((dhis2Element) => {
    const dhis2Name = dhis2Element.dhis2_name || "";
    const dhis2Code = dhis2Element.dhis2_code || "";
    const dhis2Short = dhis2Element.dhis2_shortName || "";
    const dhis2Dataset = dhis2Element.dataset_name || "";

    // Calculate match scores
    const nameScore = fuzzyMatch(hmisName, dhis2Name);
    const codeScore = fuzzyMatch(hmisCode, dhis2Code);
    const shortScore = fuzzyMatch(hmisName, dhis2Short);
    const sectionScore = fuzzyMatch(hmisSection, dhis2Dataset);

    // Combined score with weights
    const totalScore =
      nameScore * 0.4 + codeScore * 0.3 + shortScore * 0.2 + sectionScore * 0.1;

    if (totalScore > bestScore) {
      bestMatch = dhis2Element;
      bestScore = totalScore;
    }
  });

  return { match: bestMatch, score: bestScore };
}

/**
 * Generate a dataset ID from dataset name (since we don't have separate dataset IDs)
 */
function generateDatasetId(datasetName) {
  if (!datasetName) return "";

  // Create a simple hash-like ID from the dataset name
  return datasetName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(" ")
    .map((word) => word.slice(0, 3))
    .join("")
    .toUpperCase()
    .slice(0, 11); // Keep it reasonable length
}

/**
 * Clean and escape CSV value
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

/**
 * Create comprehensive HMIS-DHIS2 mapping with all DHIS2 fields
 */
async function createComprehensiveMapping() {
  try {
    console.log(
      "🚀 Creating comprehensive HMIS-DHIS2 mapping with all DHIS2 data..."
    );

    const mappingsDir = path.join(
      __dirname,
      "..",
      "backend",
      "routes",
      "mappings"
    );

    // Load HMIS items
    console.log("📖 Loading HMIS mappings...");
    const hmisItems = parseCSV(path.join(mappingsDir, "dim_all_mappings.csv"));
    console.log(`   Loaded ${hmisItems.length} HMIS items`);

    // Load DHIS2 elements
    console.log("📖 Loading DHIS2 elements...");
    const dhis2Elements = parseCSV(
      path.join(mappingsDir, "dhis2_elements.csv")
    );
    console.log(`   Loaded ${dhis2Elements.length} DHIS2 elements`);

    if (hmisItems.length === 0 || dhis2Elements.length === 0) {
      throw new Error("Failed to load required CSV files");
    }

    // Process mappings
    console.log("🔍 Creating comprehensive mappings...");
    const comprehensiveItems = [];
    let highConfidenceCount = 0;
    let mediumConfidenceCount = 0;
    let lowConfidenceCount = 0;

    hmisItems.forEach((hmisItem, index) => {
      if (index % 100 === 0) {
        console.log(`Processing ${index}/${hmisItems.length} items...`);
      }

      const { match, score } = findBestDHIS2Match(hmisItem, dhis2Elements);

      // Determine confidence level
      let confidence = "LOW";
      if (score > 0.7) {
        confidence = "HIGH";
        highConfidenceCount++;
      } else if (score > 0.4) {
        confidence = "MEDIUM";
        mediumConfidenceCount++;
      } else {
        lowConfidenceCount++;
      }

      // Create comprehensive item with all available fields
      const comprehensiveItem = {
        // HMIS fields
        hmis_id: hmisItem.id || "",
        hmis_code: hmisItem.section_item_code || "",
        hmis_name: hmisItem.section_item_name || "",
        hmis_section: hmisItem.section_name || "",
        hmis_section_id: hmisItem.section_id || "",

        // DHIS2 fields - all available from dhis2_elements.csv
        dhis2_dataElement_id: match ? match.dhis2_dataElement_id || "" : "",
        dhis2_code: match ? match.dhis2_code || "" : "",
        dhis2_name: match ? match.dhis2_name || "" : "",
        dhis2_shortName: match ? match.dhis2_shortName || "" : "",

        // Dataset information
        dataset_name: match ? match.dataset_name || "" : "",
        dataset_id: match ? generateDatasetId(match.dataset_name) || "" : "",

        // Category combination fields
        categoryCombo_id: match ? match.categoryCombo_id || "" : "",
        categoryOptionCombo_id: match ? match.categoryOptionCombo_id || "" : "",
        categoryOptionCombo_name: match
          ? match.categoryOptionCombo_name || ""
          : "",

        // HMIS section match from DHIS2 data
        dhis2_hmis_section_match: match ? match.hmis_section_match || "" : "",

        // Matching metadata
        match_score: score.toFixed(3),
        match_confidence: confidence,
        alternative_matches: "", // Can be populated later if needed
      };

      comprehensiveItems.push(comprehensiveItem);
    });

    // Create the comprehensive CSV
    console.log("💾 Creating comprehensive CSV with all DHIS2 data...");
    const headers = [
      // HMIS fields
      "hmis_id",
      "hmis_code",
      "hmis_name",
      "hmis_section",
      "hmis_section_id",

      // DHIS2 core fields
      "dhis2_dataElement_id",
      "dhis2_code",
      "dhis2_name",
      "dhis2_shortName",

      // Dataset fields
      "dataset_name",
      "dataset_id",

      // Category combination fields
      "categoryCombo_id",
      "categoryOptionCombo_id",
      "categoryOptionCombo_name",

      // Additional DHIS2 fields
      "dhis2_hmis_section_match",

      // Matching metadata
      "match_score",
      "match_confidence",
      "alternative_matches",
    ];

    let csvContent = headers.join(",") + "\n";

    comprehensiveItems.forEach((item) => {
      const row = headers.map((header) => cleanValue(item[header] || ""));
      csvContent += row.join(",") + "\n";
    });

    // Save the comprehensive CSV
    const outputPath = path.join(
      mappingsDir,
      "hmis_dhis2_comprehensive_mapping.csv"
    );
    fs.writeFileSync(outputPath, csvContent, "utf8");

    // Generate statistics
    const stats = {
      total: comprehensiveItems.length,
      high_confidence: highConfidenceCount,
      medium_confidence: mediumConfidenceCount,
      low_confidence: lowConfidenceCount,
      matched: comprehensiveItems.filter((item) => item.dhis2_dataElement_id)
        .length,
    };

    stats.unmatched = stats.total - stats.matched;
    stats.match_rate = ((stats.matched / stats.total) * 100).toFixed(1);

    // Save statistics
    const statsPath = path.join(
      mappingsDir,
      "hmis_dhis2_comprehensive_stats.json"
    );
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

    console.log("\n📊 Comprehensive Mapping Statistics:");
    console.log(`  Total HMIS items: ${stats.total}`);
    console.log(`  Matched items: ${stats.matched} (${stats.match_rate}%)`);
    console.log(`  High confidence: ${stats.high_confidence}`);
    console.log(`  Medium confidence: ${stats.medium_confidence}`);
    console.log(`  Low confidence: ${stats.low_confidence}`);
    console.log(`  Unmatched: ${stats.unmatched}`);

    // Validate the output file
    console.log("\n🔍 Validating comprehensive CSV...");

    // Check for null bytes
    if (csvContent.includes("\x00")) {
      console.log("❌ Output contains null bytes");
    } else {
      console.log("✅ No null bytes found");
    }

    // Check structure
    const testLines = csvContent.split("\n").filter((line) => line.trim());
    console.log(`✅ ${testLines.length} valid lines (including header)`);
    console.log(`✅ ${headers.length} columns in output`);

    // Show sample high-confidence matches
    const highConfMatches = comprehensiveItems
      .filter((item) => item.match_confidence === "HIGH")
      .slice(0, 3);

    if (highConfMatches.length > 0) {
      console.log("\n🎯 Sample high-confidence matches:");
      highConfMatches.forEach((item) => {
        console.log(
          `  ${item.hmis_code} → ${item.dhis2_code} (${item.match_score})`
        );
        console.log(`    HMIS: "${item.hmis_name}"`);
        console.log(`    DHIS2: "${item.dhis2_name}"`);
        console.log(
          `    Dataset: "${item.dataset_name}" (ID: ${item.dataset_id})`
        );
        console.log(`    Category Combo: ${item.categoryOptionCombo_name}`);
        console.log("");
      });
    }

    console.log("\n✅ Successfully created comprehensive HMIS-DHIS2 mapping!");
    console.log("\n📁 Files created:");
    console.log(
      "  • hmis_dhis2_comprehensive_mapping.csv - Complete mapping with ALL DHIS2 data"
    );
    console.log(
      "  • hmis_dhis2_comprehensive_stats.json - Comprehensive mapping statistics"
    );
    console.log(
      "\n💡 Use hmis_dhis2_comprehensive_mapping.csv for database import"
    );
    console.log(
      "💡 This file includes dataset_id and all available DHIS2 fields"
    );

    return { success: true, stats, outputPath };
  } catch (error) {
    console.error("❌ Error creating comprehensive mapping:", error);
    return { success: false, error: error.message };
  }
}

// Run the script
if (require.main === module) {
  createComprehensiveMapping().catch(console.error);
}

module.exports = {
  createComprehensiveMapping,
  findBestDHIS2Match,
  parseCSV,
  cleanValue,
  generateDatasetId,
};
