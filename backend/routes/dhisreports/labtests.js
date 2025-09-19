import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const { report_month, section_id } = req.query;

		if (!section_id) {
			return res
				.status(400)
				.json({ message: "section_id is required" });
		}

		let query = `
            SELECT 
                t.report_month,
                m._section_id,
                m.category,
                m.hmis_code,
                m.hmis_name,
                t.lab_test_name,
                t.total_cases,
                t.positive_cases
            FROM reporting."105_10_labtests_done" t
            JOIN 
            (SELECT DISTINCT _section_id, category, hmis_code, hmis_name, eafya_labtest_id 
            FROM reporting.dhis_eafya_mapping_labtests WHERE _section_id = $1) m 
            ON CAST(m.eafya_labtest_id AS BIGINT) = t.lab_test_id 
        `;

		const params = [section_id];
		let paramCount = 2;

		if (report_month) {
			query += ` WHERE t.report_month = $${paramCount}`;
			params.push(report_month);
		}

		query += ` ORDER BY m.hmis_code`;

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Patient labtests detailed endpoint using reporting.patient_labtests
let ExcelJS;
try {
	ExcelJS = (await import("exceljs")).default;
} catch (e) {
	ExcelJS = null;
}

function buildPatientFilters(query) {
	let where = "WHERE 1=1";
	const params = [];
	let idx = 1;
	const { search, gender, clinic_id, status, result, lab_test_id, parent_id, from_date, to_date, date_field = "lab_test_date" } = query;
	if (search) {
		where += ` AND (LOWER(first_name) LIKE LOWER($${idx}) OR LOWER(last_name) LIKE LOWER($${idx}) OR LOWER(lab_test_name) LIKE LOWER($${idx}) OR LOWER(clinic_name) LIKE LOWER($${idx}) OR LOWER(encounter_notes) LIKE LOWER($${idx}) OR LOWER(illness_history) LIKE LOWER($${idx}))`;
		params.push(`%${search}%`);
		idx++;
	}
	if (gender) { where += ` AND gender = $${idx}`; params.push(gender); idx++; }
	if (clinic_id) { where += ` AND clinic_id = $${idx}`; params.push(clinic_id); idx++; }
	if (status) { where += ` AND status = $${idx}`; params.push(status); idx++; }
	if (typeof result !== "undefined" && result !== null && result !== "") { where += ` AND "result" = $${idx}`; params.push(result); idx++; }
	if (lab_test_id) { where += ` AND lab_test_id = $${idx}`; params.push(lab_test_id); idx++; }
	if (parent_id) { where += ` AND parent_id = $${idx}`; params.push(parent_id); idx++; }
	if (from_date) { where += ` AND ${date_field === "visit_date" ? "visit_date" : "lab_test_date"} >= $${idx}`; params.push(from_date); idx++; }
	if (to_date) { where += ` AND ${date_field === "visit_date" ? "visit_date" : "lab_test_date"} <= $${idx}`; params.push(to_date); idx++; }
	return { where, params };
}

const patientSelect = `
	SELECT patient_id, first_name, last_name, birth_date, gender, visit_id, visit_date,
	       lab_test_date, clinic_id, clinic_name, encounter_id, origin, encounter_notes,
	       illness_history, lab_test_id, parent_id, lab_test_name, "result", status
	FROM reporting.patient_labtests
`;

router.get("/patient", async (req, res) => {
	try {
		const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const limit = parseInt(req.query.limit) > 0 ? Math.min(parseInt(req.query.limit), 200) : 50;
		const offset = (page - 1) * limit;
		const { where, params } = buildPatientFilters(req.query);
		const countQuery = `SELECT COUNT(*)::bigint AS total FROM reporting.patient_labtests ${where}`;
		const countResult = await pool.query(countQuery, params);
		const total = parseInt(countResult.rows[0]?.total || "0", 10);
		let orderBy = "ORDER BY lab_test_date DESC NULLS LAST, visit_date DESC NULLS LAST";
		if (req.query.order_by) {
			const allowed = new Set(["lab_test_date", "visit_date", "first_name", "last_name", "clinic_name"]);
			const dir = String(req.query.order_dir || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";
			const field = allowed.has(req.query.order_by) ? req.query.order_by : "lab_test_date";
			orderBy = `ORDER BY ${field} ${dir}`;
		}
		const dataQuery = `${patientSelect} ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		const dataParams = [...params, limit, offset];
		const { rows } = await pool.query(dataQuery, dataParams);
		res.json({ data: rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
	} catch (error) {
		console.error("Error fetching patient labtests:", error);
		res.status(500).json({ message: "Failed to fetch patient labtests" });
	}
});

router.get("/patient/export", async (req, res) => {
	try {
		const format = (req.query.format || "csv").toLowerCase();
		const { where, params } = buildPatientFilters(req.query);
		const orderBy = "ORDER BY lab_test_date DESC NULLS LAST, visit_date DESC NULLS LAST";
		const query = `${patientSelect} ${where} ${orderBy}`;
		const { rows } = await pool.query(query, params);
		const filenameBase = `labtests_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}`;
		if (format === "xlsx") {
			if (!ExcelJS) return res.status(400).json({ message: "Excel export not available: exceljs not installed" });
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("LabTests");
			sheet.columns = [
				{ header: "patient_id", key: "patient_id" },
				{ header: "first_name", key: "first_name" },
				{ header: "last_name", key: "last_name" },
				{ header: "birth_date", key: "birth_date" },
				{ header: "gender", key: "gender" },
				{ header: "visit_id", key: "visit_id" },
				{ header: "visit_date", key: "visit_date" },
				{ header: "lab_test_date", key: "lab_test_date" },
				{ header: "clinic_id", key: "clinic_id" },
				{ header: "clinic_name", key: "clinic_name" },
				{ header: "encounter_id", key: "encounter_id" },
				{ header: "origin", key: "origin" },
				{ header: "encounter_notes", key: "encounter_notes" },
				{ header: "illness_history", key: "illness_history" },
				{ header: "lab_test_id", key: "lab_test_id" },
				{ header: "parent_id", key: "parent_id" },
				{ header: "lab_test_name", key: "lab_test_name" },
				{ header: "result", key: "result" },
				{ header: "status", key: "status" },
			];
			for (const row of rows) sheet.addRow(row);
			res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}.xlsx"`);
			await workbook.xlsx.write(res);
			return res.end();
		}
		const headers = [
			"patient_id","first_name","last_name","birth_date","gender","visit_id","visit_date","lab_test_date","clinic_id","clinic_name","encounter_id","origin","encounter_notes","illness_history","lab_test_id","parent_id","lab_test_name","result","status"
		];
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}.csv"`);
		res.write(headers.join(",") + "\n");
		for (const row of rows) {
			const values = headers.map((h) => {
				const val = row[h];
				if (val === null || val === undefined) return "";
				const str = String(val);
				if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
				return str;
			});
			res.write(values.join(",") + "\n");
		}
		return res.end();
	} catch (error) {
		console.error("Error exporting patient labtests:", error);
		res.status(500).json({ message: "Failed to export patient labtests" });
	}
});

export default router;
