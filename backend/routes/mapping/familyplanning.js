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
    const countQuery = `SELECT COUNT(*)::int AS total FROM reporting.dataelements_familyplanning ${whereSql}`;
    const dataQuery = `
        SELECT 
          section_code, 
          section_name, 
          hmis_code, 
          dataelement_name as hmis_name
        FROM reporting.dataelements_familyplanning
      ${whereSql}
      ORDER BY section_code, hmis_code
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
      FROM reporting.dataelements_familyplanning
      ORDER BY section_name
    `;
    const { rows } = await pool.query(sql);
    res.json(rows.map(r => r.section_name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get familyplanning items for mapping
router.get("/items", async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = (req.query.search || "").trim();

    let whereClause = "";
    let params = [];
    let paramCount = 0;

    const query = `
            SELECT 
            p.id,
            p."name"
            FROM dwh.dim_eafya_family_planning p
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
    const sql = `DELETE FROM reporting.hmis_eafya_familyplanning_mapping WHERE id = $1`;
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
    const sql = `DELETE FROM reporting.hmis_eafya_familyplanning_mapping WHERE id = $1`;
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
        familyplanning_id, 
        familyplanning_name
      FROM reporting.hmis_eafya_familyplanning_mapping
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
    const { hmis_code, hmis_name, familyplanning } = req.body;
    
    
    // Get section_id from the HMIS code (assuming it's the first part)
    const section_id = hmis_code.substring(0, 2); // Extract first 2 characters as section_id
    
    const columns = `section_id, hmis_code, hmis_name, familyplanning_id, familyplanning_name`;
    const valuesPlaceholders = [];
    const params = [];

    if (!Array.isArray(familyplanning) || familyplanning.length === 0) {
      return res.status(400).json({ message: 'familyplanning must be a non-empty array' });
    }

    for (let i = 0; i < familyplanning.length; i++) {
      // there are 5 columns per row, so placeholders must advance by 5 each iteration
      const base = i * 5;
      valuesPlaceholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`
      );
      const fp = familyplanning[i];
      params.push(
        section_id,
        hmis_code,
        hmis_name || '',
        fp.familyplanning_id,
        fp.familyplanning_name
      );
    }

    const insertQuery = `
      INSERT INTO reporting.hmis_eafya_familyplanning_mapping (${columns})
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