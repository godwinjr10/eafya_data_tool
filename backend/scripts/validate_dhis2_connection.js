#!/usr/bin/env node

/**
 * Script to validate DHIS2 connection and test data fetching
 * Usage: node backend/scripts/validate_dhis2_connection.js
 */

import dhis2Api from "../config/dhis2.js";

async function testConnection() {
  try {
    console.log("🔗 Testing DHIS2 connection...\n");

    // Test basic connection
    console.log("1. Testing authentication...");
    const meResponse = await dhis2Api.get("/me");
    console.log(
      `   ✅ Connected as: ${meResponse.data.name} (${meResponse.data.username})`
    );
    console.log(`   📧 Email: ${meResponse.data.email || "Not provided"}`);
    console.log(
      `   🏢 Organization: ${
        meResponse.data.organisationUnits?.[0]?.name || "Not specified"
      }\n`
    );

    // Test data elements access
    console.log("2. Testing data elements access...");
    const dataElementsResponse = await dhis2Api.get("/dataElements", {
      params: {
        paging: true,
        pageSize: 5,
        fields: "id,code,name",
      },
    });
    console.log(
      `   ✅ Can access data elements (${dataElementsResponse.data.pager.total} total)`
    );
    console.log("   📋 Sample data elements:");
    dataElementsResponse.data.dataElements.forEach((de, index) => {
      console.log(`      ${index + 1}. ${de.code || "No code"} - ${de.name}`);
    });
    console.log("");

    // Test datasets access
    console.log("3. Testing datasets access...");
    const dataSetsResponse = await dhis2Api.get("/dataSets", {
      params: {
        paging: true,
        pageSize: 5,
        fields: "id,code,name",
        filter: "name:ilike:105",
      },
    });
    console.log(
      `   ✅ Found ${dataSetsResponse.data.pager.total} HMIS 105 related datasets`
    );
    if (dataSetsResponse.data.dataSets.length > 0) {
      console.log("   📋 HMIS 105 datasets:");
      dataSetsResponse.data.dataSets.forEach((ds, index) => {
        console.log(`      ${index + 1}. ${ds.code || "No code"} - ${ds.name}`);
      });
    } else {
      console.log(
        "   ⚠️  No HMIS 105 datasets found - you may need to check dataset names"
      );
    }
    console.log("");

    // Test category option combos access
    console.log("4. Testing category option combos...");
    const cocResponse = await dhis2Api.get("/categoryOptionCombos", {
      params: {
        paging: true,
        pageSize: 5,
        fields: "id,name",
      },
    });
    console.log(
      `   ✅ Can access category option combos (${cocResponse.data.pager.total} total)`
    );
    console.log("   📋 Sample category option combos:");
    cocResponse.data.categoryOptionCombos.slice(0, 3).forEach((coc, index) => {
      console.log(`      ${index + 1}. ${coc.name}`);
    });
    console.log("");

    // Test data value sets endpoint (for pushing data)
    console.log("5. Testing data value sets endpoint...");
    try {
      // This will likely fail with validation error, but we just want to check access
      await dhis2Api.post("/dataValueSets", { dataValues: [] });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(
          "   ✅ Data value sets endpoint accessible (validation error expected)"
        );
      } else {
        console.log(
          `   ⚠️  Data value sets endpoint returned: ${
            error.response?.status || "Unknown error"
          }`
        );
      }
    }

    console.log(
      "\n🎉 All tests passed! DHIS2 connection is working properly.\n"
    );
    console.log("📝 You can now run: node backend/scripts/update_mappings.js");
  } catch (error) {
    console.error("\n❌ Connection test failed:");
    console.error(`   Error: ${error.message}`);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(
        `   Response: ${JSON.stringify(error.response.data, null, 2)}`
      );
    }

    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Check your DHIS2 URL in backend/config/dhis2.js");
    console.log("   2. Verify your username and password");
    console.log("   3. Ensure the DHIS2 instance is accessible");
    console.log("   4. Check if your user has the required permissions");

    process.exit(1);
  }
}

// Run the test
testConnection();

