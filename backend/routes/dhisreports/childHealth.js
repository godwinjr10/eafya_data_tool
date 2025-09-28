import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for child health data
router.get("/child-health", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        vaccine_id,
        vaccine_name,
        "0-5m Male",
        "0-5m Female",
        "6-11m Male",
        "6-11m Female",
        "12-59m Male",
        "12-59m Female",
        "5-14y Male",
        "5-14y Female"
      FROM reporting."105_02_child_health"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY vaccine_id`;

    const { rows } = await pool.query(query, params);
    console.log("Child Health Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Child Health Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
