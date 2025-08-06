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
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.trim().split("\n");

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const headers = parseCSVLine(lines[0]);

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
  const hmisName = hmisItem.hmis_name || "";
  const hmisCode = hmisItem.hmis_code || "";
  const hmisSection = hmisItem.hmis_section || "";

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
 * Populate DHIS2 mappings in the clean CSV
 */
async function populateDHIS2Mappings() {
  try {
    console.log("🚀 Populating DHIS2 mappings in clean CSV...");

    const mappingsDir = path.join(
      __dirname,
      "..",
      "backend",
      "routes",
      "mappings"
    );

    // Load the clean CSV we just created
    console.log("📖 Loading clean HMIS-DHIS2 reference CSV...");
    const cleanCSVPath = path.join(
      mappingsDir,
      "hmis_dhis2_reference_clean.csv"
    );
    const hmisItems = parseCSV(cleanCSVPath);
    console.log(`Loaded ${hmisItems.length} HMIS items`);

    // Load DHIS2 elements
    console.log("📖 Loading DHIS2 elements...");
    const dhis2ElementsPath = path.join(mappingsDir, "dhis2_elements.csv");
    const dhis2Elements = parseCSV(dhis2ElementsPath);
    console.log(`Loaded ${dhis2Elements.length} DHIS2 elements`);

    if (hmisItems.length === 0 || dhis2Elements.length === 0) {
      throw new Error("Failed to load required CSV files");
    }

    // Process mappings
    console.log("🔍 Finding DHIS2 matches for HMIS items...");
    const enhancedItems = [];
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

      // Create enhanced item
      const enhancedItem = {
        hmis_id: hmisItem.hmis_id || "",
        hmis_code: hmisItem.hmis_code || "",
        hmis_name: hmisItem.hmis_name || "",
        hmis_section: hmisItem.hmis_section || "",
        hmis_section_id: hmisItem.hmis_section_id || "",
        dhis2_dataElement_id: match ? match.dhis2_dataElement_id || "" : "",
        dhis2_code: match ? match.dhis2_code || "" : "",
        dhis2_name: match ? match.dhis2_name || "" : "",
        dhis2_shortName: match ? match.dhis2_shortName || "" : "",
        dhis2_dataset: match ? match.dataset_name || "" : "",
        dhis2_categoryCombo_id: match ? match.categoryCombo_id || "" : "",
        dhis2_categoryOptionCombo_id: match
          ? match.categoryOptionCombo_id || ""
          : "",
        dhis2_categoryOptionCombo_name: match
          ? match.categoryOptionCombo_name || ""
          : "",
        match_score: score.toFixed(3),
        match_confidence: confidence,
        alternative_matches: "", // Can be populated later if needed
      };

      enhancedItems.push(enhancedItem);
    });

    // Create the enhanced CSV
    console.log("💾 Creating enhanced CSV with DHIS2 mappings...");
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

    enhancedItems.forEach((item) => {
      const row = headers.map((header) => cleanValue(item[header] || ""));
      csvContent += row.join(",") + "\n";
    });

    // Save the enhanced CSV
    const outputPath = path.join(
      mappingsDir,
      "hmis_dhis2_reference_enhanced.csv"
    );
    fs.writeFileSync(outputPath, csvContent, "utf8");

    // Generate statistics
    const stats = {
      total: enhancedItems.length,
      high_confidence: highConfidenceCount,
      medium_confidence: mediumConfidenceCount,
      low_confidence: lowConfidenceCount,
      matched: enhancedItems.filter((item) => item.dhis2_dataElement_id).length,
    };

    stats.unmatched = stats.total - stats.matched;
    stats.match_rate = ((stats.matched / stats.total) * 100).toFixed(1);

    // Save statistics
    const statsPath = path.join(mappingsDir, "hmis_dhis2_mapping_stats.json");
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

    console.log("\n📊 Mapping Statistics:");
    console.log(`  Total HMIS items: ${stats.total}`);
    console.log(`  Matched items: ${stats.matched} (${stats.match_rate}%)`);
    console.log(`  High confidence: ${stats.high_confidence}`);
    console.log(`  Medium confidence: ${stats.medium_confidence}`);
    console.log(`  Low confidence: ${stats.low_confidence}`);
    console.log(`  Unmatched: ${stats.unmatched}`);

    // Validate the output file
    console.log("\n🔍 Validating enhanced CSV...");

    // Check for null bytes
    if (csvContent.includes("\x00")) {
      console.log("❌ Output contains null bytes");
    } else {
      console.log("✅ No null bytes found");
    }

    // Check structure
    const testLines = csvContent.split("\n").filter((line) => line.trim());
    console.log(`✅ ${testLines.length} valid lines (including header)`);

    // Show sample high-confidence matches
    const highConfMatches = enhancedItems
      .filter((item) => item.match_confidence === "HIGH")
      .slice(0, 5);

    if (highConfMatches.length > 0) {
      console.log("\n🎯 Sample high-confidence matches:");
      highConfMatches.forEach((item) => {
        console.log(
          `  ${item.hmis_code} → ${item.dhis2_code} (${item.match_score})`
        );
        console.log(`    "${item.hmis_name}" → "${item.dhis2_name}"`);
      });
    }

    console.log("\n✅ Successfully created enhanced HMIS-DHIS2 mapping!");
    console.log("\n📁 Files created:");
    console.log(
      "  • hmis_dhis2_reference_enhanced.csv - Complete mapping with DHIS2 data"
    );
    console.log("  • hmis_dhis2_mapping_stats.json - Mapping statistics");
    console.log(
      "\n💡 Use hmis_dhis2_reference_enhanced.csv for database import"
    );

    return { success: true, stats };
  } catch (error) {
    console.error("❌ Error populating DHIS2 mappings:", error);
    return { success: false, error: error.message };
  }
}

// Run the script
if (require.main === module) {
  populateDHIS2Mappings().catch(console.error);
}

module.exports = {
  populateDHIS2Mappings,
  findBestDHIS2Match,
  parseCSV,
  cleanValue,
};
