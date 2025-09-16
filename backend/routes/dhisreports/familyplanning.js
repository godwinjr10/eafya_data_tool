import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for family planning contraceptives data
router.get("/contraceptives", async (req, res) => {
  try {
    const { report_month } = req.query;

    // Check if the table exists first
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = '105_family_planning_contraceptives'
      );
    `;

    const tableExists = await pool.query(tableCheckQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Table reporting.105_family_planning_contraceptives does not exist, returning empty data");
      return res.json([]);
    }

    let query = `
      SELECT 
        report_month,
        family_planning_name,
        hmis_code,
        total_dispensed
      FROM reporting."105_family_planning_contraceptives"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY family_planning_name`;

    const { rows } = await pool.query(query, params);
    console.log("Family Planning Contraceptives Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Contraceptives Query error:", error);
    
    // If it's a table doesn't exist error, return empty array instead of 500
    if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
      console.log("Table does not exist, returning empty data");
      return res.json([]);
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Route for family planning theatre data
router.get("/theatre", async (req, res) => {
  try {
    const { report_month } = req.query;

    // Check if the table exists first
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = '105_family_planning_theatre'
      );
    `;

    const tableExists = await pool.query(tableCheckQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Table reporting.105_family_planning_theatre does not exist, returning empty data");
      return res.json([]);
    }

    let query = `
      SELECT 
        report_month,
        major_theatre_name,
        "25_49_female_tubal",
        "50plus_female_tubal",
        "25_49_male_vasectomy",
        "50plus_male_vasectomy"
      FROM reporting."105_family_planning_theatre"
      WHERE report_month = $1`;

    const params = [report_month];

    query += ` ORDER BY major_theatre_name`;

    const { rows } = await pool.query(query, params);
    console.log("Family Planning Theatre Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Theatre Query error:", error);
    
    // If it's a table doesn't exist error, return empty array instead of 500
    if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
      console.log("Table does not exist, returning empty data");
      return res.json([]);
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Route for family planning visits data
router.get("/visits", async (req, res) => {
  try {
    const { report_month } = req.query;

    // Check if the table exists first
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = '105_family_planning_visits'
      );
    `;

    const tableExists = await pool.query(tableCheckQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Table reporting.105_family_planning_visits does not exist, returning empty data");
      return res.json([]);
    }

    let query = `
      SELECT 
        report_month,
        family_planning_name,
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

    query += ` ORDER BY family_planning_name`;

    const { rows } = await pool.query(query, params);
    console.log("Family Planning Visits Query Results:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Family Planning Visits Query error:", error);
    
    // If it's a table doesn't exist error, return empty array instead of 500
    if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
      console.log("Table does not exist, returning empty data");
      return res.json([]);
    }
    
    res.status(500).json({ message: error.message });
  }
});

export default router;
