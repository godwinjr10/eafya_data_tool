import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get vaccines mappings
router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT 
            
            distinct hmis_code,
            hmis_name,
              _section_id,
            section_name
        FROM reporting.dhis_eafya_mapping_vaccines
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vaccine items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_vaccine
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific vaccine mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting vaccine mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_vaccines WHERE eafya_vaccine_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Vaccine mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting vaccine mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get vaccine mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
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

// Create vaccine mappings
router.post("/", async (req, res) => {
  try {
    const {
      _section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA vaccines
    } = req.body;

    // Simplified validation - only check for required fields
    if (
      !hmis_code ||
      !_section_id ||
      !Array.isArray(mappings) ||
      mappings.length === 0
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_code, section_id and non-empty mappings array",
      });
    }

    // Fetch existing vaccine data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          section_name,
          hmis_code,
          hmis_name
        FROM reporting.dhis_eafya_mapping_vaccines
        WHERE hmis_code = $1 
        ORDER BY hmis_code
      `;

    console.log("Executing vaccines query with params:", [
      hmis_code,
      _section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code]);

    console.log(`Found ${rows.length} distinct vaccine entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing vaccine data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing vaccine entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(`Processing vaccine entry ${i + 1}/${rows.length}`);

        // Inner loop: For each eAFYA vaccine
        for (let j = 0; j < mappings.length; j++) {
          const eafyaVaccine = mappings[j];
          console.log(
            `  - Mapping eAFYA vaccine ${j + 1}/${mappings.length}: ${
              eafyaVaccine.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_vaccines (
                _section_id,
                section_name,
                hmis_code,
                hmis_name,
                eafya_vaccine_id,
                eafya_vaccine_name
              ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              existingData._section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaVaccine.id,
              eafyaVaccine.name || null,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total vaccine mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Vaccine mappings saved successfully",
        count: totalInserted,
        details: {
          vaccine_entries: rows.length,
          eafya_vaccines: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} vaccine entries × ${mappings.length} eAFYA vaccines = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving vaccine mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
