import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get conditions mappings
router.get("/", async (req, res) => {
  try {
    const query = `
      select 
       distinct  hmis_code, 
       hmis_name,  
       section_id, 
       section_name
      FROM reporting.dhis_eafya_mapping_conditions_final
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get disease items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_disease
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific condition mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting condition mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_conditions_final WHERE eafya_disease_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Condition mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get condition mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
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

// Create condition mappings
router.post("/", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA diseases
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

    // Fetch existing condition data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          csv_id,
          section_id,
          section_name,
          hmis_code,
          hmis_name,
          data_element_id,
          category_optioncombo_id,
          category_optioncombo_name
        FROM reporting.dhis_eafya_mapping_conditions_final
        WHERE hmis_code ILIKE $1 
        ORDER BY data_element_id
      `;

    console.log("Executing conditions query with params:", [
      hmis_code,
      section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [`%${hmis_code}%`]);

    console.log(`Found ${rows.length} distinct condition entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing condition data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing condition entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(
          `Processing condition entry ${i + 1}/${rows.length}: ${
            existingData.data_element_id
          }`
        );

        // Inner loop: For each eAFYA disease
        for (let j = 0; j < mappings.length; j++) {
          const eafyaDisease = mappings[j];
          console.log(
            `  - Mapping eAFYA disease ${j + 1}/${mappings.length}: ${
              eafyaDisease.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_conditions_final (
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
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              existingData.csv_id,
              existingData.section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaDisease.id,
              eafyaDisease.name || null,
              existingData.data_element_id,
              existingData.category_optioncombo_id,
              existingData.category_optioncombo_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total condition mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Condition mappings saved successfully",
        count: totalInserted,
        details: {
          condition_entries: rows.length,
          eafya_diseases: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} condition entries × ${mappings.length} eAFYA diseases = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving condition mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
