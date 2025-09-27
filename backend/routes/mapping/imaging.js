import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get Imaging mappings
router.get("/", async (req, res) => {
  try {
    const query = `
      select 
        id,
        hmis_code, 
        SUBSTRING(hmis_name FROM 6) AS hmis_name,
        section_id, 
        section_name
      FROM reporting.dhis2_dataelements_108_imaging
      ORDER BY section_id
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Imaging items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
              id, 
              "name",
              imaging_category_id
            FROM dwh.dim_eafya_imaging
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get imaging mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
  try {
    const { hmisCode } = req.params;

    const query = `
      SELECT 
        distinct hmis_code,
        hmis_name,
        eafya_id,
        eafya_name
      FROM reporting.dhis2_dataelements_108_imaging
      WHERE hmis_code = $1
      ORDER BY hmis_code
    `;

    const { rows } = await pool.query(query, [hmisCode]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No imaging mappings found for this HMIS code",
        hmis_code: hmisCode,
      });
    }

    res.json({
      hmis_code: hmisCode,
      hmis_name: rows[0].hmis_name,
      mappings: rows,
    });
  } catch (error) {
    console.error("Error fetching imaging mapping details:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create imaging mappings
router.post("/", async (req, res) => {
  try {
    const {
      section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA imaging
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

    // Fetch existing imaging data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          id,
          hmis_code,
          hmis_name,
          section_id,
          section_name
        FROM reporting.dhis2_dataelements_108_imaging
        WHERE hmis_code = $1 AND section_id = $2
        ORDER BY id
      `;

    console.log("Executing imaging query with params:", [
      hmis_code,
      section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code, section_id]);

    console.log(`Found ${rows.length} distinct imaging entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing imaging data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing imaging entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(
          `Processing imaging entry ${i + 1}/${rows.length}: ${
            existingData.id
          }`
        );

        // Inner loop: For each eAFYA imaging mapping
        for (let j = 0; j < mappings.length; j++) {
          const eafyaImaging = mappings[j];
          console.log(
            `  - Mapping eAFYA imaging ${j + 1}/${mappings.length}: ${
              eafyaImaging.id
            }`
          );

          await client.query(
            `UPDATE reporting.dhis2_dataelements_108_imaging 
             SET eafya_id = $1, eafya_name = $2 
             WHERE id = $3`,
            [
              eafyaImaging.id,
              eafyaImaging.name || null,
              existingData.id,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total imaging mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Imaging mappings saved successfully",
        count: totalInserted,
        details: {
          imaging_entries: rows.length,
          eafya_imaging: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} imaging entries × ${mappings.length} eAFYA imaging = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving imaging mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific imaging mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting imaging mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis2_dataelements_108_imaging WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Imaging mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting imaging mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
