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
            a.report_month,
            m.section_id,
            m.section_name,
            m.hmis_code,
            m.hmis_name,
            a.qty_consumed,
            a.days_out_of_stock,
            a.stock_level,
            a.quantity_expired
        FROM reporting."105_06_commodities" a
        JOIN (
            SELECT DISTINCT section_id, section_name, hmis_code, hmis_name, eafya_product_id
            FROM reporting.dhis_eafya_mapping_commodities
            WHERE section_id = $1
            ) m 
            ON a.product_id = m.eafya_product_id
            WHERE 1=1
`;

        const params = [section_id];
        let paramCount = 2;

        if (report_month) {
            query += ` AND a.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY a.report_month DESC, m.section_id, m.hmis_code, m.eafya_product_id`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;