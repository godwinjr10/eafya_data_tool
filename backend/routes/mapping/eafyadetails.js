import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get commodity mapping details by HMIS code
router.get("/commodities/:hmisCode", async (req, res) => {
    try {
        const { hmisCode } = req.params;
        console.log("Fetching commodity mappings for HMIS code:", hmisCode);

        // First, let's check if the table exists
        const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = 'dhis_eafya_mapping_commodities'
      ) as table_exists
    `;

        const tableCheck = await pool.query(tableCheckQuery);
        console.log("Table exists check:", tableCheck.rows[0]);

        if (!tableCheck.rows[0].table_exists) {
            console.error(
                "Table 'reporting.dhis_eafya_mapping_commodities' does not exist"
            );
            return res.status(500).json({
                message:
                    "Database table 'dhis_eafya_mapping_commodities' does not exist",
                hmis_code: hmisCode,
                suggestion:
                    "Please check if the table name is correct or if it needs to be created",
            });
        }

        // Now let's check the table structure
        const structureQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'reporting' 
      AND table_name = 'dhis_eafya_mapping_commodities'
      ORDER BY ordinal_position
    `;

        const structure = await pool.query(structureQuery);
        console.log("Table structure:", structure.rows);

        const query = `
      SELECT 
        distinct
        eafya_product_id as eafya_id,
        eafya_product_name as eafya_name,
        hmis_name
      FROM reporting.dhis_eafya_mapping_commodities
      WHERE hmis_code = $1
      ORDER BY  eafya_product_name
    `;

        console.log("Executing query:", query);
        console.log("Query parameters:", [hmisCode]);

        const { rows } = await pool.query(query, [hmisCode]);
        console.log("Query result rows:", rows.length);

        if (rows.length === 0) {
            console.log("No mappings found for HMIS code:", hmisCode);
            return res.status(404).json({
                message: "No commodity mappings found for this HMIS code",
                hmis_code: hmisCode,
            });
        }

        console.log("Sending response with", rows.length, "mappings");
        res.json({
            hmis_code: hmisCode,
            hmis_name: rows[0].hmis_name,
            mappings: rows,
        });
    } catch (error) {
        console.error("Error fetching commodity mapping details:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            message: error.message,
            stack: error.stack,
            hmis_code: req.params.hmisCode,
        });
    }
});

// Get lab test mapping details by HMIS code
router.get("/labtests/:hmisCode", async (req, res) => {
    try {
        const { hmisCode } = req.params;

        const query = `
      SELECT 
        distinct hmis_code,
        hmis_name,
        eafya_labtest_id as eafya_id,
        eafya_labtest_name as eafya_name
      FROM reporting.dhis_eafya_mapping_labtests
      WHERE hmis_code = $1
      ORDER BY hmis_code
    `;

        const { rows } = await pool.query(query, [hmisCode]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No lab test mappings found for this HMIS code",
                hmis_code: hmisCode,
            });
        }

        res.json({
            hmis_code: hmisCode,
            hmis_name: rows[0].hmis_name,
            mappings: rows,
        });
    } catch (error) {
        console.error("Error fetching lab test mapping details:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get family planning mapping details by HMIS code
router.get("/familyplanning/:hmisCode", async (req, res) => {
    try {
        const { hmisCode } = req.params;

        const query = `
      SELECT 
      
        distinct hmis_code,
        hmis_name,
          _section_id,
        section_name,
        eafya_id,
        eafya_name
      FROM reporting.dhis_eafya_mapping_familyplanning
      WHERE hmis_code = $1
      ORDER BY hmis_code
    `;

        const { rows } = await pool.query(query, [hmisCode]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No family planning mappings found for this HMIS code",
                hmis_code: hmisCode,
            });
        }

        res.json({
            hmis_code: hmisCode,
            hmis_name: rows[0].hmis_name,
            mappings: rows,
        });
    } catch (error) {
        console.error("Error fetching family planning mapping details:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get vaccine mapping details by HMIS code
router.get("/vaccines/:hmisCode", async (req, res) => {
    try {
        const { hmisCode } = req.params;

        const query = `
      SELECT 
     
        distinct hmis_code,
        hmis_name,
        eafya_vaccine_id as eafya_id,
        eafya_vaccine_name as eafya_name
      FROM reporting.dhis_eafya_mapping_vaccines
      WHERE hmis_code = $1
      ORDER BY hmis_code
    `;

        const { rows } = await pool.query(query, [hmisCode]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No vaccine mappings found for this HMIS code",
                hmis_code: hmisCode,
            });
        }

        res.json({
            hmis_code: hmisCode,
            hmis_name: rows[0].hmis_name,
            mappings: rows,
        });
    } catch (error) {
        console.error("Error fetching vaccine mapping details:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get condition mapping details by HMIS code
router.get("/conditions/:hmisCode", async (req, res) => {
    try {
        const { hmisCode } = req.params;

        const query = `
      SELECT 
        distinct hmis_code,
        hmis_name,
         eafya_disease_id as eafya_id,
        eafya_disease_name as eafya_name
      FROM reporting.dhis_eafya_mapping_conditions_final
      WHERE hmis_code ILIKE $1
      ORDER BY hmis_code
    `;

        const { rows } = await pool.query(query, [`%${hmisCode}%`]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No condition mappings found for this HMIS code",
                hmis_code: hmisCode,
            });
        }

        res.json({
            hmis_code: hmisCode,
            hmis_name: rows[0].hmis_name,
            mappings: rows,
        });
    } catch (error) {
        console.error("Error fetching condition mapping details:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;