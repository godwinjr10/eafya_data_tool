import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for family planning contraceptives data
router.get("/contraceptives", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month, 
        category, 
        hmis_code, 
        total_dispensed
      FROM reporting."105_family_planning_contraceptives"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY category`;

    const { rows } = await pool.query(query, params);
    console.log("Family Planning Contraceptives Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Contraceptives Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for family planning theatre data
router.get("/theatre", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month, 
        hmis_code, 
        major_theater_name, 
        "25_49yrs", 
        "50plus_yrs"
      FROM reporting."105_family_planning_theatre"
      WHERE major_theater_name ILIKE ANY (ARRAY['%vasectomy%','%tubal%'])
      and report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY major_theater_name`;

    const { rows } = await pool.query(query, params);
    console.log("Family Planning Theatre Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Theatre Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for family planning visits data
router.get("/visits", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
       SELECT 
        report_month,
        family_planning_method,
        hmis_code,
        under_15_new,
        under_15_revisit,
        "15_19_new",
        "15_19_revisit",
        "20_24_new",
        "20_24_revisit",
        "25_49_new",
        "25_49_revisit",
        "50_plus_new",
        "50_plus_revisit"
      FROM reporting."105_family_planning_visits"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY family_planning_method`;

      const { rows } = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Visits Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
