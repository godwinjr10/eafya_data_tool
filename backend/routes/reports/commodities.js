import express from 'express';
import { pool } from '../../config/database.js';

let ExcelJS;
try {
	ExcelJS = (await import('exceljs')).default;
} catch (e) {
	ExcelJS = null;
}

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

router.get('/export', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;
        if (!from_date || !to_date) {
            return res.status(400).json({ message: 'Both from_date and to_date are required' });
        }
        const rowsQuery = `
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
        const { rows } = await pool.query(rowsQuery, params);

        const format = (req.query.format || 'csv').toLowerCase();
        const filenameBase = `yearstock_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;

        if (format === 'xlsx') {
            if (!ExcelJS) return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('YearStock');
            sheet.columns = [
                { header: 'report_month', key: 'report_month' },
                { header: 'store_name', key: 'store_name' },
                { header: 'product_id', key: 'product_id' },
                { header: 'product_name', key: 'product_name' },
                { header: 'stock_level', key: 'stock_level' },
                { header: 'last_update', key: 'last_update' },
            ];
            for (const row of rows) sheet.addRow(row);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
            await workbook.xlsx.write(res);
            return res.end();
        }

        const headers = ['report_month','store_name','product_id','product_name','stock_level','last_update'];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
        res.write(headers.join(',') + '\n');
        for (const row of rows) {
            const values = headers.map((h) => {
                const val = row[h];
                if (val === null || val === undefined) return '';
                const str = String(val);
                if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
                return str;
            });
            res.write(values.join(',') + '\n');
        }
        return res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/movement', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
        const offset = (page - 1) * limit;

        let base = `
            FROM reporting.commodities c
        `;
        const params = [];
        let where = '';
        if (from_date && to_date) {
            where = ` WHERE c.date_created BETWEEN $1 AND $2`;
            params.push(from_date, to_date);
        }

        const countQuery = `SELECT COUNT(*)::bigint as total ${base} ${where}`;
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0]?.total || '0', 10);

        const selectQuery = `
            SELECT 
                c.store_id,
                c.store_name,
                c.product_id,
                c.product_name,
                c.product_type,
                c."increment",
                c.decrement,
                c."level",
                c.created_by_id,
                c.date_created,
                c.last_updated
            ${base}
            ${where}
            ORDER BY c.date_created DESC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        const dataParams = [...params, limit, offset];
        const { rows } = await pool.query(selectQuery, dataParams);

        res.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/movement/export', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;
        let base = `
            FROM reporting.commodities c
        `;
        const params = [];
        let where = '';
        if (from_date && to_date) {
            where = ` WHERE c.date_created BETWEEN $1 AND $2`;
            params.push(from_date, to_date);
        }
        const rowsQuery = `
            SELECT 
                c.store_id,
                c.store_name,
                c.product_id,
                c.product_name,
                c.product_type,
                c."increment",
                c.decrement,
                c."level",
                c.created_by_id,
                c.date_created,
                c.last_updated
            ${base}
            ${where}
            ORDER BY c.date_created DESC
        `;
        const { rows } = await pool.query(rowsQuery, params);

        const format = (req.query.format || 'csv').toLowerCase();
        const filenameBase = `movement_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;

        if (format === 'xlsx') {
            if (!ExcelJS) return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Movement');
            sheet.columns = [
                { header: 'store_id', key: 'store_id' },
                { header: 'store_name', key: 'store_name' },
                { header: 'product_id', key: 'product_id' },
                { header: 'product_name', key: 'product_name' },
                { header: 'product_type', key: 'product_type' },
                { header: 'increment', key: 'increment' },
                { header: 'decrement', key: 'decrement' },
                { header: 'level', key: 'level' },
                { header: 'created_by_id', key: 'created_by_id' },
                { header: 'date_created', key: 'date_created' },
                { header: 'last_updated', key: 'last_updated' },
            ];
            for (const row of rows) sheet.addRow(row);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
            await workbook.xlsx.write(res);
            return res.end();
        }

        const headers = ['store_id','store_name','product_id','product_name','product_type','increment','decrement','level','created_by_id','date_created','last_updated'];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
        res.write(headers.join(',') + '\n');
        for (const row of rows) {
            const values = headers.map((h) => {
                const val = row[h];
                if (val === null || val === undefined) return '';
                const str = String(val);
                if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
                return str;
            });
            res.write(values.join(',') + '\n');
        }
        return res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;