import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get all mapping rows (default)
router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT 
            dataset_code, 
            section_id, id, 
            dataelement_id, 
            dataelement_code, 
            dataelement_name
        FROM reporting.dhis2_datasets_elements
        where section_id is not null
        order by dataelement_code;
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get distinct dataset codes for mapping
router.get("/datasets/codes", async (req, res) => {
  try {
    const query = `
            SELECT DISTINCT dataset_code 
            FROM reporting.dhis2_datasets_elements 
            WHERE dataset_code IS NOT NULL 
            ORDER BY dataset_code
        `;

    const { rows } = await pool.query(query);
    res.json(rows.map((row) => row.dataset_code));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dataset elements by dataset code
router.get("/datasets/:datasetCode/elements", async (req, res) => {
  try {
    const { datasetCode } = req.params;

    const query = `
            SELECT 
                dataset_code,
                section_id,
                id,
                dataelement_id,
                dataelement_code,
                dataelement_name
            FROM reporting.dhis2_datasets_elements
            WHERE dataset_code = $1
            ORDER BY dataelement_code
        `;

    const { rows } = await pool.query(query, [datasetCode]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all active diseases
router.get("/diseases", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
                "name", 
                five_character_icd_code as icd_code, 
                is_active 
            FROM dwh.dim_eafya_disease
            WHERE is_active = true
            ORDER BY "name"
        `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all commodities (drugs)
router.get("/commodities", async (req, res) => {
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

// Get all lab tests
router.get("/labtests", async (req, res) => {
  try {
    const query = `
            SELECT 
                id, 
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

// Get all vaccines
router.get("/vaccines", async (req, res) => {
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

// Get existing mappings for a specific data element
router.get("/mappings/:dataelementCode", async (req, res) => {
  try {
    const { dataelementCode } = req.params;

    const query = `
            SELECT 
                em.id,
                em.hmis_dataelement_code,
                em.hmis_dataelement_name,
                em.dataelement_id,
                em.eafya_item_id,
                em.eafya_item_name,
                em.created_at,
                em.updated_at
            FROM reporting.eafya_mappings em
            WHERE em.hmis_dataelement_code = $1
            ORDER BY em.created_at DESC
        `;

    const { rows } = await pool.query(query, [dataelementCode]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save new mappings for a data element
router.post("/mappings", async (req, res) => {
  try {
    const {
      hmis_dataelement_code,
      hmis_dataelement_name,
      dataelement_id,
      dataset_code,
      section_id,
      mappings,
    } = req.body;

    if (
      !hmis_dataelement_code ||
      !mappings ||
      !Array.isArray(mappings) ||
      !dataelement_id
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: hmis_dataelement_code, dataelement_id, and mappings array",
      });
    }

    // Start a transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete existing mappings for this data element
      await client.query(
        "DELETE FROM reporting.eafya_mappings WHERE hmis_dataelement_code = $1",
        [hmis_dataelement_code]
      );

      // Insert new mappings
      for (const mapping of mappings) {
        await client.query(
          `INSERT INTO reporting.eafya_mappings (
                        hmis_dataelement_code,
                        hmis_dataelement_name,
                        dataelement_id,
                        dataset_code,
                        section_id,
                        eafya_item_id,
                        eafya_item_name,
                        created_at,
                        updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [
            hmis_dataelement_code,
            hmis_dataelement_name,
            dataelement_id,
            dataset_code,
            section_id,
            mapping.id,
            mapping.name,
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        message: "Mappings saved successfully",
        count: mappings.length,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific mapping
router.delete("/mappings/:dataelementCode/:eafyaItemId", async (req, res) => {
  try {
    const { dataelementCode, eafyaItemId } = req.params;

    const query = `
            DELETE FROM reporting.eafya_mappings 
            WHERE hmis_dataelement_code = $1 AND eafya_item_id = $2
        `;

    const result = await pool.query(query, [dataelementCode, eafyaItemId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    res.json({ message: "Mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all mappings for a dataset
router.get("/dataset/:datasetCode/mappings", async (req, res) => {
  try {
    const { datasetCode } = req.params;

    const query = `
            SELECT 
                em.hmis_dataelement_code,
                em.hmis_dataelement_name,
                em.dataelement_id,
                em.dataset_code,
                em.section_id,
                em.eafya_item_id,
                em.eafya_item_name,
                em.created_at,
                em.updated_at
            FROM reporting.eafya_mappings em
            WHERE em.dataset_code = $1
            ORDER BY em.hmis_dataelement_code, em.created_at DESC
        `;

    const { rows } = await pool.query(query, [datasetCode]);

    // Group by data element code
    const groupedMappings = {};
    rows.forEach((row) => {
      if (!groupedMappings[row.hmis_dataelement_code]) {
        groupedMappings[row.hmis_dataelement_code] = [];
      }
      groupedMappings[row.hmis_dataelement_code].push({
        id: row.eafya_item_id,
        name: row.eafya_item_name,
        dataelement_id: row.dataelement_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
      });
    });

    res.json(groupedMappings);
  } catch (error) {
    console.error("Error fetching dataset mappings:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
