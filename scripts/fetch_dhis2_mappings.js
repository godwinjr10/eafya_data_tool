const axios = require("axios");
const fs = require("fs");
const path = require("path");

// DHIS2 API Configuration
const DHIS2_CONFIG = {
  baseURL: "https://customization.health.go.ug/hmis/api",
  username: "eafya_integration",
  password: "Inte4fy@d",
  timeout: 30000,
};

// Create axios instance with authentication
const dhis2Api = axios.create({
  baseURL: DHIS2_CONFIG.baseURL,
  auth: {
    username: DHIS2_CONFIG.username,
    password: DHIS2_CONFIG.password,
  },
  timeout: DHIS2_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Fetch all data elements with their category combinations
 */
async function fetchDataElements() {
  try {
    console.log("Fetching data elements from DHIS2...");

    const response = await dhis2Api.get("/dataElements", {
      params: {
        fields:
          "id,code,name,shortName,categoryCombo[id,code,name,categoryOptionCombos[id,code,name]]",
        paging: false,
      },
    });

    return response.data.dataElements || [];
  } catch (error) {
    console.error(
      "Error fetching data elements:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Fetch category option combinations
 */
async function fetchCategoryOptionCombos() {
  try {
    console.log("Fetching category option combinations...");

    const response = await dhis2Api.get("/categoryOptionCombos", {
      params: {
        fields: "id,code,name,categoryOptions[id,code,name]",
        paging: false,
      },
    });

    return response.data.categoryOptionCombos || [];
  } catch (error) {
    console.error(
      "Error fetching category option combinations:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Fetch data sets to understand which data elements belong to HMIS forms
 */
async function fetchDataSets() {
  try {
    console.log("Fetching data sets...");

    const response = await dhis2Api.get("/dataSets", {
      params: {
        fields:
          "id,code,name,shortName,dataSetElements[dataElement[id,code,name]]",
        paging: false,
      },
    });

    return response.data.dataSets || [];
  } catch (error) {
    console.error(
      "Error fetching data sets:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Create CSV content from data elements
 */
function createDataElementsCSV(dataElements, categoryOptionCombos) {
  const csvHeader =
    "dataElement_id,dataElement_code,dataElement_name,dataElement_shortName,categoryCombo_id,categoryCombo_code,categoryCombo_name,categoryOptionCombo_id,categoryOptionCombo_code,categoryOptionCombo_name\n";

  let csvContent = csvHeader;

  dataElements.forEach((dataElement) => {
    const categoryCombo = dataElement.categoryCombo || {};
    const categoryOptionCombos = categoryCombo.categoryOptionCombos || [{}];

    categoryOptionCombos.forEach((categoryOptionCombo) => {
      csvContent +=
        [
          dataElement.id || "",
          dataElement.code || "",
          `"${(dataElement.name || "").replace(/"/g, '""')}"`,
          `"${(dataElement.shortName || "").replace(/"/g, '""')}"`,
          categoryCombo.id || "",
          categoryCombo.code || "",
          `"${(categoryCombo.name || "").replace(/"/g, '""')}"`,
          categoryOptionCombo.id || "",
          categoryOptionCombo.code || "",
          `"${(categoryOptionCombo.name || "").replace(/"/g, '""')}"`,
        ].join(",") + "\n";
    });
  });

  return csvContent;
}

/**
 * Create CSV content for data sets mapping
 */
function createDataSetsCSV(dataSets) {
  const csvHeader =
    "dataSet_id,dataSet_code,dataSet_name,dataSet_shortName,dataElement_id,dataElement_code,dataElement_name\n";

  let csvContent = csvHeader;

  dataSets.forEach((dataSet) => {
    const dataSetElements = dataSet.dataSetElements || [];

    if (dataSetElements.length === 0) {
      // Include dataset even if it has no elements
      csvContent +=
        [
          dataSet.id || "",
          dataSet.code || "",
          `"${(dataSet.name || "").replace(/"/g, '""')}"`,
          `"${(dataSet.shortName || "").replace(/"/g, '""')}"`,
          "",
          "",
          "",
        ].join(",") + "\n";
    } else {
      dataSetElements.forEach((dsElement) => {
        const dataElement = dsElement.dataElement || {};
        csvContent +=
          [
            dataSet.id || "",
            dataSet.code || "",
            `"${(dataSet.name || "").replace(/"/g, '""')}"`,
            `"${(dataSet.shortName || "").replace(/"/g, '""')}"`,
            dataElement.id || "",
            dataElement.code || "",
            `"${(dataElement.name || "").replace(/"/g, '""')}"`,
          ].join(",") + "\n";
      });
    }
  });

  return csvContent;
}

/**
 * Save CSV content to file
 */
function saveCSVFile(filename, content) {
  const outputDir = path.join(__dirname, "..", "backend", "routes", "mappings");

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(
    `✅ Saved ${filename} with ${content.split("\n").length - 1} rows`
  );
  return filePath;
}

/**
 * Test API connection
 */
async function testConnection() {
  try {
    console.log("Testing DHIS2 API connection...");
    const response = await dhis2Api.get("/system/info");
    console.log("✅ Successfully connected to DHIS2");
    console.log(`Server version: ${response.data.version}`);
    console.log(`Server revision: ${response.data.revision}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Failed to connect to DHIS2:",
      error.response?.data || error.message
    );
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log("🚀 Starting DHIS2 data elements and mappings fetch...");
    console.log(`📡 Connecting to: ${DHIS2_CONFIG.baseURL}`);

    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      process.exit(1);
    }

    // Fetch all required data
    console.log("\n📊 Fetching data from DHIS2...");
    const [dataElements, categoryOptionCombos, dataSets] = await Promise.all([
      fetchDataElements(),
      fetchCategoryOptionCombos(),
      fetchDataSets(),
    ]);

    console.log(`\n📈 Retrieved:`);
    console.log(`  • ${dataElements.length} data elements`);
    console.log(
      `  • ${categoryOptionCombos.length} category option combinations`
    );
    console.log(`  • ${dataSets.length} data sets`);

    // Create and save CSV files
    console.log("\n💾 Creating CSV files...");

    // 1. Data elements with category combinations
    const dataElementsCSV = createDataElementsCSV(
      dataElements,
      categoryOptionCombos
    );
    saveCSVFile("dhis2_data_elements.csv", dataElementsCSV);

    // 2. Data sets mapping
    const dataSetsCSV = createDataSetsCSV(dataSets);
    saveCSVFile("dhis2_data_sets.csv", dataSetsCSV);

    // 3. Create a summary mapping file that combines both
    const summaryCSV = createSummaryMappingCSV(dataElements, dataSets);
    saveCSVFile("dhis2_summary_mappings.csv", summaryCSV);

    console.log("\n✅ Successfully completed DHIS2 mappings fetch!");
    console.log("\n📁 Files created:");
    console.log(
      "  • dhis2_data_elements.csv - All data elements with category combos"
    );
    console.log("  • dhis2_data_sets.csv - Data sets and their elements");
    console.log(
      "  • dhis2_summary_mappings.csv - Combined summary for easy reference"
    );
  } catch (error) {
    console.error("❌ Error in main execution:", error);
    process.exit(1);
  }
}

/**
 * Create summary mapping CSV that can be easily referenced
 */
function createSummaryMappingCSV(dataElements, dataSets) {
  const csvHeader =
    "dhis2_dataElement_id,dhis2_code,dhis2_name,dhis2_shortName,dataset_name,categoryCombo_id,categoryOptionCombo_id,categoryOptionCombo_name,hmis_section_match\n";

  let csvContent = csvHeader;

  // Create a map of dataElement IDs to their datasets
  const dataElementToDataSet = {};
  dataSets.forEach((dataSet) => {
    const dataSetElements = dataSet.dataSetElements || [];
    dataSetElements.forEach((dsElement) => {
      const dataElement = dsElement.dataElement || {};
      if (dataElement.id) {
        dataElementToDataSet[dataElement.id] =
          dataSet.name || dataSet.code || "";
      }
    });
  });

  dataElements.forEach((dataElement) => {
    const categoryCombo = dataElement.categoryCombo || {};
    const categoryOptionCombos = categoryCombo.categoryOptionCombos || [{}];
    const dataSetName = dataElementToDataSet[dataElement.id] || "";

    categoryOptionCombos.forEach((categoryOptionCombo) => {
      // Try to match with HMIS sections based on name/code patterns
      const hmisMatch = findHMISMatch(dataElement.name, dataElement.code);

      csvContent +=
        [
          dataElement.id || "",
          dataElement.code || "",
          `"${(dataElement.name || "").replace(/"/g, '""')}"`,
          `"${(dataElement.shortName || "").replace(/"/g, '""')}"`,
          `"${dataSetName.replace(/"/g, '""')}"`,
          categoryCombo.id || "",
          categoryOptionCombo.id || "",
          `"${(categoryOptionCombo.name || "").replace(/"/g, '""')}"`,
          `"${hmisMatch.replace(/"/g, '""')}"`,
        ].join(",") + "\n";
    });
  });

  return csvContent;
}

/**
 * Try to find HMIS section matches based on naming patterns
 */
function findHMISMatch(name, code) {
  if (!name && !code) return "";

  const searchText = `${name || ""} ${code || ""}`.toLowerCase();

  // Common HMIS patterns
  const patterns = {
    EP01: ["malaria", "fever"],
    CD01: ["diarrhoea", "diarrhea"],
    AN01: ["antenatal", "anc"],
    MA01: ["maternity", "delivery"],
    PN01: ["postnatal", "pnc"],
    FP01: ["family planning", "contraceptive"],
    CL01: ["immunization", "vaccination", "bcg"],
    HB01: ["hepatitis"],
    HT01: ["hiv", "aids"],
    SM01: ["circumcision"],
    NA01: ["nutrition", "malnutrition"],
    GBV01: ["gender based violence", "gbv"],
  };

  for (const [code, keywords] of Object.entries(patterns)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return code;
    }
  }

  return "";
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  fetchDataElements,
  fetchCategoryOptionCombos,
  fetchDataSets,
  testConnection,
};
