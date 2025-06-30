import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            WITH vaccine_mapping AS (
                SELECT DISTINCT 
                    section_id, 
                    section_name, 
                    hmis_code, 
                    hmis_name,
                    eafya_vaccine_id
                FROM reporting.dhis_eafya_mapping_vaccines 
                WHERE section_id = '2.6.2'
            )
            SELECT 
                a.report_month,
                -- TD1
                COALESCE(SUM(a.pregnant) FILTER (WHERE a.vaccine_id = '23'), 0) AS td1_preg,
                COALESCE(SUM(a.non_pregnant) FILTER (WHERE a.vaccine_id = '40'), 0) AS td1_non_preg,
                -- TD2
                COALESCE(SUM(a.pregnant) FILTER (WHERE a.vaccine_id = '22'), 0) AS td2_preg,
                COALESCE(SUM(a.non_pregnant) FILTER (WHERE a.vaccine_id = '41'), 0) AS td2_non_preg,
                -- TD3
                COALESCE(SUM(a.pregnant) FILTER (WHERE a.vaccine_id = '21'), 0) AS td3_preg,
                COALESCE(SUM(a.non_pregnant) FILTER (WHERE a.vaccine_id = '42'), 0) AS td3_non_preg,
                -- TD4
                COALESCE(SUM(a.pregnant) FILTER (WHERE a.vaccine_id = '20'), 0) AS td4_preg,
                COALESCE(SUM(a.non_pregnant) FILTER (WHERE a.vaccine_id = '43'), 0) AS td4_non_preg,
                -- TD5
                COALESCE(SUM(a.pregnant) FILTER (WHERE a.vaccine_id = '19'), 0) AS td5_preg,
                COALESCE(SUM(a.non_pregnant) FILTER (WHERE a.vaccine_id = '44'), 0) AS td5_non_preg
            FROM reporting."105_02_tetanus_vaccination" a
            JOIN vaccine_mapping m ON m.eafya_vaccine_id = a.vaccine_id
            WHERE 1=1
            ${report_month ? 'AND a.report_month = $1' : ''}
            GROUP BY a.report_month
            ORDER BY a.report_month DESC;
        `;

        const params = report_month ? [report_month] : [];
        
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;