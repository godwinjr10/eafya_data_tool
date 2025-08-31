import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for tetanus vaccination data
router.get("/tetanus-vaccination", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        vaccine_id,
        vaccine_name,
        pregnant,
        non_pregnant
      FROM reporting."105_02_tetanus_vaccination"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY vaccine_name`;

    const { rows } = await pool.query(query, params);
    console.log("Tetanus Vaccination Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Tetanus Vaccination Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
