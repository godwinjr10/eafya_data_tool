const fs = require("fs");
const path = require("path");

/**
 * Parse CSV file and return array of objects
 */
function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.trim().split("\n");
    const headers = lines[0].split(",");

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
 * Create fuzzy matching score between two strings
 */
function fuzzyMatch(str1, str2) {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  // Check for exact substring matches
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Check for word matches
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
 * Find best DHIS2 matches for HMIS items
 */
function findDHIS2Matches(hmisItems, dhis2Elements) {
  console.log("🔍 Finding matches between HMIS and DHIS2 elements...");

  const matches = [];
  let matchedCount = 0;

  hmisItems.forEach((hmisItem, index) => {
    if (index % 100 === 0) {
      console.log(`Processing ${index}/${hmisItems.length} HMIS items...`);
    }

    const hmisName = hmisItem.section_item_name || "";
    const hmisCode = hmisItem.section_item_code || "";
    const hmisSection = hmisItem.section_name || "";

    let bestMatch = null;
    let bestScore = 0;
    let alternativeMatches = [];

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
        if (bestMatch && bestScore > 0.3) {
          alternativeMatches.push({
            ...bestMatch,
            match_score: bestScore,
          });
        }
        bestMatch = dhis2Element;
        bestScore = totalScore;
      } else if (totalScore > 0.3 && alternativeMatches.length < 3) {
        alternativeMatches.push({
          ...dhis2Element,
          match_score: totalScore,
        });
      }
    });

    const matchResult = {
      hmis_id: hmisItem.id || "",
      hmis_code: hmisCode,
      hmis_name: hmisName,
      hmis_section: hmisSection,
      hmis_section_id: hmisItem.section_id || "",

      // Best match
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

      // Alternative matches (top 2)
      alternative_matches: alternativeMatches
        .slice(0, 2)
        .map(
          (alt) =>
            `${alt.dhis2_code}:${alt.dhis2_name}:${
              alt.match_score?.toFixed(3) || "0.000"
            }`
        )
        .join("|"),
    };

    matches.push(matchResult);

    if (bestScore > 0.4) {
      matchedCount++;
    }
  });

  console.log(
    `✅ Completed matching. Found ${matchedCount} good matches out of ${hmisItems.length} HMIS items`
  );
  return matches;
}

/**
 * Create CSV content from matches
 */
function createReferenceCSV(matches) {
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
      const value = match[header] || "";
      // Escape quotes and wrap in quotes if contains comma or quote
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}

/**
 * Create summary statistics
 */
function createSummaryStats(matches) {
  const stats = {
    total: matches.length,
    high_confidence: matches.filter((m) => m.match_confidence === "HIGH")
      .length,
    medium_confidence: matches.filter((m) => m.match_confidence === "MEDIUM")
      .length,
    low_confidence: matches.filter((m) => m.match_confidence === "LOW").length,
    unmatched: matches.filter((m) => !m.dhis2_dataElement_id).length,
  };

  stats.matched = stats.total - stats.unmatched;
  stats.match_rate = ((stats.matched / stats.total) * 100).toFixed(1);

  return stats;
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log("🚀 Creating HMIS-DHIS2 reference mapping...");

    const mappingsDir = path.join(
      __dirname,
      "..",
      "backend",
      "routes",
      "mappings"
    );

    // Load HMIS mappings
    console.log("📖 Loading HMIS mappings...");
    const hmisItems = parseCSV(path.join(mappingsDir, "dim_all_mappings.csv"));
    console.log(`Loaded ${hmisItems.length} HMIS items`);

    // Load DHIS2 elements
    console.log("📖 Loading DHIS2 elements...");
    const dhis2Elements = parseCSV(
      path.join(mappingsDir, "dhis2_summary_mappings.csv")
    );
    console.log(`Loaded ${dhis2Elements.length} DHIS2 elements`);

    if (hmisItems.length === 0 || dhis2Elements.length === 0) {
      throw new Error("Failed to load required CSV files");
    }

    // Find matches
    const matches = findDHIS2Matches(hmisItems, dhis2Elements);

    // Create reference CSV
    console.log("💾 Creating reference CSV...");
    const referenceCSV = createReferenceCSV(matches);
    const referenceFile = path.join(mappingsDir, "hmis_dhis2_reference.csv");
    fs.writeFileSync(referenceFile, referenceCSV, "utf8");

    // Create summary statistics
    const stats = createSummaryStats(matches);

    console.log("\n📊 Matching Statistics:");
    console.log(`  Total HMIS items: ${stats.total}`);
    console.log(`  Matched items: ${stats.matched} (${stats.match_rate}%)`);
    console.log(`  High confidence: ${stats.high_confidence}`);
    console.log(`  Medium confidence: ${stats.medium_confidence}`);
    console.log(`  Low confidence: ${stats.low_confidence}`);
    console.log(`  Unmatched: ${stats.unmatched}`);

    // Save statistics
    const statsFile = path.join(mappingsDir, "hmis_dhis2_mapping_stats.json");
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), "utf8");

    console.log(`\n✅ Successfully created reference mapping!`);
    console.log(`📁 Files created:`);
    console.log(
      `  • hmis_dhis2_reference.csv - Complete mapping with match scores`
    );
    console.log(`  • hmis_dhis2_mapping_stats.json - Summary statistics`);

    // Show some sample high-confidence matches
    const highConfidenceMatches = matches
      .filter((m) => m.match_confidence === "HIGH")
      .slice(0, 5);
    if (highConfidenceMatches.length > 0) {
      console.log(`\n🎯 Sample high-confidence matches:`);
      highConfidenceMatches.forEach((match) => {
        console.log(
          `  ${match.hmis_code} → ${match.dhis2_code} (${match.match_score})`
        );
        console.log(`    "${match.hmis_name}" → "${match.dhis2_name}"`);
      });
    }
  } catch (error) {
    console.error("❌ Error creating reference mapping:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  findDHIS2Matches,
  createReferenceCSV,
  parseCSV,
};
