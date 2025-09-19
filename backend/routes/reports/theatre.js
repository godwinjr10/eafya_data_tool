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
		visit_type,
		theater_id,
		major_theater_id,
		major_theater_room_id,
		from_date,
		to_date,
		date_field = 'date_created',
	} = query;

	if (search) {
		where += ` AND (LOWER(first_name) LIKE LOWER($${idx}) OR LOWER(last_name) LIKE LOWER($${idx}) OR LOWER(major_theater_name) LIKE LOWER($${idx}) OR LOWER(category) LIKE LOWER($${idx}) OR LOWER(room) LIKE LOWER($${idx}) OR LOWER(encounter_notes) LIKE LOWER($${idx}) OR LOWER(illness_history) LIKE LOWER($${idx}))`;
		params.push(`%${search}%`);
		idx++;
	}
	if (gender) { where += ` AND gender = $${idx}`; params.push(gender); idx++; }
	if (clinic_id) { where += ` AND clinic_id = $${idx}`; params.push(clinic_id); idx++; }
	if (visit_type) { where += ` AND visit_type = $${idx}`; params.push(visit_type); idx++; }
	if (theater_id) { where += ` AND theater_id = $${idx}`; params.push(theater_id); idx++; }
	if (major_theater_id) { where += ` AND major_theater_id = $${idx}`; params.push(major_theater_id); idx++; }
	if (major_theater_room_id) { where += ` AND major_theater_room_id = $${idx}`; params.push(major_theater_room_id); idx++; }
	if (from_date) {
		const df = ['date_created','registered_date','scheduled_date'].includes(date_field) ? date_field : 'date_created';
		where += ` AND ${df} >= $${idx}`;
		params.push(from_date);
		idx++;
	}
	if (to_date) {
		const df = ['date_created','registered_date','scheduled_date'].includes(date_field) ? date_field : 'date_created';
		where += ` AND ${df} <= $${idx}`;
		params.push(to_date);
		idx++;
	}

	return { where, params };
}

const baseSelect = `
	SELECT patient_id, registered_date, visit_no, first_name, last_name, birth_date, gender,
	       theater_id, major_theater_name, category, room, date_created, scheduled_date, scheduled_time,
	       patient_major_theatre_id, major_theater_id, major_theater_room_id, enounter_id, origin,
	       encounter_notes, illness_history, clinic_session_id, clinic_id, visit_type,
	       administered_by_id, created_by_id
	FROM reporting.patient_major_theater
`;

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
		const offset = (page - 1) * limit;

		const { where, params } = buildFilters(req.query);

		const countQuery = `SELECT COUNT(*)::bigint AS total FROM reporting.patient_major_theater ${where}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0]?.total || '0', 10);

		let orderBy = 'ORDER BY date_created DESC NULLS LAST, registered_date DESC NULLS LAST';
		if (req.query.order_by) {
			const allowed = new Set(['date_created','registered_date','scheduled_date','first_name','last_name','major_theater_name']);
			const dir = String(req.query.order_dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
			const field = allowed.has(req.query.order_by) ? req.query.order_by : 'date_created';
			orderBy = `ORDER BY ${field} ${dir}`;
		}

		const dataQuery = `${baseSelect} ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		const dataParams = [...params, limit, offset];
		const { rows } = await pool.query(dataQuery, dataParams);

		res.json({ data: rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
	} catch (error) {
		console.error('Error fetching theatre data:', error);
		res.status(500).json({ message: 'Failed to fetch theatre data' });
	}
});

router.get('/export', async (req, res) => {
	try {
		const format = (req.query.format || 'csv').toLowerCase();
		const { where, params } = buildFilters(req.query);
		const orderBy = 'ORDER BY date_created DESC NULLS LAST, registered_date DESC NULLS LAST';
		const query = `${baseSelect} ${where} ${orderBy}`;
		const { rows } = await pool.query(query, params);

		const filenameBase = `theatre_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;

		if (format === 'xlsx') {
			if (!ExcelJS) return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('Theatre');
			sheet.columns = [
				{ header: 'patient_id', key: 'patient_id' },
				{ header: 'registered_date', key: 'registered_date' },
				{ header: 'visit_no', key: 'visit_no' },
				{ header: 'first_name', key: 'first_name' },
				{ header: 'last_name', key: 'last_name' },
				{ header: 'birth_date', key: 'birth_date' },
				{ header: 'gender', key: 'gender' },
				{ header: 'theater_id', key: 'theater_id' },
				{ header: 'major_theater_name', key: 'major_theater_name' },
				{ header: 'category', key: 'category' },
				{ header: 'room', key: 'room' },
				{ header: 'date_created', key: 'date_created' },
				{ header: 'scheduled_date', key: 'scheduled_date' },
				{ header: 'scheduled_time', key: 'scheduled_time' },
				{ header: 'patient_major_theatre_id', key: 'patient_major_theatre_id' },
				{ header: 'major_theater_id', key: 'major_theater_id' },
				{ header: 'major_theater_room_id', key: 'major_theater_room_id' },
				{ header: 'enounter_id', key: 'enounter_id' },
				{ header: 'origin', key: 'origin' },
				{ header: 'encounter_notes', key: 'encounter_notes' },
				{ header: 'illness_history', key: 'illness_history' },
				{ header: 'clinic_session_id', key: 'clinic_session_id' },
				{ header: 'clinic_id', key: 'clinic_id' },
				{ header: 'visit_type', key: 'visit_type' },
				{ header: 'administered_by_id', key: 'administered_by_id' },
				{ header: 'created_by_id', key: 'created_by_id' },
			];
			for (const row of rows) sheet.addRow(row);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
			await workbook.xlsx.write(res);
			return res.end();
		}

		const headers = [
			'patient_id','registered_date','visit_no','first_name','last_name','birth_date','gender','theater_id','major_theater_name','category','room','date_created','scheduled_date','scheduled_time','patient_major_theatre_id','major_theater_id','major_theater_room_id','enounter_id','origin','encounter_notes','illness_history','clinic_session_id','clinic_id','visit_type','administered_by_id','created_by_id'
		];
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
		console.error('Error exporting theatre data:', error);
		res.status(500).json({ message: 'Failed to export theatre data' });
	}
});

export default router; 