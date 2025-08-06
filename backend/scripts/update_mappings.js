#!/usr/bin/env node

/**
 * Simple script to update DHIS2 mappings for HMIS 105 form
 * Usage: node backend/scripts/update_mappings.js
 */

import { generateMappings } from "./fetch_dhis2_mappings.js";

console.log("🔄 Updating DHIS2 mappings for HMIS 105 form...\n");

generateMappings()
  .then(() => {
    console.log("\n✅ Mapping update completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error updating mappings:", error);
    process.exit(1);
  });

