import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for child immunization data
router.get("/child-immunization", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        vaccine_id,
        vaccine_name,
        "Under1y",
        "1-4y",
        "5-14y"
      FROM reporting."105_02_child_immunization"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY vaccine_name`;

    const { rows } = await pool.query(query, params);
    console.log("Child Immunization Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Child Immunization Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
