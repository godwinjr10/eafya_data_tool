import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Test route to check database connection
router.get("/test", async (req, res) => {
  try {
    console.log("Testing database connection...");
    const result = await pool.query("SELECT 1 as test");
    console.log("Database connection successful:", result.rows);
    res.json({
      message: "Database connection successful",
      test: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Route to check available tables
router.get("/tables", async (req, res) => {
  try {
    console.log("Checking available tables...");
    const result = await pool.query(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema IN ('reporting', 'dwh') 
      AND table_name LIKE '%eafya%'
      ORDER BY table_schema, table_name
    `);
    console.log("Available tables:", result.rows);

    // Also check for tables with 'commodities' in the name
    const commoditiesResult = await pool.query(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema IN ('reporting', 'dwh') 
      AND table_name LIKE '%commodities%'
      ORDER BY table_schema, table_name
    `);
    console.log("Commodities tables:", commoditiesResult.rows);

    res.json({
      message: "Tables found",
      eafya_tables: result.rows,
      commodities_tables: commoditiesResult.rows,
    });
  } catch (error) {
    console.error("Error checking tables:", error);
    res.status(500).json({
      message: "Error checking tables",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Route to check table structure
router.get("/table-structure/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    console.log("Checking structure for table:", tableName);

    const result = await pool.query(
      `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND table_schema = 'reporting'
      ORDER BY ordinal_position
    `,
      [tableName]
    );

    console.log("Table structure:", result.rows);
    res.json({
      message: `Structure for table ${tableName}`,
      columns: result.rows,
    });
  } catch (error) {
    console.error("Error checking table structure:", error);
    res.status(500).json({
      message: "Error checking table structure",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Route to test simple query on commodities table
router.get("/test-commodities", async (req, res) => {
  try {
    console.log("Testing simple query on commodities table...");

    // First check if the table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = 'dhis_eafya_mapping_commodities'
      )
    `);

    if (!tableExists.rows[0].exists) {
      console.log("Table 'dhis_eafya_mapping_commodities' does not exist");

      // Try to find alternative tables
      const altTables = await pool.query(`
        SELECT table_name, table_schema 
        FROM information_schema.tables 
        WHERE table_schema IN ('reporting', 'dwh') 
        AND (table_name LIKE '%commodities%' OR table_name LIKE '%eafya%')
        ORDER BY table_schema, table_name
      `);

      return res.status(404).json({
        message: "Commodities table not found",
        table_exists: false,
        alternative_tables: altTables.rows,
        suggestion:
          "Check if the table name is different or if it needs to be created",
      });
    }

    // Test the actual query we'll use
    const testQuery = `
      SELECT 
        section_id,
        section_name,
        hmis_code,
        hmis_name,
        eafya_product_id,
        eafya_product_name,
        dhis2_data_element_id,
        data_element_name,
        unit
      FROM reporting.dhis_eafya_mapping_commodities
      WHERE hmis_code = 'SS01'
      LIMIT 1
    `;

    const testResult = await pool.query(testQuery);
    console.log("Test query result:", testResult.rows);

    const result = await pool.query(`
      SELECT COUNT(*) as total_rows
      FROM reporting.dhis_eafya_mapping_commodities
    `);

    console.log("Commodities table row count:", result.rows[0]);
    res.json({
      message: "Commodities table query successful",
      total_rows: result.rows[0].total_rows,
      table_exists: true,
      test_query_result: testResult.rows,
    });
  } catch (error) {
    console.error("Error testing commodities table:", error);
    res.status(500).json({
      message: "Error testing commodities table",
      error: error.message,
      stack: error.stack,
    });
  }
});

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
        eafya_product_id,
        eafya_product_name
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
        section_id,
        category,
        hmis_code,
        hmis_name,
        eafya_labtest_id,
        eafya_labtest_name,
        dhis2_data_element_id
      FROM reporting.dhis_eafya_mapping_labtests
      WHERE hmis_code = $1
      ORDER BY section_id, category, dhis2_data_element_id
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
        section_id,
        section_name,
        hmis_code,
        hmis_name,
        eafya_id,
        eafya_name,
        categoryoptioncombo_name
      FROM reporting.dhis_eafya_mapping_familyplanning
      WHERE hmis_code = $1
      ORDER BY section_id, categoryoptioncombo_name
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
        section_id,
        section_name,
        hmis_code,
        hmis_name,
        eafya_vaccine_id,
        eafya_vaccine_name
      FROM reporting.dhis_eafya_mapping_vaccines
      WHERE hmis_code = $1
      ORDER BY section_id
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
        distinct eafya_disease_id as eafya_product_id,
        eafya_disease_name as eafya_product_name
      FROM reporting.dhis_eafya_mapping_conditions_final
      WHERE hmis_code ILIKE $1
      ORDER BY eafya_disease_name
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

// Get all mappings for a specific HMIS code across all types
router.get("/all/:hmisCode", async (req, res) => {
  try {
    const { hmisCode } = req.params;

    // Get all mapping types for the HMIS code
    const queries = {
      commodities: `
         SELECT 
           'commodities' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_product_id,
           eafya_product_name,
           dhis2_data_element_id,
           data_element_name,
           unit
         FROM reporting.dhis_eafya_mapping_commodities
         WHERE hmis_code = $1
       `,
      labtests: `
         SELECT 
           'labtests' as mapping_type,
           section_id,
           category as section_name,
           hmis_code,
           hmis_name,
           eafya_labtest_id,
           eafya_labtest_name,
           dhis2_data_element_id
         FROM reporting.dhis_eafya_mapping_labtests
         WHERE hmis_code = $1
       `,
      familyplanning: `
         SELECT 
           'familyplanning' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_id,
           eafya_name,
           categoryoptioncombo_name
         FROM reporting.dhis_eafya_mapping_familyplanning
         WHERE hmis_code = $1
       `,
      vaccines: `
         SELECT 
           'vaccines' as mapping_type,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_vaccine_id,
           eafya_vaccine_name
         FROM reporting.dhis_eafya_mapping_vaccines
         WHERE hmis_code = $1
       `,
      conditions: `
         SELECT 
           'conditions' as mapping_type,
           csv_id,
           section_id,
           section_name,
           hmis_code,
           hmis_name,
           eafya_disease_id,
           eafya_disease_name,
           data_element_id,
           category_optioncombo_id,
           category_optioncombo_name
         FROM reporting.dhis_eafya_mapping_conditions_final
         WHERE hmis_code ILIKE $1
       `,
    };

    const results = {};
    let totalMappings = 0;

    for (const [type, query] of Object.entries(queries)) {
      try {
        const { rows } = await pool.query(query, [hmisCode]);
        results[type] = rows;
        totalMappings += rows.length;
      } catch (error) {
        console.error(`Error fetching ${type} mappings:`, error);
        results[type] = [];
      }
    }

    // Check if any mappings were found
    if (totalMappings === 0) {
      return res.status(404).json({
        message: "No mappings found for this HMIS code",
        hmis_code: hmisCode,
      });
    }

    res.json({
      hmis_code: hmisCode,
      total_mappings: totalMappings,
      mappings_by_type: results,
    });
  } catch (error) {
    console.error("Error fetching all mapping details:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
