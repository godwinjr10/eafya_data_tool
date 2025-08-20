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
                m.section_id,
                m.category,
                m.hmis_code,
                m.hmis_name,
                t.lab_test_name,
                t.total_cases,
                t.positive_cases
            FROM reporting."105_10_labtests_done" t
            JOIN (
                SELECT DISTINCT section_id, category, hmis_code, hmis_name, eafya_labtest_id
                FROM reporting.dhis_eafya_mapping_labtests 
                WHERE section_id = $1
                ) m 
            ON t.lab_test_id = m.eafya_labtest_id 
            WHERE 1=1
`;

        const params = [section_id];
        let paramCount = 2;

        if (report_month) {
            query += ` AND t.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY t.report_month DESC, m.section_id, m.hmis_code, m.eafya_labtest_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;