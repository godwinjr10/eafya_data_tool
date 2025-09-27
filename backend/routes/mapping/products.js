import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Get products for mapping
router.get("/", async (req, res) => {
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

export default router;
