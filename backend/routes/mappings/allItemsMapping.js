import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get all sections from dimension table
router.get("/sections", async (req, res) => {
  try {
    const query = `
            SELECT DISTINCT 
                hmis_section_id as id,
                hmis_section as name
            FROM reporting.dhis2_mapping_details
            WHERE hmis_section_id IS NOT NULL 
            AND hmis_section_id != '' 
            AND hmis_section IS NOT NULL 
            AND hmis_section != ''
            AND hmis_section_id in ('1.3.1','1.3.3','1.3.4','1.3.5','1.3.7','1.3.8','1.3.9','1.3.10','1.3.11','1.3.17','1.3.18','1.3.21')
         ORDER BY hmis_section_id
     
        `;
    const { rows } = await pool.query(query);
    console.log(
      `Found ${rows.length} sections:`,
      rows.map((r) => `${r.id}: ${r.name}`)
    );
    res.json(rows);
  } catch (error) {
    console.error("Database error in /sections:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/labTest/sections", async (req, res) => {
  try {
    const query = `
            SELECT DISTINCT
                hmis_section_id as id,
                hmis_section as name
            FROM reporting.dhis2_mapping_details
            WHERE hmis_section_id IS NOT NULL 
            AND hmis_section_id != '' 
            AND hmis_section IS NOT NULL 
            AND hmis_section != ''
            AND hmis_section_id ilike '10.%'
         
     
        `;
    const { rows } = await pool.query(query);
    console.log(
      `Found ${rows.length} sections:`,
      rows.map((r) => `${r.id}: ${r.name}`)
    );
    res.json(rows);
  } catch (error) {
    console.error("Database error in /sections:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/commodity/sections", async (req, res) => {
  try {
    const query = `
            SELECT DISTINCT 
                hmis_section_id as id,
                hmis_section as name
            FROM reporting.dhis2_mapping_details
            WHERE hmis_section_id IS NOT NULL 
            AND hmis_section_id != '' 
            AND hmis_section IS NOT NULL 
            AND hmis_section != ''
            AND hmis_section_id = '6.0'
     
        `;
    const { rows } = await pool.query(query);
    console.log(
      `Found ${rows.length} sections:`,
      rows.map((r) => `${r.id}: ${r.name}`)
    );
    res.json(rows);
  } catch (error) {
    console.error("Database error in /sections:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get conditions/items for a specific section
router.get("/sections/:sectionId/conditions", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const query = `
            SELECT 
                hmis_id as id,
                hmis_section_id as section_id, 
                hmis_section as section_name,
                hmis_code, 
                hmis_name
            FROM reporting.dhis2_mapping_details
            WHERE hmis_section_id = $1
            ORDER BY hmis_code
        `;
    const { rows } = await pool.query(query, [sectionId]);
    console.log(`Found ${rows.length} conditions for section ${sectionId}`);
    res.json(rows);
  } catch (error) {
    console.error("Database error in /sections/:sectionId/conditions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get mappings for a specific condition (dim table record)
router.get("/conditions/:conditionId/mappings", async (req, res) => {
  try {
    const { conditionId } = req.params;

    const query = `
            SELECT 
                m.id,
                m.dim_id,
                m.eafya_id,
                m.eafya_name,
                d.hmis_section_id as section_id,
                d.hmis_section as section_name,
                d.hmis_code,
                d.hmis_name,
                m.created_at,
                m.updated_at
            FROM reporting.eafya_hmis_mappings m
            JOIN reporting.dhis2_mapping_details d ON m.dim_id = d.hmis_id
            WHERE m.dim_id = $1
            ORDER BY m.eafya_name
        `;
    const { rows } = await pool.query(query, [conditionId]);
    res.json(rows);
  } catch (error) {
    console.error(
      "Database error in /conditions/:conditionId/mappings:",
      error
    );
    res.status(500).json({ error: error.message });
  }
});

// Add a new mapping between a condition and an EAFYA item
router.post("/conditions/:conditionId/mappings", async (req, res) => {
  try {
    const { conditionId } = req.params;
    const { eafya_id, eafya_name } = req.body;

    console.log("Creating mapping:", { conditionId, eafya_id, eafya_name });

    if (!eafya_id || !eafya_name) {
      console.log("Missing required fields:", { eafya_id, eafya_name });
      return res
        .status(400)
        .json({ error: "eafya_id and eafya_name are required" });
    }

    // Verify the condition exists in dim table
    const dimQuery = `
            SELECT hmis_id, hmis_section, hmis_name 
            FROM reporting.dhis2_mapping_details 
            WHERE hmis_id = $1
        `;
    const { rows: dimRows } = await pool.query(dimQuery, [conditionId]);

    if (dimRows.length === 0) {
      console.log("Condition not found:", conditionId);
      return res
        .status(404)
        .json({ error: "Condition not found in dimension table" });
    }

    console.log("Found condition:", dimRows[0]);

    // Check if mapping already exists
    const duplicateQuery = `
            SELECT COUNT(*) as count
            FROM reporting.eafya_hmis_mappings
            WHERE dim_id = $1 AND eafya_id = $2
        `;
    const { rows: duplicateCheck } = await pool.query(duplicateQuery, [
      conditionId,
      eafya_id,
    ]);

    if (parseInt(duplicateCheck[0].count) > 0) {
      console.log("Duplicate mapping found");
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }

    // Import the model
    const EafyaHmisMapping = (await import("../../models/eafyaHmisMapping.js"))
      .default;

    // Insert new mapping using Sequelize model
    const newMapping = await EafyaHmisMapping.create({
      dim_id: conditionId,
      eafya_id: eafya_id,
      eafya_name: eafya_name,
    });
    console.log("Mapping created successfully:", newMapping);

    res.status(201).json({
      id: newMapping.id,
      dim_id: newMapping.dim_id,
      eafya_id: newMapping.eafya_id,
      eafya_name: newMapping.eafya_name,
      section_name: dimRows[0].hmis_section,
      condition_name: dimRows[0].hmis_name,
      created_at: newMapping.created_at,
    });
  } catch (error) {
    console.error("Database error creating mapping:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack,
    });

    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }

    res.status(500).json({
      error: error.message,
      details: error.detail || "No additional details available",
    });
  }
});

// Update an existing mapping
router.put("/mappings/:mappingId", async (req, res) => {
  try {
    const { mappingId } = req.params;
    const { eafya_id, eafya_name } = req.body;

    const query = `
            UPDATE reporting.eafya_hmis_mappings
            SET 
                eafya_id = COALESCE($2, eafya_id),
                eafya_name = COALESCE($3, eafya_name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
    const { rows } = await pool.query(query, [mappingId, eafya_id, eafya_name]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    const mapping = rows[0];
    res.json({
      id: mapping.id,
      dim_id: mapping.dim_id,
      eafya_id: mapping.eafya_id,
      eafya_name: mapping.eafya_name,
      updated_at: mapping.updated_at,
    });
  } catch (error) {
    console.error("Database error:", error);
    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: "Mapping already exists for this condition and EAFYA item",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a mapping
router.delete("/mappings/:mappingId", async (req, res) => {
  try {
    const { mappingId } = req.params;

    const query = `
            DELETE FROM reporting.eafya_hmis_mappings
            WHERE id = $1
            RETURNING id, dim_id, eafya_id, eafya_name
        `;

    const { rows } = await pool.query(query, [mappingId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    res.json({
      message: "Mapping deleted successfully",
      deleted_mapping: rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all EAFYA items for search/mapping
router.get("/eafya-items", async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
            SELECT * FROM (
                SELECT id, name FROM dwh.dim_eafya_disease
                UNION
                SELECT id, name FROM dwh.dim_eafya_clinic  
                UNION
                SELECT id, name FROM dwh.dim_eafya_department
            ) combined
        `;

    const params = [];
    if (search && search.trim()) {
      query += ` WHERE LOWER(name) LIKE LOWER($1)`;
      params.push(`%${search.trim()}%`);
    }

    query += ` ORDER BY name LIMIT 100`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all conditions from dimension table (for overview/debugging)
router.get("/conditions", async (req, res) => {
  try {
    const query = `
            SELECT 
                d.hmis_id as id,
                d.hmis_section_id as section_id, 
                d.hmis_section as section_name,
                d.hmis_code, 
                d.hmis_name,
                COUNT(m.id) as mapping_count
            FROM reporting.dhis2_mapping_details d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.hmis_id = m.dim_id
            GROUP BY d.hmis_id, d.hmis_section_id, d.hmis_section, d.hmis_code, d.hmis_name
            ORDER BY d.hmis_section_id, d.hmis_code
        `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get mapping statistics
router.get("/stats", async (req, res) => {
  try {
    const query = `
            SELECT 
                COUNT(DISTINCT d.hmis_id) as total_conditions,
                COUNT(DISTINCT m.dim_id) as mapped_conditions,
                COUNT(m.id) as total_mappings,
                COUNT(DISTINCT d.hmis_section_id) as total_sections
            FROM reporting.dhis2_mapping_details d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.hmis_id = m.dim_id
        `;
    const { rows } = await pool.query(query);
    res.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
