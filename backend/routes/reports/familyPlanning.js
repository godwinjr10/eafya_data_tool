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
		family_planning_id,
		category_id,
		is_new_to_method,
		visit_type_id,
		from_date,
		to_date,
		date_field = 'administered_on',
	} = query;

	if (search) {
		where += ` AND (LOWER(first_name) LIKE LOWER($${idx}) OR LOWER(last_name) LIKE LOWER($${idx}) OR LOWER(family_planning_method) LIKE LOWER($${idx}) OR LOWER(category) LIKE LOWER($${idx}) OR LOWER(clinic_name) LIKE LOWER($${idx}) OR LOWER(encounter_notes) LIKE LOWER($${idx}) OR LOWER(illness_history) LIKE LOWER($${idx}))`;
		params.push(`%${search}%`);
		idx++;
	}
	if (gender) { where += ` AND gender = $${idx}`; params.push(gender); idx++; }
	if (clinic_id) { where += ` AND clinic_id = $${idx}`; params.push(clinic_id); idx++; }
	if (family_planning_id) { where += ` AND family_planning_id = $${idx}`; params.push(family_planning_id); idx++; }
	if (category_id) { where += ` AND category_id = $${idx}`; params.push(category_id); idx++; }
	if (typeof is_new_to_method !== 'undefined' && is_new_to_method !== '' && is_new_to_method !== null) { where += ` AND is_new_to_method = $${idx}`; params.push(is_new_to_method); idx++; }
	if (visit_type_id) { where += ` AND visit_type_id = $${idx}`; params.push(visit_type_id); idx++; }
	if (from_date) {
		const allowed = ['visit_date','planning_date_created','administered_on','fp_date_created'];
		const df = allowed.includes(date_field) ? date_field : 'administered_on';
		where += ` AND ${df} >= $${idx}`;
		params.push(from_date);
		idx++;
	}
	if (to_date) {
		const allowed = ['visit_date','planning_date_created','administered_on','fp_date_created'];
		const df = allowed.includes(date_field) ? date_field : 'administered_on';
		where += ` AND ${df} <= $${idx}`;
		params.push(to_date);
		idx++;
	}
	return { where, params };
}

const baseSelect = `
	SELECT visit_no, visit_date, planning_date_created, administered_on, patient_id, first_name, last_name, gender, birth_date,
	       encounter_id, clinic_id, clinic_name, family_planning_id, is_new_to_method, treatment_stage, origin, encounter_notes,
	       illness_history, administered_at, fp_date_created, administered_family_planning_id, family_planning_method, description,
	       category_id, category, visit_type_id, visit_name
	FROM reporting.patient_family_planning
`;

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
		const offset = (page - 1) * limit;
		const { where, params } = buildFilters(req.query);
		const countQuery = `SELECT COUNT(*)::bigint as total FROM reporting.patient_family_planning ${where}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0]?.total || '0', 10);
		let orderBy = 'ORDER BY administered_on DESC NULLS LAST, visit_date DESC NULLS LAST';
		if (req.query.order_by) {
			const allowed = new Set(['administered_on','visit_date','fp_date_created','planning_date_created','first_name','last_name','clinic_name','family_planning_method']);
			const dir = String(req.query.order_dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
			const field = allowed.has(req.query.order_by) ? req.query.order_by : 'administered_on';
			orderBy = `ORDER BY ${field} ${dir}`;
		}
		const dataQuery = `${baseSelect} ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		const dataParams = [...params, limit, offset];
		const { rows } = await pool.query(dataQuery, dataParams);
		res.json({ data: rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
	} catch (error) {
		console.error('Error fetching family planning:', error);
		res.status(500).json({ message: 'Failed to fetch family planning' });
	}
});

router.get('/export', async (req, res) => {
	try {
		const { where, params } = buildFilters(req.query);
		const orderBy = 'ORDER BY administered_on DESC NULLS LAST, visit_date DESC NULLS LAST';
		const rowsQuery = `${baseSelect} ${where} ${orderBy}`;
		const { rows } = await pool.query(rowsQuery, params);
		const format = (req.query.format || 'csv').toLowerCase();
		const filenameBase = `family_planning_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;
		if (format === 'xlsx') {
			if (!ExcelJS) return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('FamilyPlanning');
			sheet.columns = [
				{ header: 'visit_no', key: 'visit_no' },
				{ header: 'visit_date', key: 'visit_date' },
				{ header: 'planning_date_created', key: 'planning_date_created' },
				{ header: 'administered_on', key: 'administered_on' },
				{ header: 'patient_id', key: 'patient_id' },
				{ header: 'first_name', key: 'first_name' },
				{ header: 'last_name', key: 'last_name' },
				{ header: 'gender', key: 'gender' },
				{ header: 'birth_date', key: 'birth_date' },
				{ header: 'encounter_id', key: 'encounter_id' },
				{ header: 'clinic_id', key: 'clinic_id' },
				{ header: 'clinic_name', key: 'clinic_name' },
				{ header: 'family_planning_id', key: 'family_planning_id' },
				{ header: 'is_new_to_method', key: 'is_new_to_method' },
				{ header: 'treatment_stage', key: 'treatment_stage' },
				{ header: 'origin', key: 'origin' },
				{ header: 'encounter_notes', key: 'encounter_notes' },
				{ header: 'illness_history', key: 'illness_history' },
				{ header: 'administered_at', key: 'administered_at' },
				{ header: 'fp_date_created', key: 'fp_date_created' },
				{ header: 'administered_family_planning_id', key: 'administered_family_planning_id' },
				{ header: 'family_planning_method', key: 'family_planning_method' },
				{ header: 'description', key: 'description' },
				{ header: 'category_id', key: 'category_id' },
				{ header: 'category', key: 'category' },
				{ header: 'visit_type_id', key: 'visit_type_id' },
				{ header: 'visit_name', key: 'visit_name' },
			];
			for (const row of rows) sheet.addRow(row);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
			await workbook.xlsx.write(res);
			return res.end();
		}
		const headers = ['visit_no','visit_date','planning_date_created','administered_on','patient_id','first_name','last_name','gender','birth_date','encounter_id','clinic_id','clinic_name','family_planning_id','is_new_to_method','treatment_stage','origin','encounter_notes','illness_history','administered_at','fp_date_created','administered_family_planning_id','family_planning_method','description','category_id','category','visit_type_id','visit_name'];
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
		console.error('Error exporting family planning:', error);
		res.status(500).json({ message: 'Failed to export family planning' });
	}
});

export default router; 