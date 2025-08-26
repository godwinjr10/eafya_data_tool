import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

// Get antenatal data for different sections
router.get('/', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                a."Below_15yrs", 
                a."15_19yrs", 
                a."20_24yrs", 
                a."25_50yrs", 
                a."50+yrs"
            FROM reporting."105_02_anc_1" a
            JOIN (SELECT DISTINCT section_id, section_name, hmis_code, hmis_name 
            FROM reporting.dhis_eafya_mapping_antenatal WHERE section_id = '2.1' 
            AND hmis_code = 'AN01') m ON 1=1 WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` AND a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC, m.section_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/four', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                a."Below_15yrs", 
                a."15_19yrs", 
                a."20_24yrs", 
                a."25_50yrs", 
                a."50+yrs"
            FROM reporting."105_02_anc_4" a
            JOIN (SELECT DISTINCT section_id, section_name, hmis_code, hmis_name 
            FROM reporting.dhis_eafya_mapping_antenatal WHERE section_id = '2.1' 
            AND hmis_code = 'AN02') m ON 1=1 WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` AND a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC, m.section_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/eight', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                a."Below_15yrs", 
                a."15_19yrs", 
                a."20_24yrs", 
                a."25_50yrs", 
                a."50+yrs"
            FROM reporting."105_02_anc_8" a
            JOIN (SELECT DISTINCT section_id, section_name, hmis_code, hmis_name 
            FROM reporting.dhis_eafya_mapping_antenatal WHERE section_id = '2.1' 
            AND hmis_code = 'AN03') m ON 1=1 WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` AND a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC, m.section_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/total', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                a."Below_15yrs", 
                a."15_19yrs", 
                a."20_24yrs", 
                a."25_50yrs", 
                a."50+yrs"
            FROM reporting."105_02_anc_total" a
            JOIN (SELECT DISTINCT section_id, section_name, hmis_code, hmis_name 
            FROM reporting.dhis_eafya_mapping_antenatal WHERE section_id = '2.1' 
            AND hmis_code = 'AN04') m ON 1=1 WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` AND a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC, m.section_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;