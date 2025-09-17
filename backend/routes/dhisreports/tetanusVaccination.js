import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

// Route for tetanus vaccination data
router.get("/tetanus-vaccination", async (req, res) => {
  try {
    const { report_month } = req.query;

    // Check if the table exists first
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporting' 
        AND table_name = '105_02_tetanus_vaccination'
      );
    `;

    const tableExists = await pool.query(tableCheckQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Table reporting.105_02_tetanus_vaccination does not exist, returning empty data");
      return res.json([]);
    }

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
    
    // If it's a table doesn't exist error, return empty array instead of 500
    if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
      console.log("Table does not exist, returning empty data");
      return res.json([]);
    }
    
    res.status(500).json({ message: error.message });
  }
});

export default router;
