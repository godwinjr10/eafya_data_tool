const fs = require("fs");
const path = require("path");

/**
 * Simple CSV parser for the reference mappings
 */
function parseReferenceCSV() {
  const filePath = path.join(
    __dirname,
    "..",
    "backend",
    "routes",
    "mappings",
    "hmis_dhis2_reference.csv"
  );
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
}

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
 * Query functions
 */
class DHIS2MappingQuery {
  constructor() {
    this.mappings = parseReferenceCSV();
    console.log(`📊 Loaded ${this.mappings.length} HMIS-DHIS2 mappings`);
  }

  // Find DHIS2 element by HMIS code
  findByHMISCode(hmisCode) {
    return this.mappings.filter(
      (m) => m.hmis_code.toLowerCase() === hmisCode.toLowerCase()
    );
  }

  // Find DHIS2 element by HMIS name (fuzzy)
  findByHMISName(hmisName) {
    const searchTerm = hmisName.toLowerCase();
    return this.mappings.filter(
      (m) =>
        m.hmis_name.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(m.hmis_name.toLowerCase())
    );
  }

  // Find by DHIS2 code
  findByDHIS2Code(dhis2Code) {
    return this.mappings.filter(
      (m) => m.dhis2_code.toLowerCase() === dhis2Code.toLowerCase()
    );
  }

  // Get all high confidence matches
  getHighConfidenceMatches() {
    return this.mappings.filter((m) => m.match_confidence === "HIGH");
  }

  // Get matches by section
  findBySection(sectionName) {
    const searchTerm = sectionName.toLowerCase();
    return this.mappings.filter((m) =>
      m.hmis_section.toLowerCase().includes(searchTerm)
    );
  }

  // Get unmatched items
  getUnmatched() {
    return this.mappings.filter((m) => !m.dhis2_dataElement_id);
  }

  // Get summary statistics
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
    const unmatched = this.mappings.filter(
      (m) => !m.dhis2_dataElement_id
    ).length;

    return {
      total,
      high_confidence: high,
      medium_confidence: medium,
      low_confidence: low,
      unmatched,
      matched: total - unmatched,
      match_rate: (((total - unmatched) / total) * 100).toFixed(1) + "%",
    };
  }

  // Export specific mappings to CSV
  exportMappings(mappings, filename) {
    const headers = Object.keys(this.mappings[0]);
    let csvContent = headers.join(",") + "\n";

    mappings.forEach((mapping) => {
      const row = headers.map((header) => {
        const value = mapping[header] || "";
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
    console.log(`✅ Exported ${mappings.length} mappings to ${filename}`);
  }
}

// Command line interface
if (require.main === module) {
  const query = new DHIS2MappingQuery();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("📋 DHIS2 Mapping Query Tool");
    console.log("Usage:");
    console.log("  node query_dhis2_mappings.js stats");
    console.log("  node query_dhis2_mappings.js hmis-code EP01");
    console.log('  node query_dhis2_mappings.js hmis-name "malaria"');
    console.log('  node query_dhis2_mappings.js dhis2-code "105-EP01A"');
    console.log('  node query_dhis2_mappings.js section "Epidemic-Prone"');
    console.log("  node query_dhis2_mappings.js high-confidence");
    console.log("  node query_dhis2_mappings.js unmatched");
    console.log(
      "  node query_dhis2_mappings.js export-high high_confidence_mappings.csv"
    );
    return;
  }

  const command = args[0];
  const param = args[1];

  switch (command) {
    case "stats":
      console.log("📊 Mapping Statistics:", query.getStats());
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
        console.log(`    DHIS2 ID: ${r.dhis2_dataElement_id}`);
        console.log(`    Category Combo: ${r.dhis2_categoryOptionCombo_name}`);
      });
      break;

    case "hmis-name":
      if (!param) {
        console.log("❌ Please provide HMIS name to search");
        return;
      }
      const nameResults = query.findByHMISName(param);
      console.log(
        `🔍 Found ${nameResults.length} matches for HMIS name containing "${param}"`
      );
      nameResults.slice(0, 10).forEach((r) => {
        console.log(
          `  ${r.hmis_code}: "${r.hmis_name}" → ${r.dhis2_code} (${r.match_confidence})`
        );
      });
      if (nameResults.length > 10) {
        console.log(`  ... and ${nameResults.length - 10} more matches`);
      }
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
        console.log(`    HMIS: "${r.hmis_name}"`);
        console.log(`    DHIS2: "${r.dhis2_name}"`);
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
          `  ${r.hmis_code}: "${r.hmis_name}" (${r.match_confidence})`
        );
      });
      if (sectionResults.length > 10) {
        console.log(`  ... and ${sectionResults.length - 10} more matches`);
      }
      break;

    case "high-confidence":
      const highConf = query.getHighConfidenceMatches();
      console.log(`🎯 Found ${highConf.length} high confidence matches`);
      highConf.slice(0, 10).forEach((r) => {
        console.log(
          `  ${r.hmis_code} → ${r.dhis2_code} (score: ${r.match_score})`
        );
      });
      if (highConf.length > 10) {
        console.log(
          `  ... and ${highConf.length - 10} more high confidence matches`
        );
      }
      break;

    case "unmatched":
      const unmatched = query.getUnmatched();
      console.log(`❓ Found ${unmatched.length} unmatched items`);
      unmatched.forEach((r) => {
        console.log(
          `  ${r.hmis_code}: "${r.hmis_name}" (Section: ${r.hmis_section})`
        );
      });
      break;

    case "export-high":
      if (!param) {
        console.log("❌ Please provide filename for export");
        return;
      }
      const exportData = query.getHighConfidenceMatches();
      query.exportMappings(exportData, param);
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
      break;
  }
}

module.exports = DHIS2MappingQuery;
