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
            MAX(CASE WHEN m.data_element_name = 'Quantity Consumed' THEN a.qty_consumed END) AS "Quantity Consumed",
            MAX(CASE WHEN m.data_element_name = 'Days out of stock' THEN a.days_out_of_stock END) AS "Days out Stock",
            MAX(CASE WHEN m.data_element_name = 'Stock at Hand' THEN a.stock_level END) AS "Stock on Hand",
            MAX(CASE WHEN m.data_element_name = 'Quantity Expired' THEN a.quantity_expired END) AS "Quantity Expired"
        FROM reporting."105_06_commodities" a
        INNER JOIN reporting.dhis_eafya_mapping_commodities m ON m.eafya_product_id = a.product_id
        WHERE a.report_month = $1 AND m.section_id = $2
        GROUP BY a.report_month, m.section_id, m.section_name, m.hmis_code, m.hmis_name
`;

        const params = [report_month || '202505', section_id];

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;