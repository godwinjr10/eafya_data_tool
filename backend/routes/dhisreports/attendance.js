import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

// Get attendance data with month filtering
router.get('/', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                a."0-28d Male" AS "0-28d_male",
                a."0-28d Female" AS "0-28d_female",
                a."29d-4y Male" AS "29d-4y_male",
                a."29d-4y Female" AS "29d-4y_female",
                a."5-9y Male" AS "5-9y_male",
                a."5-9y Female" AS "5-9y_female",
                a."10-19y Male" AS "10-19y_male",
                a."10-19y Female" AS "10-19y_female",
                a."20y+ Male" AS "20y+_male",
                a."20y+ Female" AS "20y+_female"
            FROM reporting."105_01_attendance" a
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` WHERE a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/reattendance', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                a."0-28d Male" AS "0-28d_male",
                a."0-28d Female" AS "0-28d_female",
                a."29d-4y Male" AS "29d-4y_male",
                a."29d-4y Female" AS "29d-4y_female",
                a."5-9y Male" AS "5-9y_male",
                a."5-9y Female" AS "5-9y_female",
                a."10-19y Male" AS "10-19y_male",
                a."10-19y Female" AS "10-19y_female",
                a."20y+ Male" AS "20y+_male",
                a."20y+ Female" AS "20y+_female"
            FROM reporting."105_01_reattendance" a
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` WHERE a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/referrals', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                a."0-28d Male" AS "0-28d_male",
                a."0-28d Female" AS "0-28d_female",
                a."29d-4y Male" AS "29d-4y_male",
                a."29d-4y Female" AS "29d-4y_female",
                a."5-9y Male" AS "5-9y_male",
                a."5-9y Female" AS "5-9y_female",
                a."10-19y Male" AS "10-19y_male",
                a."10-19y Female" AS "10-19y_female",
                a."20y+ Male" AS "20y+_male",
                a."20y+ Female" AS "20y+_female"
            FROM reporting."105_01_reattendance" a
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` WHERE a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;