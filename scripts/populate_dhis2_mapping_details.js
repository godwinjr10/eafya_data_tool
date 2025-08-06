const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Pool } = require("pg");

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "eafyaentebbedb",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

async function populateTable() {
  const client = await pool.connect();

  try {
    // Clear existing data
    await client.query(
      "TRUNCATE TABLE reporting.dhis2_mapping_details RESTART IDENTITY CASCADE"
    );
    console.log("Cleared existing data from dhis2_mapping_details table");

            // Try the complete CSV first, fallback to original
        let csvFilePath = path.join(__dirname, '../backend/models/dhis2_mapping_details_complete.csv');
        if (!fs.existsSync(csvFilePath)) {
            csvFilePath = path.join(__dirname, '../backend/models/dhis2_mapping_details.csv');
        }
        console.log(`Using CSV file: ${csvFilePath}`);
    const insertQuery = `
            INSERT INTO reporting.dhis2_mapping_details (
                hmis_id, hmis_code, hmis_name, hmis_section, hmis_section_id,
                dhis2_dataElement_id, dhis2_code, dhis2_name, dhis2_shortName,
                dhis2_dataset, dhis2_categoryCombo_id, dhis2_categoryOptionCombo_id,
                dhis2_categoryOptionCombo_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `;

    let rowCount = 0;
    const batchSize = 100;
    let batch = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", async (row) => {
          batch.push([
            parseInt(row.hmis_id) || null,
            row.hmis_code || null,
            row.hmis_name || null,
            row.hmis_section || null,
            row.hmis_section_id || null,
            row.dhis2_dataElement_id || null,
            row.dhis2_code || null,
            row.dhis2_name || null,
            row.dhis2_shortName || null,
            row.dhis2_dataset || null,
            row.dhis2_categoryCombo_id || null,
            row.dhis2_categoryOptionCombo_id || null,
            row.dhis2_categoryOptionCombo_name || null,
          ]);

          if (batch.length >= batchSize) {
            try {
              for (const values of batch) {
                await client.query(insertQuery, values);
                rowCount++;
              }
              console.log(`Processed ${rowCount} rows...`);
              batch = [];
            } catch (error) {
              console.error("Error inserting batch:", error);
            }
          }
        })
        .on("end", async () => {
          try {
            // Process remaining batch
            for (const values of batch) {
              await client.query(insertQuery, values);
              rowCount++;
            }

            console.log(
              `Successfully imported ${rowCount} rows into dhis2_mapping_details table`
            );
            resolve();
          } catch (error) {
            console.error("Error processing final batch:", error);
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error populating table:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
populateTable()
  .then(() => {
    console.log("Data population completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
