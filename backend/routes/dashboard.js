
import express from "express";
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
  
      const query = `
        SELECT 
          EXTRACT(MONTH FROM admission_date)::INT AS month,
          COUNT(*) AS total
        FROM reporting.patient_admissions
        WHERE is_admission_approved = true
          AND EXTRACT(YEAR FROM admission_date) = $1
        GROUP BY month
        ORDER BY month ASC
      `;
  
      const { rows } = await pool.query(query, [currentYear]);
  
      // Fill result with 12 months defaulting to 0
      const result = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        total: 0
      }));
  
      // Populate data from query results
      rows.forEach(({ month, total }) => {
        result[month - 1].total = parseInt(total);
      });
  
      res.json(result);
    } catch (error) {
      console.error('Error fetching monthly admissions:', error);
      res.status(500).json({ message: error.message });
    }
  });


  export default router;