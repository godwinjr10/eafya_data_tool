import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("conditions");
    try {
        const { report_month, section_id } = req.query;

        if (!section_id) {
            return res.status(400).json({ message: "section_id is required" });
        }

        let query = `
        SELECT DISTINCT
            c.report_month, 
            e.section_id,
            e.section_name,
            e.eafya_hmis_id,
            e.hmis_code,
            e.hmis_name,
            c."0-28d Male" AS "0_28d_male",
            c."0-28d Female" AS "0_28d_female", 
            c."29d-4y Male" AS "29d_4y_male",
            c."29d-4y Female" AS "29d_4y_female",
            c."5-9y Male" AS "5_9y_male",
            c."5-9y Female" AS "5_9y_female",
            c."10-19y Male" AS "10_19y_male",
            c."10-19y Female" AS "10_19y_female",
            c."20y+ Male" AS "20y_plus_male",
            c."20y+ Female" AS "20y_plus_female"
        FROM reporting."105_01_conditions" c
        INNER JOIN reporting.hmis_eafya_mapping m ON m.eafya_disease_id = c.disease_id
        INNER JOIN reporting.dhis_eafya_mapping_conditions e
                   ON e.eafya_hmis_id IS NOT NULL
                       AND e.eafya_hmis_id <> ''
                       AND CAST(e.eafya_hmis_id AS int) = m.hmis_code
        WHERE e.section_id = $1
        `;

        const params = [section_id];

        if (report_month) {
            query += ` AND c.report_month = $2`;
            params.push(report_month);
        }

        query += ` ORDER BY c.report_month DESC, e.section_id, e.hmis_code, e.eafya_hmis_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;