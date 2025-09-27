import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get lab tests mappings
router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT 
          
            distinct hmis_code, 
            hmis_name, 
              _section_id, 
              section_name,
              category
            FROM reporting.dhis_eafya_mapping_labtests
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get lab test items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
                distinct id, 
                "name"
            FROM dwh.dim_eafya_lab_test
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific lab test mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting lab test mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_labtests WHERE eafya_labtest_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Lab test mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab test mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get lab test mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
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

// Create lab test mappings
router.post("/", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA lab tests
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

    // Fetch existing lab test data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          category,
          hmis_code,
          hmis_name,
          dhis2_data_element_id
        FROM reporting.dhis_eafya_mapping_labtests
        WHERE hmis_code = $1 AND _section_id = $2
        AND dhis2_data_element_id IS NOT NULL
        ORDER BY dhis2_data_element_id
      `;

    console.log("Executing labtests query with params:", [
      hmis_code,
      section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code, section_id]);

    console.log(`Found ${rows.length} distinct lab test entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing lab test data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing lab test entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(
          `Processing lab test entry ${i + 1}/${rows.length}: ${
            existingData.dhis2_data_element_id
          }`
        );

        // Inner loop: For each eAFYA lab test mapping
        for (let j = 0; j < mappings.length; j++) {
          const eafyaTest = mappings[j];
          console.log(
            `  - Mapping eAFYA test ${j + 1}/${mappings.length}: ${
              eafyaTest.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_labtests (
                _section_id,
                category,
                hmis_code,
                hmis_name,
                eafya_labtest_id,
                eafya_labtest_name,
                dhis2_data_element_id
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              existingData._section_id,
              existingData.category,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaTest.id,
              eafyaTest.name || null,
              existingData.dhis2_data_element_id,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total lab test mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Lab test mappings saved successfully",
        count: totalInserted,
        details: {
          lab_test_entries: rows.length,
          eafya_tests: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} lab test entries × ${mappings.length} eAFYA tests = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving lab test mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
