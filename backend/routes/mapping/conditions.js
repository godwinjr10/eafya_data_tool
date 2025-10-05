import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get conditions mappings
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 500);
    const offset = (page - 1) * limit;
    const sectionName = (req.query.sectionName || "").trim();

    const whereSql = sectionName ? `WHERE section_name = $1` : "";
    const countQuery = `SELECT COUNT(*)::int AS total FROM reporting.dataelements_conditions ${whereSql}`;
    const dataQuery = `
      SELECT 
        section_id, 
        section_name, 
        hmis_code, 
        hmis_name
      FROM reporting.dataelements_conditions
      ${whereSql}
      ORDER BY section_id, hmis_name
      LIMIT $${sectionName ? 2 : 1} OFFSET $${sectionName ? 3 : 2}
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, sectionName ? [sectionName] : []),
      pool.query(dataQuery, sectionName ? [sectionName, limit, offset] : [limit, offset])
    ]);

    const total = countResult.rows[0]?.total || 0;
    const rows = dataResult.rows;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({ data: rows, page, limit, total, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Distinct section names for dropdown
router.get("/sections", async (_req, res) => {
  try {
    const sql = `
      SELECT DISTINCT section_name
      FROM reporting.dataelements_conditions
      ORDER BY section_name
    `;
    const { rows } = await pool.query(sql);
    res.json(rows.map(r => r.section_name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get disease items for mapping
router.get("/items", async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = (req.query.search || "").trim();

    let whereClause = "";
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause = `WHERE "name" ILIKE $${paramCount} OR five_character_icd_code ILIKE $${paramCount} OR four_character_icd_code ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    const query = `
            SELECT 
              id as disease_id,
              "name" as disease_name,
              five_character_icd_code,
              four_character_icd_code,
              disease_block_id
            FROM dwh.dim_eafya_disease
            ${whereClause}
            ORDER BY "name"
            LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
        `;

    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a single condition mapping by id
router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    const sql = `DELETE FROM reporting.hmis_eafya_conditions_mapping WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    return res.json({ message: "Condition mapping deleted", count: result.rowCount });
  } catch (error) {
    console.error("Error deleting condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a single condition mapping by id via URL param
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM reporting.hmis_eafya_conditions_mapping WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    return res.json({ message: "Condition mapping deleted", count: result.rowCount });
  } catch (error) {
    console.error("Error deleting condition mapping by id:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get condition mapping details by HMIS code
router.get("/:hmisCode", async (req, res) => {
  try {
    const { hmisCode } = req.params;
    const query = `
      SELECT 
        id,
        hmis_code, 
        hmis_name, 
        disease_id, 
        five_character_icd_code, 
        four_character_icd_code, 
        disease_name
      FROM reporting.hmis_eafya_conditions_mapping
      WHERE hmis_code = $1
    `;

    const { rows } = await pool.query(query, [hmisCode]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching condition mapping details:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create condition mapping entries
router.post("/", async (req, res) => {
  try {
    const { hmis_code, hmis_name, diseases } = req.body;
    
    // Validate required fields
    if (!hmis_code || !diseases || !Array.isArray(diseases)) {
      return res.status(400).json({ 
        message: "Missing required fields: hmis_code and diseases array" 
      });
    }
    
    // Get section_id from the HMIS code (assuming it's the first part)
    const section_id = hmis_code.substring(0, 2); // Extract first 2 characters as section_id
    
    const columns = `section_id, hmis_code, hmis_name, disease_id, five_character_icd_code, four_character_icd_code, disease_name`;
    const valuesPlaceholders = [];
    const params = [];

    for (let i = 0; i < diseases.length; i++) {
      const base = i * 7;
      valuesPlaceholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
      );
      const disease = diseases[i];
      params.push(
        section_id,
        hmis_code,
        hmis_name || '',
        disease.disease_id,
        disease.five_character_icd_code,
        disease.four_character_icd_code,
        disease.disease_name
      );
    }

    const insertQuery = `
      INSERT INTO reporting.hmis_eafya_conditions_mapping (${columns})
      VALUES ${valuesPlaceholders.join(", ")}
      RETURNING *
    `;

    const { rows } = await pool.query(insertQuery, params);

    return res.status(201).json({
      message: "Condition mapping(s) created",
      count: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error creating condition mapping:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
