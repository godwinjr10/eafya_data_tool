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
            p.report_month,
            e.section_id,
            e.hmis_dataelement_code,
            e.hmis_dataelement_name,
            e.dataelement_id,
            SUM(COALESCE(p.qty_consumed, 0)) AS "qty_consumed",
            SUM(COALESCE(p.days_out_of_stock, 0)) AS "days_out_of_stock",
            SUM(COALESCE(p.stock_level, 0)) AS "stock_level",
            SUM(COALESCE(p.quantity_expired, 0)) AS "quantity_expired"
        FROM reporting."105_06_commodities" p
        INNER JOIN reporting.eafya_mappings e ON e.eafya_item_id = p.product_id
        WHERE e.section_id = $1
`;

        const params = [section_id];
        let paramCount = 2;

        if (report_month) {
            query += ` AND p.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` GROUP BY p.report_month, e.section_id, e.hmis_dataelement_code, e.hmis_dataelement_name, e.dataelement_id`;
        query += ` ORDER BY p.report_month, e.hmis_dataelement_code`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;