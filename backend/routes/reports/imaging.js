import express from 'express';
import { pool } from '../../config/database.js';

let ExcelJS;
try {
	ExcelJS = (await import('exceljs')).default;
} catch (e) {
	ExcelJS = null;
}

const router = express.Router();

function buildFilters(query) {
	let where = 'WHERE 1=1';
	const params = [];
	let idx = 1;

	const {
		search,
		gender,
		clinic_id,
		status,
		result,
		imaging_id,
		category_id,
		from_date,
		to_date,
		date_field = 'date_created',
	} = query;

	if (search) {
		where += ` AND (LOWER(clinic_name) LIKE LOWER($${idx}) OR LOWER(imaging_name) LIKE LOWER($${idx}) OR LOWER(category) LIKE LOWER($${idx}) OR LOWER(encounter_notes) LIKE LOWER($${idx}) OR LOWER(illness_history) LIKE LOWER($${idx}))`;
		params.push(`%${search}%`);
		idx++;
	}
	if (gender) {
		where += ` AND gender = $${idx}`;
		params.push(gender);
		idx++;
	}
	if (clinic_id) {
		where += ` AND clinic_id = $${idx}`;
		params.push(clinic_id);
		idx++;
	}
	if (status) {
		where += ` AND status = $${idx}`;
		params.push(status);
		idx++;
	}
	if (typeof result !== 'undefined' && result !== null && result !== '') {
		where += ` AND "result" = $${idx}`;
		params.push(result);
		idx++;
	}
	if (imaging_id) {
		where += ` AND imaging_id = $${idx}`;
		params.push(imaging_id);
		idx++;
	}
	if (category_id) {
		where += ` AND category_id = $${idx}`;
		params.push(category_id);
		idx++;
	}
	if (from_date) {
		const df = ['registered_date','visit_date','date_created','last_updated'].includes(date_field) ? date_field : 'date_created';
		where += ` AND ${df} >= $${idx}`;
		params.push(from_date);
		idx++;
	}
	if (to_date) {
		const df = ['registered_date','visit_date','date_created','last_updated'].includes(date_field) ? date_field : 'date_created';
		where += ` AND ${df} <= $${idx}`;
		params.push(to_date);
		idx++;
	}

	return { where, params };
}

const baseSelect = `
	SELECT patient_id, registered_date, birth_date, gender, clinic_id, clinic_name, visit_no, visit_date, date_created,
	       imaging_id, imaging_name, category_id, category, "result", status, last_updated, patient_imaging_id,
	       encounter_id, origin, encounter_notes, illness_history, created_by_id, clinic_session_id, visit_type
	FROM reporting.patient_imaging
`;

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
		const offset = (page - 1) * limit;

		const { where, params } = buildFilters(req.query);

		const countQuery = `SELECT COUNT(*)::bigint AS total FROM reporting.patient_imaging ${where}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0]?.total || '0', 10);

		let orderBy = 'ORDER BY date_created DESC NULLS LAST, visit_date DESC NULLS LAST';
		if (req.query.order_by) {
			const allowed = new Set(['date_created','visit_date','registered_date','last_updated','clinic_name','imaging_name','category']);
			const dir = String(req.query.order_dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
			const field = allowed.has(req.query.order_by) ? req.query.order_by : 'date_created';
			orderBy = `ORDER BY ${field} ${dir}`;
		}

		const dataQuery = `${baseSelect} ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		const dataParams = [...params, limit, offset];
		const { rows } = await pool.query(dataQuery, dataParams);

		res.json({ data: rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
	} catch (error) {
		console.error('Error fetching imaging data:', error);
		res.status(500).json({ message: 'Failed to fetch imaging data' });
	}
});

router.get('/export', async (req, res) => {
	try {
		const format = (req.query.format || 'csv').toLowerCase();
		const { where, params } = buildFilters(req.query);
		const orderBy = 'ORDER BY date_created DESC NULLS LAST, visit_date DESC NULLS LAST';
		const query = `${baseSelect} ${where} ${orderBy}`;
		const { rows } = await pool.query(query, params);

		const filenameBase = `imaging_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;

		if (format === 'xlsx') {
			if (!ExcelJS) {
				return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
			}
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('Imaging');
			sheet.columns = [
				{ header: 'patient_id', key: 'patient_id' },
				{ header: 'registered_date', key: 'registered_date' },
				{ header: 'birth_date', key: 'birth_date' },
				{ header: 'gender', key: 'gender' },
				{ header: 'clinic_id', key: 'clinic_id' },
				{ header: 'clinic_name', key: 'clinic_name' },
				{ header: 'visit_no', key: 'visit_no' },
				{ header: 'visit_date', key: 'visit_date' },
				{ header: 'date_created', key: 'date_created' },
				{ header: 'imaging_id', key: 'imaging_id' },
				{ header: 'imaging_name', key: 'imaging_name' },
				{ header: 'category_id', key: 'category_id' },
				{ header: 'category', key: 'category' },
				{ header: 'result', key: 'result' },
				{ header: 'status', key: 'status' },
				{ header: 'last_updated', key: 'last_updated' },
				{ header: 'patient_imaging_id', key: 'patient_imaging_id' },
				{ header: 'encounter_id', key: 'encounter_id' },
				{ header: 'origin', key: 'origin' },
				{ header: 'encounter_notes', key: 'encounter_notes' },
				{ header: 'illness_history', key: 'illness_history' },
				{ header: 'created_by_id', key: 'created_by_id' },
				{ header: 'clinic_session_id', key: 'clinic_session_id' },
				{ header: 'visit_type', key: 'visit_type' },
			];
			for (const row of rows) sheet.addRow(row);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
			await workbook.xlsx.write(res);
			return res.end();
		}

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.csv"`);
		const headers = [
			'patient_id','registered_date','birth_date','gender','clinic_id','clinic_name','visit_no','visit_date','date_created','imaging_id','imaging_name','category_id','category','result','status','last_updated','patient_imaging_id','encounter_id','origin','encounter_notes','illness_history','created_by_id','clinic_session_id','visit_type'
		];
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
		console.error('Error exporting imaging data:', error);
		res.status(500).json({ message: 'Failed to export imaging data' });
	}
});

export default router; 