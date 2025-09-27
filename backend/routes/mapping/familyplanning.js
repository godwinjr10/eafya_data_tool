import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get family planning mappings
router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT 
           distinct hmis_code,
            hmis_name,
            _section_id, 
            section_name
        FROM reporting.dhis_eafya_mapping_familyplanning
        ORDER BY hmis_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get family planning items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
               distinct id, 
                "name"
            FROM dwh.dim_eafya_family_planning
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific family planning mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting family planning mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis_eafya_mapping_familyplanning WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Family planning mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting family planning mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get family planning mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
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

// Create family planning mappings
router.post("/", async (req, res) => {
  try {
    const {
      _section_id,
      hmis_code,
      mappings, // [{ id, name }] eAFYA family planning items
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

    // Fetch existing family planning data for the given hmis_code and section_id
    const queryExisting = `
        SELECT 
          DISTINCT   
          _section_id,
          section_name,
          hmis_code,
          hmis_name,
          categoryoptioncombo_name
        FROM reporting.dhis_eafya_mapping_familyplanning
        WHERE hmis_code = $1 
        ORDER BY categoryoptioncombo_name
      `;

    console.log("Executing familyplanning query with params:", [
      hmis_code,
      _section_id,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code]);

    console.log(`Found ${rows.length} distinct family planning entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing family planning data found for the provided hmis_code and section_id",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // Outer loop: For each existing family planning entry
      for (let i = 0; i < rows.length; i++) {
        const existingData = rows[i];
        console.log(`Processing family planning entry ${i + 1}/${rows.length}`);

        // Inner loop: For each eAFYA family planning item
        for (let j = 0; j < mappings.length; j++) {
          const eafyaItem = mappings[j];
          console.log(
            `  - Mapping eAFYA item ${j + 1}/${mappings.length}: ${
              eafyaItem.id
            }`
          );

          await client.query(
            `INSERT INTO reporting.dhis_eafya_mapping_familyplanning (
                _section_id,
                section_name,
                hmis_code,
                hmis_name,
                eafya_id,
                eafya_name,
                categoryoptioncombo_name
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              existingData._section_id,
              existingData.section_name,
              existingData.hmis_code,
              existingData.hmis_name,
              eafyaItem.id,
              eafyaItem.name || null,
              existingData.categoryoptioncombo_name,
            ]
          );
          totalInserted++;
        }
      }

      console.log(`Total family planning mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "Family planning mappings saved successfully",
        count: totalInserted,
        details: {
          family_planning_entries: rows.length,
          eafya_items: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${rows.length} family planning entries × ${mappings.length} eAFYA items = ${totalInserted} mappings`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving family planning mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
