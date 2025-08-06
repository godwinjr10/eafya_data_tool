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
 * Simple CSV parser for the enhanced mappings
 */
function parseEnhancedMappings() {
  const filePath = path.join(
    __dirname,
    "..",
    "backend",
    "routes",
    "mappings",
    "hmis_dhis2_reference_enhanced.csv"
  );

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.trim().split("\n");
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
}

/**
 * Query functions
 */
class EnhancedMappingQuery {
  constructor() {
    this.mappings = parseEnhancedMappings();
    console.log(
      `📊 Loaded ${this.mappings.length} enhanced HMIS-DHIS2 mappings`
    );
  }

  // Find by HMIS code
  findByHMISCode(hmisCode) {
    return this.mappings.filter(
      (m) => m.hmis_code.toLowerCase() === hmisCode.toLowerCase()
    );
  }

  // Find by DHIS2 code
  findByDHIS2Code(dhis2Code) {
    return this.mappings.filter(
      (m) => m.dhis2_code.toLowerCase() === dhis2Code.toLowerCase()
    );
  }

  // Find by section
  findBySection(sectionName) {
    const searchTerm = sectionName.toLowerCase();
    return this.mappings.filter((m) =>
      m.hmis_section.toLowerCase().includes(searchTerm)
    );
  }

  // Get by confidence level
  getByConfidence(confidence) {
    return this.mappings.filter(
      (m) => m.match_confidence.toLowerCase() === confidence.toLowerCase()
    );
  }

  // Search by name
  searchByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.mappings.filter(
      (m) =>
        m.hmis_name.toLowerCase().includes(term) ||
        m.dhis2_name.toLowerCase().includes(term)
    );
  }

  // Get statistics
  getStats() {
    const total = this.mappings.length;
    const high = this.mappings.filter(
      (m) => m.match_confidence === "HIGH"
    ).length;
    const medium = this.mappings.filter(
      (m) => m.match_confidence === "MEDIUM"
    ).length;
    const low = this.mappings.filter(
      (m) => m.match_confidence === "LOW"
    ).length;
    const matched = this.mappings.filter((m) => m.dhis2_dataElement_id).length;

    return {
      total,
      high_confidence: high,
      medium_confidence: medium,
      low_confidence: low,
      matched,
      unmatched: total - matched,
      match_rate: ((matched / total) * 100).toFixed(1) + "%",
    };
  }

  // Export filtered results
  exportResults(results, filename) {
    if (!results || results.length === 0) {
      console.log("❌ No results to export");
      return;
    }

    const headers = Object.keys(this.mappings[0]);
    let csvContent = headers.join(",") + "\n";

    results.forEach((result) => {
      const row = headers.map((header) => {
        const value = result[header] || "";
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n")
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += row.join(",") + "\n";
    });

    const outputPath = path.join(
      __dirname,
      "..",
      "backend",
      "routes",
      "mappings",
      filename
    );
    fs.writeFileSync(outputPath, csvContent, "utf8");
    console.log(`✅ Exported ${results.length} results to ${filename}`);
  }
}

// Command line interface
if (require.main === module) {
  const query = new EnhancedMappingQuery();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("📋 Enhanced DHIS2 Mapping Query Tool");
    console.log("Usage:");
    console.log("  node query_enhanced_mappings.js stats");
    console.log("  node query_enhanced_mappings.js hmis-code EP01");
    console.log("  node query_enhanced_mappings.js dhis2-code 105-EP01A");
    console.log('  node query_enhanced_mappings.js section "Epidemic-Prone"');
    console.log("  node query_enhanced_mappings.js confidence HIGH");
    console.log('  node query_enhanced_mappings.js search "malaria"');
    console.log(
      "  node query_enhanced_mappings.js export-high high_confidence.csv"
    );
    return;
  }

  const command = args[0];
  const param = args[1];

  switch (command) {
    case "stats":
      console.log("📊 Enhanced Mapping Statistics:", query.getStats());
      break;

    case "hmis-code":
      if (!param) {
        console.log("❌ Please provide HMIS code");
        return;
      }
      const hmisResults = query.findByHMISCode(param);
      console.log(
        `🔍 Found ${hmisResults.length} matches for HMIS code "${param}"`
      );
      hmisResults.forEach((r) => {
        console.log(
          `  ${r.hmis_code} → ${r.dhis2_code} (${r.match_confidence})`
        );
        console.log(`    HMIS: "${r.hmis_name}"`);
        console.log(`    DHIS2: "${r.dhis2_name}"`);
        console.log(`    DHIS2 ID: ${r.dhis2_dataElement_id}`);
        console.log(`    Dataset: ${r.dhis2_dataset}`);
        console.log("");
      });
      break;

    case "dhis2-code":
      if (!param) {
        console.log("❌ Please provide DHIS2 code");
        return;
      }
      const dhis2Results = query.findByDHIS2Code(param);
      console.log(
        `🔍 Found ${dhis2Results.length} matches for DHIS2 code "${param}"`
      );
      dhis2Results.forEach((r) => {
        console.log(
          `  ${r.dhis2_code} ← ${r.hmis_code} (${r.match_confidence})`
        );
        console.log(`    DHIS2: "${r.dhis2_name}"`);
        console.log(`    HMIS: "${r.hmis_name}"`);
        console.log("");
      });
      break;

    case "section":
      if (!param) {
        console.log("❌ Please provide section name");
        return;
      }
      const sectionResults = query.findBySection(param);
      console.log(
        `🔍 Found ${sectionResults.length} matches in sections containing "${param}"`
      );
      sectionResults.slice(0, 10).forEach((r) => {
        console.log(
          `  ${r.hmis_code}: "${r.hmis_name}" → ${r.dhis2_code} (${r.match_confidence})`
        );
      });
      if (sectionResults.length > 10) {
        console.log(`  ... and ${sectionResults.length - 10} more matches`);
      }
      break;

    case "confidence":
      if (!param) {
        console.log("❌ Please provide confidence level (HIGH, MEDIUM, LOW)");
        return;
      }
      const confResults = query.getByConfidence(param);
      console.log(
        `🎯 Found ${
          confResults.length
        } matches with ${param.toUpperCase()} confidence`
      );
      confResults.slice(0, 10).forEach((r) => {
        console.log(
          `  ${r.hmis_code} → ${r.dhis2_code} (score: ${r.match_score})`
        );
        console.log(`    "${r.hmis_name}" → "${r.dhis2_name}"`);
      });
      if (confResults.length > 10) {
        console.log(`  ... and ${confResults.length - 10} more matches`);
      }
      break;

    case "search":
      if (!param) {
        console.log("❌ Please provide search term");
        return;
      }
      const searchResults = query.searchByName(param);
      console.log(
        `🔍 Found ${searchResults.length} matches containing "${param}"`
      );
      searchResults.slice(0, 10).forEach((r) => {
        console.log(
          `  ${r.hmis_code} → ${r.dhis2_code} (${r.match_confidence})`
        );
        console.log(`    "${r.hmis_name}" → "${r.dhis2_name}"`);
      });
      if (searchResults.length > 10) {
        console.log(`  ... and ${searchResults.length - 10} more matches`);
      }
      break;

    case "export-high":
      if (!param) {
        console.log("❌ Please provide filename for export");
        return;
      }
      const highConfResults = query.getByConfidence("HIGH");
      query.exportResults(highConfResults, param);
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
      break;
  }
}

module.exports = EnhancedMappingQuery;
