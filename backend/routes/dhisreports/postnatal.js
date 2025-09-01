import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for postnatal attendance data
router.get("/attendance", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        timing,
        report_month,
        total_patients,
        below_15yrs,
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50+yrs"
      FROM reporting.postnatal_attendance
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY timing`;

    const { rows } = await pool.query(query, params);
    console.log("Postnatal Attendance Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Postnatal Attendance Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for postnatal community referrals data
router.get("/community_referrals", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        month,
        below_15yrs,
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50yrs+",
        total_patients
      FROM reporting.postnatal_community_referal
      WHERE month = $1`;

    const params = [report_month];

    const { rows } = await pool.query(query, params);
    console.log("Postnatal Community Referrals Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Postnatal Community Referrals Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for postnatal TB screening data
router.get("/tb_screening", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        status,
        below_15yrs,
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50plus"
      FROM reporting.postnatal_tb
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY status`;

    const { rows } = await pool.query(query, params);
    console.log("Postnatal TB Screening Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Postnatal TB Screening Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
