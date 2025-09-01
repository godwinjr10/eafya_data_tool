import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/anc_1", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        "Below_15yrs",
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50+yrs"
      FROM reporting."105_02_anc_1"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/anc_4", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        "Below_15yrs",
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50+yrs"
      FROM reporting."105_02_anc_4"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/anc_8", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        "Below_15yrs",
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50+yrs"
      FROM reporting."105_02_anc_8"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/anc_total", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        "Below_15yrs",
        "15_19yrs",
        "20_24yrs",
        "25_50yrs",
        "50+yrs"
      FROM reporting."105_02_anc_total"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/antenatal_6", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        ipt_dose_group,
        below_15,
        age_15_19,
        age_20_24,
        age_25_49,
        age_50_plus
      FROM reporting."105_02_antenantal_6"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/antenatal_8", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        "Below 15 Years",
        "15 - 19 Years",
        "20 - 24 Years",
        "25 - 49 Years",
        "50+ Years",
        "Total"
      FROM reporting."105_02_antenantal_8"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/antenatal_9", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
        SELECT 
        report_month,
        hmis_code,
        "Below 15 Years",
        "15 - 19 Years",
        "20 - 24 Years",
        "25 - 49 Years",
        "50+ Years",
        "Total"
      FROM reporting."105_02_antenantal_9"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/antenatal_10", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT 
        report_month,
        hmis_code,
        supplement_category,
        below_15,
        age_15_19,
        age_20_24,
        age_25_49,
        age_50_plus
      FROM reporting."105_02_antenatal_10"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY hmis_code`;

    const { rows } = await pool.query(query, params);
    console.log("Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
