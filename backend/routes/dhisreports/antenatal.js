import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/visits", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month, 
        visit_count, 
        hmis_code, 
        "Below_15yrs", 
        "15_19yrs", 
        "20_24yrs", 
        "25_50yrs", 
        "50+yrs", total
      FROM reporting."105_02_anc_visits"
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

router.get("/totals", async (req, res) => {
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

router.get("/fansidar", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month,
        hmis_code,
        ipt_dose,
        below_15,
        age_15_19,
        age_20_24,
        age_25_49,
        age_50_plus
      FROM reporting."105_02_anc_fansidar"
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

router.get("/bloodgroup", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month,
        hmis_code,
        result,
        count
      FROM reporting."105_02_anc_bloodgroup"
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

router.get("/anaemia_tested", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
        SELECT 
          report_month, 
          hmis_code, 
          below_15_years, 
          "15-19_years", 
          "20-24_years", 
          "25-49_years", 
          "50+_years", 
          total_tests
        FROM reporting."105_02_anc_anaemia_tested"
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

router.get("/anaemia_confirmed", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
        SELECT 
        report_month, 
        hmis_code, 
        below_15_years, 
        "15-19_years", 
        "20-24_years", 
        "25-49_years", 
        "50+_years", 
        total_cases
      FROM reporting."105_02_anc_anaemia_confirmed"
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

router.get("/folic", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month, 
        hmis_code, 
        below_15_years, 
        "15-19_years", 
        "20-24_years", 
        "25-49_years", 
        "50+_years", total
      FROM reporting."105_02_anc_folic"
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

router.get("/ultrasound", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month, 
        hmis_code, 
        below_15_years, 
        "15-19_years", 
        "20-24_years", 
        "25-49_years", 
        "50+_years", 
        total
      FROM reporting."105_02_anc_ultrasound"
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

router.get("/syphilis", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month, 
        hmis_code, 
        gender, 
        total_tested, 
        total_positive
      FROM reporting."105_02_anc_syphilis"
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

router.get("/hepatitis", async (req, res) => {
	try {
		const { report_month } = req.query;

		let query = `
      SELECT 
        report_month, 
        hmis_code, 
        total_tested, 
        total_positive
      FROM reporting."105_02_anc_hepatitis"
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
