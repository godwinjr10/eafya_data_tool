import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get procedures mappings
router.get("/", async (req, res) => {
  try {
    const query = `
      select 
        MIN(id) as id,
        hmis_code, 
        SUBSTRING(hmis_name FROM 6) AS hmis_name,
        section_id, 
        section_name
      FROM reporting.dhis2_dataelements_108_procedures
      GROUP BY hmis_code, hmis_name, section_id, section_name
      ORDER BY section_id
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get procedures items for mapping
router.get("/items", async (req, res) => {
  try {
    const query = `
            SELECT 
              id, 
              major_theater_name as name
            FROM dwh.dim_eafya_major_theatre
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get procedures mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
  try {
    const { hmisCode } = req.params;

    const query = `
      SELECT 
        distinct hmis_code,
        hmis_name,
        eafya_id,
        eafya_name
      FROM reporting.dhis2_dataelements_108_procedures
      WHERE hmis_code = $1
      ORDER BY hmis_code
    `;

    const { rows } = await pool.query(query, [hmisCode]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No procedures mappings found for this HMIS code",
        hmis_code: hmisCode,
      });
    }

    res.json({
      hmis_code: hmisCode,
      hmis_name: rows[0].hmis_name,
      mappings: rows,
    });
  } catch (error) {
    console.error("Error fetching procedures mapping details:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create procedures mappings
router.post("/", async (req, res) => {
  try {
    const {
      hmis_code,
      mappings, // [{ id, name }] eAFYA procedures
    } = req.body;

    // Fetch existing procedures data for the given hmis_code
    const queryExisting = `
        SELECT 
          DISTINCT   
          id,
          hmis_code,
          hmis_name,
          section_id,
          section_name,
          dataelement
        FROM reporting.dhis2_dataelements_108_procedures
        WHERE hmis_code = $1
        ORDER BY id
      `;

    console.log("Executing procedures query with params:", [
      hmis_code,
    ]);
    const { rows } = await pool.query(queryExisting, [hmis_code]);

    console.log(`Found ${rows.length} distinct procedures entries`);

    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "No existing procedures data found for the provided hmis_code",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalInserted = 0;

      // For each eAFYA procedure mapping, create one new record using the first existing procedure data
      for (let j = 0; j < mappings.length; j++) {
        const eafyaProcedure = mappings[j];
        const existingData = rows[0]; // Use the first existing procedure data
        
        console.log(
          `Creating record for eAFYA procedure ${j + 1}/${mappings.length}: ${
            eafyaProcedure.id
          }`
        );

        await client.query(
          `INSERT INTO reporting.dhis2_dataelements_108_procedures 
           (hmis_code, hmis_name, section_id, section_name, dataelement, eafya_id, eafya_name) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            existingData.hmis_code,
            existingData.hmis_name,
            existingData.section_id,
            existingData.section_name,
            existingData.dataelement,
            parseInt(eafyaProcedure.id),
            eafyaProcedure.name || null,
          ]
        );
        totalInserted++;
      }

      console.log(`Total procedures mappings created: ${totalInserted}`);

      await client.query("COMMIT");
      return res.json({
        message: "New procedures mapping records created successfully",
        count: totalInserted,
        details: {
          procedures_entries: rows.length,
          eafya_procedures: mappings.length,
          total_mappings_created: totalInserted,
          calculation: `${mappings.length} eAFYA procedures = ${totalInserted} new records`,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving procedures mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific procedures mapping
router.delete("/", async (req, res) => {
  try {
    const { eafya_id } = req.body;

    if (!eafya_id) {
      return res.status(400).json({
        message: "Missing required fields: eafya_id",
      });
    }

    console.log("Deleting procedures mapping with:", {
      eafya_id,
    });

    const result = await pool.query(
      "DELETE FROM reporting.dhis2_dataelements_108_procedures WHERE eafya_id = $1",
      [eafya_id]
    );

    console.log("Delete result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Procedures mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting procedures mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
