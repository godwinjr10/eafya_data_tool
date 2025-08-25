import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("conditions");
    try {
        const { report_month, section_id } = req.query;

        if (!section_id || !report_month) {
            return res.status(400).json({ message: "section_id and report_month are required" });
        }

        let query = `
        SELECT
            c.report_month,
            e.section_id,
            e.hmis_dataelement_code,
            e.hmis_dataelement_name,
            e.dataelement_id,
            SUM(COALESCE(c."0-28d Male", 0)) AS "0_28d_male",
            SUM(COALESCE(c."0-28d Female", 0)) AS "0_28d_female",
            SUM(COALESCE(c."29d-4y Male", 0)) AS "29d_4y_male",
            SUM(COALESCE(c."29d-4y Female", 0)) AS "29d_4y_female",
            SUM(COALESCE(c."5-9y Male", 0)) AS "5_9y_male",
            SUM(COALESCE(c."5-9y Female", 0)) AS "5_9y_female",
            SUM(COALESCE(c."10-19y Male", 0)) AS "10_19y_male",
            SUM(COALESCE(c."10-19y Female", 0)) AS "10_19y_female",
            SUM(COALESCE(c."20y+ Male", 0)) AS "20y_plus_male",
            SUM(COALESCE(c."20y+ Female", 0)) AS "20y_plus_female"
        FROM reporting."105_01_conditions" c
        INNER JOIN reporting.eafya_mappings e ON e.eafya_item_id = c.disease_id 
        WHERE c.report_month = $2
        AND e.section_id = $1`;

        const params = [section_id, report_month];

        query += ` GROUP BY c.report_month, e.section_id, e.hmis_dataelement_code, e.hmis_dataelement_name, e.dataelement_id`;

        query += ` ORDER BY c.report_month, e.hmis_dataelement_code`;

        console.log('Final Query:', query);
        console.log('Parameters:', params);
        
        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);
        
        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;