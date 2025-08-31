import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Census Information Route
router.get("/census-information", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT "Report Month", "Wards", "A Cl01. No. of beds", 
             "B Cl02. No. of admissions", "C Cl03. No. of deaths", 
             "D Cl04. Patient days", "E Cl05. Average length of stay (E=D/B)", 
             "F Cl06. Average occupancy (F=D/30 days)", 
             "G Cl07. Bed occupancy (F/A)x100"
      FROM reporting."108_01_census_information"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE "Report Month" = $1`;
      params.push(report_month);
    }

    query += ` ORDER BY "Wards"`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching census information:", error);
    res.status(500).json({ error: "Failed to fetch census information" });
  }
});

// Admission Deaths Route
router.get("/admission-deaths", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT report_month, diagnosis, disease_id, 
             "0-4years Male Cases", "0-4years female Cases", 
             "5years+ Male Cases", "5years+ female Cases", 
             "0-4years Male Deaths", "0-4years female Deaths", 
             "5years+ Male Deaths", "5years+ female Deaths"
      FROM reporting."108_admission_death"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE report_month = $1`;
      params.push(report_month);
    }

    query += ` ORDER BY diagnosis`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching admission deaths:", error);
    res.status(500).json({ error: "Failed to fetch admission deaths" });
  }
});

// Maternal Conditions Route
router.get("/maternal-conditions", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT report_month, disease_id, 
             "Cases Below 15 Years", "Cases 15-19 Years", 
             "Cases 20-24 Years", "Cases 25-49 Years", "Cases 50+ Years", 
             "Deaths Below 15 Years", "Deaths 15-19 Years", 
             "Deaths 20-24 Years", "Deaths 25-49 Years", "Deaths 50+ Years"
      FROM reporting."108_maternal_conditions"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE report_month = $1`;
      params.push(report_month);
    }

    query += ` ORDER BY disease_id`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching maternal conditions:", error);
    res.status(500).json({ error: "Failed to fetch maternal conditions" });
  }
});

// Mental Health Route
router.get("/mental-health", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT report_month, diagnosis, disease_id, 
             "<5Y Male", "<5Y Female", "5-9Y Male", "5-9Y Female", 
             "10-19Y Male", "10-19Y Female", "20-34Y Male", "20-34Y Female", 
             "35-59Y Male", "35-59Y Female", "60+Y Male", "60+Y Female"
      FROM reporting."108_mental_health"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE report_month = $1`;
      params.push(report_month);
    }

    query += ` ORDER BY diagnosis`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching mental health data:", error);
    res.status(500).json({ error: "Failed to fetch mental health data" });
  }
});

// Neonatal Services Route
router.get("/neonatal-services", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT report_month, 
             "Cases 0-7 days Total", "Cases 0-7 days <2.5kg", 
             "Cases 8-28 days Total", "Cases 8-28 days <2.5kg", 
             "Deaths 0-7 days Total", "Deaths 0-7 days <2.5kg", 
             "Deaths 8-28 days Total", "Deaths 8-28 days <2.5kg"
      FROM reporting."108_neonatal_services"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE report_month = $1`;
      params.push(report_month);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching neonatal services:", error);
    res.status(500).json({ error: "Failed to fetch neonatal services" });
  }
});

// Patient Imaging Route
router.get("/patient-imaging", async (req, res) => {
  try {
    let query = `
      SELECT category_name, imaging_name, male_0_4, female_0_4, male_5_plus, female_5_plus
      FROM reporting."108_patient_imaging"
      ORDER BY category_name, imaging_name
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching patient imaging:", error);
    res.status(500).json({ error: "Failed to fetch patient imaging" });
  }
});

// Surgical Procedures Route
router.get("/surgical-procedures", async (req, res) => {
  try {
    const { report_month } = req.query;

    let query = `
      SELECT "section", code, "procedure", "year", "month", procedure_count
      FROM reporting."108_surgical_procedures"
    `;

    const params = [];
    if (report_month) {
      query += ` WHERE "year" = $1 AND "month" = $2`;
      const [year, month] = report_month.match(/(\d{4})(\d{2})/).slice(1);
      params.push(year, month);
    }

    query += ` ORDER BY "section", code`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching surgical procedures:", error);
    res.status(500).json({ error: "Failed to fetch surgical procedures" });
  }
});

export default router;
