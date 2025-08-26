import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
	console.log("conditions");
	try {
		const { report_month, section_id } = req.query;

		if (!section_id) {
			return res
				.status(400)
				.json({ message: "section_id is required" });
		}

		let query = `
        SELECT
            c.report_month,
            e.section_id,
            e.section_name,
            e.eafya_hmis_id,
            m.hmis_code,
            m.hmis_name,
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
        INNER JOIN reporting.hmis_eafya_mapping m ON m.eafya_disease_id = c.disease_id
        INNER JOIN reporting.dhis_eafya_mapping_conditions e ON e.section_id = $1 AND CAST(e.eafya_hmis_id AS int) = m.hmis_code
        WHERE 1=1`;

		const params = [section_id];

		if (report_month) {
			query += ` AND c.report_month = $2`;
			params.push(report_month);
		}

		query += ` GROUP BY c.report_month, e.section_id, e.section_name, e.eafya_hmis_id, m.hmis_code, m.hmis_name`;

		query += ` ORDER BY c.report_month, m.hmis_name`;

		console.log("Final Query:", query);
		console.log("Parameters:", params);

		const { rows } = await pool.query(query, params);
		console.log("Query Results:", rows);

		// If no results, let's run a diagnostic query
		if (rows.length === 0) {
			console.log("No results found. Running diagnostic query...");

			const diagnosticQuery = `
            SELECT 
                '105_01_conditions' as table_name,
                COUNT(*) as total_rows,
                COUNT(DISTINCT disease_id) as unique_diseases,
                COUNT(DISTINCT report_month) as unique_months
            FROM reporting."105_01_conditions"
            UNION ALL
            SELECT 
                'hmis_eafya_mapping' as table_name,
                COUNT(*) as total_rows,
                COUNT(DISTINCT eafya_disease_id) as unique_diseases,
                COUNT(DISTINCT hmis_code) as unique_hmis_codes
            FROM reporting.hmis_eafya_mapping
            UNION ALL
            SELECT 
                'dhis_eafya_mapping_conditions' as table_name,
                COUNT(*) as total_rows,
                COUNT(DISTINCT section_id) as unique_sections,
                COUNT(DISTINCT eafya_hmis_id) as unique_eafya_ids
            FROM reporting.dhis_eafya_mapping_conditions
            WHERE section_id = $1`;

			const diagnosticResult = await pool.query(diagnosticQuery, [
				section_id,
			]);
			console.log("Diagnostic Results:", diagnosticResult.rows);

			// Let's also check a sample of actual data
			const sampleQuery = `
            SELECT 
                c.disease_id,
                c."0-28d Male",
                c."0-28d Female",
                c.report_month,
                m.hmis_code,
                m.hmis_name,
                e.section_id,
                e.eafya_hmis_id
            FROM reporting."105_01_conditions" c
            LEFT JOIN reporting.hmis_eafya_mapping m ON m.eafya_disease_id = c.disease_id
            LEFT JOIN reporting.dhis_eafya_mapping_conditions e ON CAST(e.eafya_hmis_id AS int) = m.hmis_code
            WHERE c.report_month = COALESCE($2, c.report_month)
            LIMIT 5`;

			const sampleResult = await pool.query(sampleQuery, [
				section_id,
				report_month,
			]);
			console.log("Sample Data:", sampleResult.rows);
		}

		res.json(rows);
	} catch (error) {
		console.error("Query error:", error);
		res.status(500).json({ message: error.message });
	}
});

export default router;
