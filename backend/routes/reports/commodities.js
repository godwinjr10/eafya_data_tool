import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({ message: 'Both from_date and to_date are required' });
        }

        const query = `
            SELECT 
                DISTINCT ON (store_name, product_id)
                TO_CHAR(date_created, 'YYYYMM') AS report_month,
                store_name,
                product_id,
                product_name,
                level AS stock_level,
                date_created AS last_update
            FROM reporting.commodities
            WHERE date_created <= $2
            AND date_created >= $1
            ORDER BY store_name, product_id, date_created DESC;
        `;

        const params = [from_date, to_date];

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/movement', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({ message: 'Both from_date and to_date are required' });
        }

        const query = `
            select 
                c.date_created ,
                c.last_updated ,
                c.store_name ,
                c.product_name ,
                c."increment" ,
                c.decrement ,
                c."level" 
            from reporting.commodities c
            WHERE date_created BETWEEN $1 AND $2
            ORDER BY store_name, product_id, date_created;
        `;

        const params = [from_date, to_date];

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;