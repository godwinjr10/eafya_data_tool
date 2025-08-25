import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { report_month, section_id } = req.query;

        if (!section_id) {
            return res.status(400).json({ message: "section_id is required" });
        }

        let query = `
            SELECT
                t.report_month,
                e.section_id,
                e.hmis_dataelement_code,
                e.hmis_dataelement_name,
                e.dataelement_id,
                SUM(COALESCE(t.total_cases, 0)) AS "total_cases",
                SUM(COALESCE(t.positive_cases, 0)) AS "positive_cases"
            FROM reporting."105_10_labtests_done" t
            INNER JOIN reporting.eafya_mappings e ON e.eafya_item_id = t.lab_test_id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (section_id) {
            query += ` AND e.section_id = $${paramCount}`;
            params.push(section_id);
            paramCount++;
        }

        if (report_month) {
            query += ` AND t.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` GROUP BY t.report_month, e.section_id, e.hmis_dataelement_code, e.hmis_dataelement_name, e.dataelement_id
                   ORDER BY t.report_month, e.hmis_dataelement_code`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;