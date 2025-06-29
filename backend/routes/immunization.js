import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

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
                a.vaccine_id, 
                a.vaccine_name, 
                a."Under1y", 
                a."1-4y", 
                a."5-14y"
            FROM reporting."105_02_child_immunization" a
            INNER JOIN (
                SELECT DISTINCT 
                    section_id, 
                    section_name, 
                    hmis_code, 
                    hmis_name,
                    eafya_vaccine_id
                FROM reporting.dhis_eafya_mapping_vaccines 
                WHERE section_id = '2.6.3'
            ) m ON m.eafya_vaccine_id = a.vaccine_id
            WHERE a.report_month = $1
            ORDER BY a.report_month DESC;
        `;

        const params = [report_month];
        
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/child', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                report_month, 
                vaccine_id, 
                vaccine_name, 
                "0-5m Male", 
                "0-5m Female", 
                "6-11m Male", 
                "6-11m Female", 
                "12-59m Male", 
                "12-59m Female", 
                "5-14y Male", 
                "5-14y Female"
            FROM reporting."105_02_child_health"
            WHERE report_month = $1
            ORDER BY report_month DESC;
        `;

        const params = [report_month];
        
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;