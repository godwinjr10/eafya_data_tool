import axios from "axios";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Load environment variables
dotenv.config({ path: path.resolve(_dirname, "../../.env") });

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// DHIS2 setup
const BASE_URL = `${process.env.DHIS2_BASE_URL}/dataSets/quMWqLxzcfO/dataValueSet`;
const PAGING_ENABLED = false; // Set to true to fetch page-by-page

const DHIS2_URL = PAGING_ENABLED
  ? `${BASE_URL}?page=1`
  : `${BASE_URL}?paging=false`;

const AUTH = {
  username: process.env.DHIS2_USERNAME,
  password: process.env.DHIS2_PASSWORD,
};

// SQL to create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS reporting.dhis2_dataelements_1056 (
    id SERIAL PRIMARY KEY,
    dataElement VARCHAR(50) NOT NULL,
    categoryOptionCombo VARCHAR(255) NOT NULL
  );
`;

// Fetch paginated or unpaginated data
const fetchDataElements = async (initialUrl) => {
  let allData = [];
  let url = initialUrl;
  let page = 1;

  try {
    if (!PAGING_ENABLED) {
      console.log(`Fetching all data from: ${url}`);
      const response = await axios.get(url, { auth: AUTH });

      if (response.data?.dataValues) {
        allData = response.data.dataValues;
        console.log(`Fetched total: ${allData.length} records (no pagination).`);
      } else {
        console.log("No data values found.");
      }
    } else {
      let total = 0;
      while (url) {
        console.log(`Fetching page ${page} from: ${url}`);
        const response = await axios.get(url, { auth: AUTH });

        if (response.data?.dataValues) {
          allData.push(...response.data.dataValues);
          console.log(`Fetched ${response.data.dataValues.length} records on page ${page}.`);
        }

        if (response.data?.pager) {
          total = response.data.pager.total || total;
          url = response.data.pager.nextPage || null;
          page++;
        } else {
          url = null;
        }
      }
      console.log(`Total records reported by pager: ${total}`);
      console.log(`Total records fetched: ${allData.length}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }

  return allData;
};

// Save records to the database
const saveToDatabase = async (data) => {
  const client = await pool.connect();
  try {
    await client.query(createTableQuery);
    console.log("Table ensured.");

    const insertQuery = `
      INSERT INTO reporting.dhis2_dataelements_1056 (dataElement, categoryOptionCombo)
      VALUES ($1, $2);
    `;

    for (const item of data) {
      await client.query(insertQuery, [item.dataElement, item.categoryOptionCombo]);
    }

    console.log("Data saved to database.");
  } catch (error) {
    console.error("Error saving to database:", error.message);
  } finally {
    client.release();
  }
};

// Main runner
const main = async () => {
  const data = await fetchDataElements(DHIS2_URL);

  if (data.length > 0) {
    await saveToDatabase(data);
  } else {
    console.log("No data to save.");
  }

  pool.end();
};

// Run script
main();
