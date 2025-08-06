const fs = require("fs");
const path = require("path");

/**
 * Parse CSV file properly handling quoted fields
 */
function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.trim().split("\n");

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const headers = parseCSVLine(lines[0]);

    return lines
      .slice(1)
      .map((line, index) => {
        const values = parseCSVLine(line);
        const obj = {};

        headers.forEach((header, colIndex) => {
          obj[header.trim()] = values[colIndex] ? values[colIndex].trim() : "";
        });

        return obj;
      })
      .filter((row) => {
        // Filter out rows that don't have the minimum required fields
        return row.hmis_code && row.hmis_name;
      });
  } catch (error) {
    console.error(`Error parsing CSV file ${filePath}:`, error);
    return [];
  }
}

/**
 * Parse a single CSV line handling quoted values
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
 * Simple fuzzy matching
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
 * Find DHIS2 matches for HMIS items
 */
function findMatches(hmisItems, dhis2Elements) {
  console.log(
    `🔍 Matching ${hmisItems.length} HMIS items with ${dhis2Elements.length} DHIS2 elements...`
  );

  const matches = [];

  hmisItems.forEach((hmisItem, index) => {
    if (index % 50 === 0) {
      console.log(`Processing ${index}/${hmisItems.length} HMIS items...`);
    }

    const hmisName = hmisItem.section_item_name || "";
    const hmisCode = hmisItem.section_item_code || "";
    const hmisSection = hmisItem.section_name || "";

    let bestMatch = null;
    let bestScore = 0;

    // Find best matching DHIS2 element
    dhis2Elements.forEach((dhis2Element) => {
      const dhis2Name = dhis2Element.dhis2_name || "";
      const dhis2Code = dhis2Element.dhis2_code || "";
      const dhis2Short = dhis2Element.dhis2_shortName || "";

      // Calculate match scores
      const nameScore = fuzzyMatch(hmisName, dhis2Name);
      const codeScore = fuzzyMatch(hmisCode, dhis2Code);
      const shortScore = fuzzyMatch(hmisName, dhis2Short);
      const sectionScore = fuzzyMatch(
        hmisSection,
        dhis2Element.dataset_name || ""
      );

      // Combined score with weights
      const totalScore =
        nameScore * 0.4 +
        codeScore * 0.3 +
        shortScore * 0.2 +
        sectionScore * 0.1;

      if (totalScore > bestScore) {
        bestMatch = dhis2Element;
        bestScore = totalScore;
      }
    });

    // Create match result
    const matchResult = {
      hmis_id: hmisItem.id || "",
      hmis_code: hmisCode,
      hmis_name: hmisName,
      hmis_section: hmisSection,
      hmis_section_id: hmisItem.section_id || "",
      dhis2_dataElement_id: bestMatch?.dhis2_dataElement_id || "",
      dhis2_code: bestMatch?.dhis2_code || "",
      dhis2_name: bestMatch?.dhis2_name || "",
      dhis2_shortName: bestMatch?.dhis2_shortName || "",
      dhis2_dataset: bestMatch?.dataset_name || "",
      dhis2_categoryCombo_id: bestMatch?.categoryCombo_id || "",
      dhis2_categoryOptionCombo_id: bestMatch?.categoryOptionCombo_id || "",
      dhis2_categoryOptionCombo_name: bestMatch?.categoryOptionCombo_name || "",
      match_score: bestScore.toFixed(3),
      match_confidence:
        bestScore > 0.7 ? "HIGH" : bestScore > 0.4 ? "MEDIUM" : "LOW",
      alternative_matches: "",
    };

    matches.push(matchResult);
  });

  console.log(`✅ Completed matching. Generated ${matches.length} mappings`);
  return matches;
}

/**
 * Create clean CSV content
 */
function createCleanCSV(matches) {
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

  matches.forEach((match) => {
    const row = headers.map((header) => {
      const value = (match[header] || "").toString();

      // Clean the value
      const cleaned = value
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .trim();

      // Escape if necessary
      if (
        cleaned.includes(",") ||
        cleaned.includes('"') ||
        cleaned.includes("\n")
      ) {
        return `"${cleaned.replace(/"/g, '""')}"`;
      }

      return cleaned;
    });

    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("🚀 Regenerating clean HMIS-DHIS2 reference mapping...");

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
    console.log(`Loaded ${hmisItems.length} valid HMIS items`);

    // Load DHIS2 elements
    console.log("📖 Loading DHIS2 elements...");
    const dhis2Elements = parseCSV(
      path.join(mappingsDir, "dhis2_summary_mappings.csv")
    );
    console.log(`Loaded ${dhis2Elements.length} DHIS2 elements`);

    if (hmisItems.length === 0 || dhis2Elements.length === 0) {
      throw new Error("Failed to load required CSV files");
    }

    // Generate matches
    const matches = findMatches(hmisItems, dhis2Elements);

    // Create clean CSV
    console.log("💾 Creating clean CSV...");
    const cleanCSV = createCleanCSV(matches);

    // Save the file
    const outputFile = path.join(mappingsDir, "hmis_dhis2_reference_clean.csv");
    fs.writeFileSync(outputFile, cleanCSV, "utf8");

    // Generate statistics
    const stats = {
      total: matches.length,
      high_confidence: matches.filter((m) => m.match_confidence === "HIGH")
        .length,
      medium_confidence: matches.filter((m) => m.match_confidence === "MEDIUM")
        .length,
      low_confidence: matches.filter((m) => m.match_confidence === "LOW")
        .length,
      unmatched: matches.filter((m) => !m.dhis2_dataElement_id).length,
    };

    stats.matched = stats.total - stats.unmatched;
    stats.match_rate = ((stats.matched / stats.total) * 100).toFixed(1);

    console.log("\n📊 Mapping Statistics:");
    console.log(`  Total HMIS items: ${stats.total}`);
    console.log(`  Matched items: ${stats.matched} (${stats.match_rate}%)`);
    console.log(`  High confidence: ${stats.high_confidence}`);
    console.log(`  Medium confidence: ${stats.medium_confidence}`);
    console.log(`  Low confidence: ${stats.low_confidence}`);
    console.log(`  Unmatched: ${stats.unmatched}`);

    // Save statistics
    const statsFile = path.join(
      mappingsDir,
      "hmis_dhis2_mapping_stats_clean.json"
    );
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), "utf8");

    console.log("\n✅ Successfully regenerated clean reference mapping!");
    console.log("\n📁 Files created:");
    console.log(
      "  • hmis_dhis2_reference_clean.csv - Clean, properly structured mapping"
    );
    console.log("  • hmis_dhis2_mapping_stats_clean.json - Updated statistics");

    // Validate the output file
    console.log("\n🔍 Validating output file...");
    const testContent = fs.readFileSync(outputFile, "utf8");

    // Check for null bytes
    if (testContent.includes("\x00")) {
      console.log("❌ Output file still contains null bytes");
    } else {
      console.log("✅ No null bytes found in output file");
    }

    // Check line count
    const lines = testContent.split("\n").filter((line) => line.trim());
    console.log(`✅ Output file has ${lines.length} lines (including header)`);

    // Show sample high-confidence matches
    const highConfMatches = matches
      .filter((m) => m.match_confidence === "HIGH")
      .slice(0, 5);
    if (highConfMatches.length > 0) {
      console.log("\n🎯 Sample high-confidence matches:");
      highConfMatches.forEach((match) => {
        console.log(
          `  ${match.hmis_code} → ${match.dhis2_code} (${match.match_score})`
        );
        console.log(`    "${match.hmis_name}" → "${match.dhis2_name}"`);
      });
    }

    console.log("\n💡 Use hmis_dhis2_reference_clean.csv for database import");
  } catch (error) {
    console.error("❌ Error regenerating reference mapping:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  parseCSV,
  findMatches,
  createCleanCSV,
};
