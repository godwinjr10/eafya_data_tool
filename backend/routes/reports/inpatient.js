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
		admission_ward_id,
		ward_id,
		admitting_doctor_id,
		assigned_doctor_id,
		is_closed,
		from_date,
		to_date,
		date_field = 'admission_date',
	} = query;

	if (search) {
		where += ` AND (LOWER(first_name) LIKE LOWER($${idx}) OR LOWER(last_name) LIKE LOWER($${idx}) OR LOWER(admission_ward_name) LIKE LOWER($${idx}) OR LOWER(clinic_name) LIKE LOWER($${idx}) OR LOWER(encounter_notes) LIKE LOWER($${idx}) OR LOWER(illness_history) LIKE LOWER($${idx}))`;
		params.push(`%${search}%`);
		idx++;
	}
	if (gender) { where += ` AND gender = $${idx}`; params.push(gender); idx++; }
	if (clinic_id) { where += ` AND clinic_id = $${idx}`; params.push(clinic_id); idx++; }
	if (admission_ward_id) { where += ` AND admission_ward_id = $${idx}`; params.push(admission_ward_id); idx++; }
	if (ward_id) { where += ` AND ward_id = $${idx}`; params.push(ward_id); idx++; }
	if (admitting_doctor_id) { where += ` AND admitting_doctor_id = $${idx}`; params.push(admitting_doctor_id); idx++; }
	if (assigned_doctor_id) { where += ` AND assigned_doctor_id = $${idx}`; params.push(assigned_doctor_id); idx++; }
	if (is_closed !== undefined && is_closed !== null && is_closed !== '') { where += ` AND is_closed = $${idx}::boolean`; params.push(is_closed); idx++; }
	if (from_date) {
		const allowed = ['admission_date','date_created','discharge_date','last_updated','medical_discharge_date'];
		const df = allowed.includes(date_field) ? date_field : 'admission_date';
		where += ` AND ${df} >= $${idx}`;
		params.push(from_date);
		idx++;
	}
	if (to_date) {
		const allowed = ['admission_date','date_created','discharge_date','last_updated','medical_discharge_date'];
		const df = allowed.includes(date_field) ? date_field : 'admission_date';
		where += ` AND ${df} <= $${idx}`;
		params.push(to_date);
		idx++;
	}

	return { where, params };
}

const baseSelect = `
	SELECT patient_id, gender, birth_date, first_name, last_name, admission_date, admission_ward_id,
	       cinic_id AS clinic_id, clinic_name, ward_id, admission_ward_name, admitting_doctor_id, assigned_doctor_id,
	       brought_in_by_id, "comments", created_by_id, date_created, discharge_care_plan, discharge_date,
	       discharge_encounter_id, discharging_doctor_id, admission_encounter_id, encounter_id, origin,
	       encounter_notes, illness_history, escorting_nurse_id, is_closed, last_updated, medical_discharge_date,
	       receiving_nurse_id, released_by_id, is_admission_approved, patient_visit_id
	FROM reporting.patient_admissions
`;

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
		const offset = (page - 1) * limit;

		const { where, params } = buildFilters(req.query);

		const countQuery = `SELECT COUNT(*)::bigint AS total FROM reporting.patient_admissions ${where}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0]?.total || '0', 10);

		let orderBy = 'ORDER BY admission_date DESC NULLS LAST, date_created DESC NULLS LAST';
		if (req.query.order_by) {
			const allowed = new Set(['admission_date','date_created','discharge_date','last_updated','first_name','last_name','clinic_name','admission_ward_name']);
			const dir = String(req.query.order_dir || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
			const field = allowed.has(req.query.order_by) ? req.query.order_by : 'admission_date';
			orderBy = `ORDER BY ${field} ${dir}`;
		}

		const dataQuery = `${baseSelect} ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		const dataParams = [...params, limit, offset];
		const { rows } = await pool.query(dataQuery, dataParams);

		res.json({ data: rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
	} catch (error) {
		console.error('Error fetching inpatient data:', error);
		res.status(500).json({ message: 'Failed to fetch inpatient data' });
	}
});

router.get('/export', async (req, res) => {
	try {
		const { where, params } = buildFilters(req.query);
		const orderBy = 'ORDER BY admission_date DESC NULLS LAST, date_created DESC NULLS LAST';
		const rowsQuery = `${baseSelect} ${where} ${orderBy}`;
		const { rows } = await pool.query(rowsQuery, params);

		const format = (req.query.format || 'csv').toLowerCase();
		const filenameBase = `inpatient_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;

		if (format === 'xlsx') {
			if (!ExcelJS) return res.status(400).json({ message: 'Excel export not available: exceljs not installed' });
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet('Inpatient');
			sheet.columns = [
				{ header: 'patient_id', key: 'patient_id' },
				{ header: 'gender', key: 'gender' },
				{ header: 'birth_date', key: 'birth_date' },
				{ header: 'first_name', key: 'first_name' },
				{ header: 'last_name', key: 'last_name' },
				{ header: 'admission_date', key: 'admission_date' },
				{ header: 'admission_ward_id', key: 'admission_ward_id' },
				{ header: 'clinic_id', key: 'clinic_id' },
				{ header: 'clinic_name', key: 'clinic_name' },
				{ header: 'ward_id', key: 'ward_id' },
				{ header: 'admission_ward_name', key: 'admission_ward_name' },
				{ header: 'admitting_doctor_id', key: 'admitting_doctor_id' },
				{ header: 'assigned_doctor_id', key: 'assigned_doctor_id' },
				{ header: 'brought_in_by_id', key: 'brought_in_by_id' },
				{ header: 'comments', key: 'comments' },
				{ header: 'created_by_id', key: 'created_by_id' },
				{ header: 'date_created', key: 'date_created' },
				{ header: 'discharge_care_plan', key: 'discharge_care_plan' },
				{ header: 'discharge_date', key: 'discharge_date' },
				{ header: 'discharge_encounter_id', key: 'discharge_encounter_id' },
				{ header: 'discharging_doctor_id', key: 'discharging_doctor_id' },
				{ header: 'admission_encounter_id', key: 'admission_encounter_id' },
				{ header: 'encounter_id', key: 'encounter_id' },
				{ header: 'origin', key: 'origin' },
				{ header: 'encounter_notes', key: 'encounter_notes' },
				{ header: 'illness_history', key: 'illness_history' },
				{ header: 'escorting_nurse_id', key: 'escorting_nurse_id' },
				{ header: 'is_closed', key: 'is_closed' },
				{ header: 'last_updated', key: 'last_updated' },
				{ header: 'medical_discharge_date', key: 'medical_discharge_date' },
				{ header: 'receiving_nurse_id', key: 'receiving_nurse_id' },
				{ header: 'released_by_id', key: 'released_by_id' },
				{ header: 'is_admission_approved', key: 'is_admission_approved' },
				{ header: 'patient_visit_id', key: 'patient_visit_id' },
			];
			for (const row of rows) sheet.addRow(row);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
			await workbook.xlsx.write(res);
			return res.end();
		}

		const headers = ['patient_id','gender','birth_date','first_name','last_name','admission_date','admission_ward_id','clinic_id','clinic_name','ward_id','admission_ward_name','admitting_doctor_id','assigned_doctor_id','brought_in_by_id','comments','created_by_id','date_created','discharge_care_plan','discharge_date','discharge_encounter_id','discharging_doctor_id','admission_encounter_id','encounter_id','origin','encounter_notes','illness_history','escorting_nurse_id','is_closed','last_updated','medical_discharge_date','receiving_nurse_id','released_by_id','is_admission_approved','patient_visit_id'];
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
		console.error('Error exporting inpatient data:', error);
		res.status(500).json({ message: 'Failed to export inpatient data' });
	}
});

export default router; 