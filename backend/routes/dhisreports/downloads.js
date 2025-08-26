import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/conditions', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT
c.report_month,
e.section_id,
e.section_name,
e.hmis_code,
e.hmis_name,
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
INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON e.eafya_disease_id = c.disease_id
        WHERE c.report_month = $1
        GROUP by c.report_month, e.section_id, e.section_name, e.hmis_code, e.hmis_name
        ORDER by c.report_month, e.section_id`;

        const params = [report_month];
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/commodities', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                a.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                a.qty_consumed AS "Quantity Consumed",
                a.days_out_of_stock AS "Days out Stock", 
                a.stock_level AS "stock on hand",
                a.quantity_expired AS "Quantity Expired"
            FROM reporting."105_06_commodities" a
            JOIN (
                SELECT DISTINCT section_id, section_name, hmis_code, hmis_name, eafya_product_id
                FROM reporting.dhis_eafya_mapping_commodities
                WHERE section_id = '6.1'
            ) m 
            ON a.product_id = m.eafya_product_id
            WHERE a.report_month = $1
            ORDER BY m.section_id, m.hmis_code;
        `;

        const params = [report_month];
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/labtests', async (req, res) => {
    try {
        const { report_month } = req.query;
        
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
                WHERE section_id = '10.2.1'
            ) m 
            ON t.lab_test_id = m.eafya_labtest_id
            WHERE t.report_month = $1
            ORDER BY m.section_id, m.hmis_code;
        `;

        const params = [report_month];
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;