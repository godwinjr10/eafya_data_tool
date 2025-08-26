import axios from "axios";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import path from "path";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

dotenv.config({ path: path.resolve(_dirname, "../../.env") });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const DHIS2_URL = `${process.env.DHIS2_BASE_URL}/categoryOptionCombos`;

const AUTH = {
    username: process.env.DHIS2_USERNAME,
    password: process.env.DHIS2_PASSWORD,
};

// SQL to create the table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS reporting.dhis2_optioncombos (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name TEXT
);`;

// Function to fetch paginated data from DHIS2
const fetchCategoryOptionCombos = async (url) => {
    let allData = [];
    try {
        while (url) {
            console.log(`Fetching data from: ${url}`);
            const response = await axios.get(url, { auth: AUTH });

            if (response.data?.categoryOptionCombos) {
                allData = [...allData, ...response.data.categoryOptionCombos];
                console.log(`Fetched ${response.data.categoryOptionCombos.length} records.`);

                // Get the next page URL if available
                url = response.data.pager?.nextPage || null;
            } else {
                url = null;
            }
        }
        console.log(`Total records fetched: ${allData.length}`);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
    return allData;
};

// Function to save data into PostgreSQL
const saveToDatabase = async (data) => {
    const client = await pool.connect();
    try {
        await client.query(createTableQuery);
        console.log("Table ensured.");

        // Log the first item to see available fields
        if (data.length > 0) {
            console.log("Sample data item:", JSON.stringify(data[0], null, 2));
        }

        const insertQuery = `
      INSERT INTO reporting.dhis2_optioncombos (code, name)
      VALUES ($1, $2)
      ON CONFLICT (code) DO UPDATE 
      SET name = EXCLUDED.name;`;

        const promises = data.map(item => {
            // Use item.id as the code from DHIS2 API response
            const code = item.id;
            const name = item.displayName || item.name || 'Unknown';
            
            console.log(`Inserting: code=${code}, name=${name}`);
            
            return client.query(insertQuery, [code, name]);
        });

        await Promise.all(promises);
        console.log("Data saved to database.");
    } catch (error) {
        console.error("Error saving to database:", error.message);
    } finally {
        client.release();
    }
};

// Main function
const main = async () => {
    const initialUrl = DHIS2_URL;
    const data = await fetchCategoryOptionCombos(initialUrl);

    if (data.length > 0) {
        await saveToDatabase(data);
    } else {
        console.log("No data to save.");
    }

    pool.end();
};

// Run the script
main();

