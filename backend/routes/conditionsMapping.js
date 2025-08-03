import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// Get all sections from dimension table
router.get("/sections", async (req, res) => {
  try {
    const query = `
            SELECT DISTINCT 
                section_id as id,
                section_name as name
            FROM reporting.dim_sections
            WHERE section_id IS NOT NULL 
            AND section_id != '' 
            AND section_name IS NOT NULL 
            AND section_name != ''
            AND section_id in ('1.3.1','1.3.3','1.3.4','1.3.5','1.3.7','1.3.8','1.3.9','1.3.10','1.3.11','1.3.17','1.3.18','1.3.21')
         ORDER BY section_id
     
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
                section_id as id,
                section_name as name
            FROM reporting.dim_sections
            WHERE section_id IS NOT NULL 
            AND section_id != '' 
            AND section_name IS NOT NULL 
            AND section_name != ''
            AND section_id ilike '10.%'
         
     
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
                section_id as id,
                section_name as name
            FROM reporting.dim_sections
            WHERE section_id IS NOT NULL 
            AND section_id != '' 
            AND section_name IS NOT NULL 
            AND section_name != ''
            AND section_id = '6.0'
     
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
                id,
                section_id, 
                section_name,
                section_item_code as hmis_code, 
                section_item_name as hmis_name
            FROM reporting.dim_sections
            WHERE section_id = $1
            ORDER BY section_item_code
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
                d.section_id,
                d.section_name,
                d.section_item_code as hmis_code,
                d.section_item_name as hmis_name,
                m.created_at,
                m.updated_at
            FROM reporting.eafya_hmis_mappings m
            JOIN reporting.dim_sections d ON m.dim_id = d.id
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
            SELECT id, section_name, section_item_name 
            FROM reporting.dim_sections 
            WHERE id = $1
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
    const EafyaHmisMapping = (await import("../models/eafyaHmisMapping.js"))
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
      section_name: dimRows[0].section_name,
      condition_name: dimRows[0].section_item_name,
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
                d.id,
                d.section_id, 
                d.section_name,
                d.section_item_code as hmis_code, 
                d.section_item_name as hmis_name,
                COUNT(m.id) as mapping_count
            FROM reporting.dim_sections d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.id = m.dim_id
            GROUP BY d.id, d.section_id, d.section_name, d.section_item_code, d.section_item_name
            ORDER BY d.section_id, d.section_item_code
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
                COUNT(DISTINCT d.id) as total_conditions,
                COUNT(DISTINCT m.dim_id) as mapped_conditions,
                COUNT(m.id) as total_mappings,
                COUNT(DISTINCT d.section_id) as total_sections
            FROM reporting.dim_sections d
            LEFT JOIN reporting.eafya_hmis_mappings m ON d.id = m.dim_id
        `;
    const { rows } = await pool.query(query);
    res.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
