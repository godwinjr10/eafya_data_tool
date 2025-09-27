import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get commodities mappings
router.get("/", async (req, res) => {
  try {
    const query = `
                SELECT 
            distinct hmis_code,
            section_id, 
            section_name,
            hmis_name
            FROM reporting.dhis_eafya_mapping_commodities
            order by hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products for mapping
router.get("/products", async (req, res) => {
  try {
    const query = `
            SELECT 
                s.id,
                s."name"
            FROM dwh.dim_eafya_product s
            WHERE s.product_type = 'drug'
            ORDER BY s."name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific commodity mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_commodities WHERE eafya_product_id = $1",
      [eafya_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Commodity mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting commodity mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get commodity mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
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

// Create commodity mappings
router.post("/", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA products
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch ALL distinct DHIS2 data elements for the given hmis_code and section_id
    const queryExisting = `
              SELECT 
                  DISTINCT   
                  dhis2_data_element_id, 
                  data_element_name,
                  section_id, 
                  section_name,
                  hmis_code,
                  hmis_name
              FROM reporting.dhis_eafya_mapping_commodities
              WHERE hmis_code = $1 AND section_id = $2
              AND dhis2_data_element_id IS NOT NULL
              ORDER BY dhis2_data_element_id
          `;

    console.log("Executing query with params:", [hmis_code, section_id]);
    const { rows } = await pool.query(queryExisting, [hmis_code, section_id]);

    console.log("Raw query result:", JSON.stringify(rows, null, 2));
    console.log(`Found ${rows.length} distinct DHIS2 data elements`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing DHIS2 data elements found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      console.log(
        `Found ${rows.length} DHIS2 data elements for HMIS code ${hmis_code}, section ${section_id}`
      );
      console.log(`Will create mappings for ${mappings.length} eAFYA products`);

      let totalInserted = 0;

      // Outer loop: For each DHIS2 data element found
      for (let i = 0; i < rows.length; i++) {
        const dhis2Element = rows[i];
        console.log(
          `Processing DHIS2 element ${i + 1}/${rows.length}: ${
            dhis2Element.dhis2_data_element_id
          }`
        );

        // Inner loop: For each eAFYA product mapping
        for (let j = 0; j < mappings.length; j++) {
          const eafyaProduct = mappings[j];
          console.log(
            `  - Mapping eAFYA product ${j + 1}/${mappings.length}: ${
              eafyaProduct.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_commodities (
                              section_id,
                              hmis_code,
                              hmis_name,
                              eafya_product_id,
                              eafya_product_name,
                              dhis2_data_element_id,
                              data_element_name
                          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              dhis2Element.section_id,
              dhis2Element.hmis_code,
              dhis2Element.hmis_name,
              eafyaProduct.id,
              eafyaProduct.name || null,
              dhis2Element.dhis2_data_element_id,
              dhis2Element.data_element_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Commodity mappings saved successfully",
        count: totalInserted,
        details: {
          dhis2_data_elements: rows.length,
          eafya_products: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} DHIS2 elements × ${mappings.length} eAFYA products = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving commodity mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
