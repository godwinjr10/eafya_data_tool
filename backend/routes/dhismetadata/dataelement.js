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

// Updated to use the new DHIS2 API endpoint for datasets
const DHIS2_URL = `${process.env.DHIS2_BASE_URL}/dataSets/quMWqLxzcfO?fields=id,uid,code,name,dataSetElements[dataElement[id,uid,code,name]]`;

const AUTH = {
    username: process.env.DHIS2_USERNAME,
    password: process.env.DHIS2_PASSWORD,
};

// Updated table structure to store flattened dataset and data element information
const createTableQuery = `
CREATE TABLE IF NOT EXISTS reporting.dhis2_datasets_elements (
    id SERIAL PRIMARY KEY,
    dataset_id VARCHAR(100),
    dataset_code VARCHAR(100),
    dataset_name TEXT,
    dataelement_id VARCHAR(100),
    dataelement_code VARCHAR(100),
    dataelement_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dataset_id, dataelement_id)
);`;

// Function to fetch dataset data from DHIS2
const fetchDatasetData = async (url) => {
    try {
        console.log(`Fetching dataset data from: ${url}`);
        const response = await axios.get(url, { auth: AUTH });
        
        if (response.data) {
            console.log(`Dataset fetched successfully: ${response.data.name}`);
            return response.data;
        } else {
            console.log("No dataset data received");
            return null;
        }
    } catch (error) {
        console.error("Error fetching dataset data:", error.message);
        return null;
    }
};

// Function to flatten the nested response structure
const flattenDatasetResponse = (datasetData) => {
    if (!datasetData || !datasetData.dataSetElements) {
        console.log("No dataset elements found");
        return [];
    }

    const flattenedData = [];
    
    datasetData.dataSetElements.forEach((element, index) => {
        if (element.dataElement) {
            const flattenedItem = {
                dataset_id: datasetData.id || null,
                dataset_code: datasetData.code || null,
                dataset_name: datasetData.name || null,
                dataelement_id: element.dataElement.id || null,
                dataelement_code: element.dataElement.code || null,
                dataelement_name: element.dataElement.name || null
            };
            
            // Log any null values for debugging
            const nullFields = Object.entries(flattenedItem)
                .filter(([key, value]) => value === null && key !== 'created_at')
                .map(([key]) => key);
            
            if (nullFields.length > 0) {
                console.log(`Warning: Element ${index} has null values for: ${nullFields.join(', ')}`);
            }
            
            flattenedData.push(flattenedItem);
        }
    });

    console.log(`Flattened ${flattenedData.length} data elements from dataset`);
    return flattenedData;
};

// Function to save flattened data into PostgreSQL
const saveToDatabase = async (data) => {
    const client = await pool.connect();
    try {
        await client.query(createTableQuery);
        console.log("Table ensured.");

        // Log the first item to see the flattened structure
        if (data.length > 0) {
            console.log("Sample flattened data item:", JSON.stringify(data[0], null, 2));
        }

        const insertQuery = `
      INSERT INTO reporting.dhis2_datasets_elements 
      (dataset_id, dataset_code, dataset_name, dataelement_id, dataelement_code, dataelement_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (dataset_id, dataelement_id) DO UPDATE 
      SET 
        dataset_code = EXCLUDED.dataset_code,
        dataset_name = EXCLUDED.dataset_name,
        dataelement_code = EXCLUDED.dataelement_code,
        dataelement_name = EXCLUDED.dataelement_name;`;

        const promises = data.map(item => {
            console.log(`Inserting: dataset=${item.dataset_code}, element=${item.dataelement_code}`);
            
            return client.query(insertQuery, [
                item.dataset_id,
                item.dataset_code,
                item.dataset_name,
                item.dataelement_id,
                item.dataelement_code,
                item.dataelement_name
            ]);
        });

        await Promise.all(promises);
        console.log("Flattened data saved to database.");
    } catch (error) {
        console.error("Error saving to database:", error.message);
    } finally {
        client.release();
    }
};

// Main function
const main = async () => {
    const datasetData = await fetchDatasetData(DHIS2_URL);

    if (datasetData) {
        const flattenedData = flattenDatasetResponse(datasetData);
        
        if (flattenedData.length > 0) {
            await saveToDatabase(flattenedData);
        } else {
            console.log("No data elements to save.");
        }
    } else {
        console.log("No dataset data to process.");
    }

    pool.end();
};

// Run the script
main();