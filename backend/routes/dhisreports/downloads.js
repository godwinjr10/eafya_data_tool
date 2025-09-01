import express from "express";
import { pool } from "../../config/database.js";

const router = express.Router();

router.get("/conditions", async (req, res) => {
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
                INNER JOIN reporting.dhis_eafya_mapping_conditions_final e ON CAST(e.eafya_disease_id AS BIGINT) = c.disease_id
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

router.get("/commodities", async (req, res) => {
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
            ON CAST(m.eafya_product_id AS BIGINT) = a.product_id
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

router.get("/labtests", async (req, res) => {
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
            ON CAST(m.eafya_labtest_id AS BIGINT) = t.lab_test_id
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

router.get("/hmis108", async (req, res) => {
	try {
		const { report_month, section } = req.query;

		// If no section specified, return all sections
		if (!section) {
			const allSections = {};

			// Section 1: Census Information
			try {
				let query = `
					SELECT "Report Month", "Wards", "A Cl01. No. of beds", 
						   "B Cl02. No. of admissions", "C Cl03. No. of deaths", 
						   "D Cl04. Patient days", "E Cl05. Average length of stay (E=D/B)", 
						   "F Cl06. Average occupancy (F=D/30 days)", 
						   "G Cl07. Bed occupancy (F/A)x100"
					FROM reporting."108_01_census_information"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE "Report Month" = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY "Wards"`;
				const { rows } = await pool.query(query, params);
				allSections.census = rows;
			} catch (error) {
				console.error("Error fetching census data:", error);
				allSections.census = [];
			}

			// Section 3: Surgical Procedures
			try {
				let query = `
					SELECT "section", code, "procedure", "year", "month", procedure_count
					FROM reporting."108_surgical_procedures"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE "year" = $1 AND "month" = $2`;
					const [year, month] = report_month.match(/(\d{4})(\d{2})/).slice(1);
					params.push(year, month);
				}
				query += ` ORDER BY "section", code`;
				const { rows } = await pool.query(query, params);
				allSections.surgical = rows;
			} catch (error) {
				console.error("Error fetching surgical data:", error);
				allSections.surgical = [];
			}

			// Section 5: Radiology and Imaging
			try {
				let query = `
					SELECT category_name, imaging_name, male_0_4, female_0_4, male_5_plus, female_5_plus
					FROM reporting."108_patient_imaging"
					ORDER BY category_name, imaging_name
				`;
				const { rows } = await pool.query(query);
				allSections.radiology = rows;
			} catch (error) {
				console.error("Error fetching radiology data:", error);
				allSections.radiology = [];
			}

			// Section 6: Admissions Deaths
			try {
				let query = `
					SELECT report_month, diagnosis, disease_id, 
						   "0-4years Male Cases", "0-4years female Cases", 
						   "5years+ Male Cases", "5years+ female Cases", 
						   "0-4years Male Deaths", "0-4years female Deaths", 
						   "5years+ Male Deaths", "5years+ female Deaths"
					FROM reporting."108_admission_death"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY diagnosis`;
				const { rows } = await pool.query(query, params);
				allSections.admissions = rows;
			} catch (error) {
				console.error("Error fetching admissions data:", error);
				allSections.admissions = [];
			}

			// Section 7: Mental Health
			try {
				let query = `
					SELECT report_month, diagnosis, disease_id, 
						   "<5Y Male", "<5Y Female", "5-9Y Male", "5-9Y Female", 
						   "10-19Y Male", "10-19Y Female", "20-34Y Male", "20-34Y Female", 
						   "35-59Y Male", "35-59Y Female", "60+Y Male", "60+Y Female"
					FROM reporting."108_mental_health"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY diagnosis`;
				const { rows } = await pool.query(query, params);
				allSections.mentalHealth = rows;
			} catch (error) {
				console.error("Error fetching mental health data:", error);
				allSections.mentalHealth = [];
			}

			// Section 8: Neonatal Services
			try {
				let query = `
					SELECT report_month, 
						   "Cases 0-7 days Total", "Cases 0-7 days <2.5kg", 
						   "Cases 8-28 days Total", "Cases 8-28 days <2.5kg", 
						   "Deaths 0-7 days Total", "Deaths 0-7 days <2.5kg", 
						   "Deaths 8-28 days Total", "Deaths 8-28 days <2.5kg"
					FROM reporting."108_neonatal_services"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				const { rows } = await pool.query(query, params);
				allSections.neonatal = rows;
			} catch (error) {
				console.error("Error fetching neonatal data:", error);
				allSections.neonatal = [];
			}

			// Section 9: Maternal Conditions
			try {
				let query = `
					SELECT report_month, disease_id, 
						   "Cases Below 15 Years", "Cases 15-19 Years", 
						   "Cases 20-24 Years", "Cases 25-49 Years", "Cases 50+ Years", 
						   "Deaths Below 15 Years", "Deaths 15-19 Years", 
						   "Deaths 20-24 Years", "Deaths 25-49 Years", "Deaths 50+ Years"
					FROM reporting."108_maternal_conditions"
				`;
				let params = [];
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY disease_id`;
				const { rows } = await pool.query(query, params);
				allSections.maternal = rows;
			} catch (error) {
				console.error("Error fetching maternal data:", error);
				allSections.maternal = [];
			}

			res.json(allSections);
			return;
		}

		// Single section logic (existing code)
		let query;
		let params = [];

		switch (section) {
			case "1": // Census Information
				query = `
					SELECT "Report Month", "Wards", "A Cl01. No. of beds", 
						   "B Cl02. No. of admissions", "C Cl03. No. of deaths", 
						   "D Cl04. Patient days", "E Cl05. Average length of stay (E=D/B)", 
						   "F Cl06. Average occupancy (F=D/30 days)", 
						   "G Cl07. Bed occupancy (F/A)x100"
					FROM reporting."108_01_census_information"
				`;
				if (report_month) {
					query += ` WHERE "Report Month" = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY "Wards"`;
				break;

			case "3": // Surgical Procedures
				query = `
					SELECT "section", code, "procedure", "year", "month", procedure_count
					FROM reporting."108_surgical_procedures"
				`;
				if (report_month) {
					query += ` WHERE "year" = $1 AND "month" = $2`;
					const [year, month] = report_month.match(/(\d{4})(\d{2})/).slice(1);
					params.push(year, month);
				}
				query += ` ORDER BY "section", code`;
				break;

			case "5": // Radiology and Imaging
				query = `
					SELECT category_name, imaging_name, male_0_4, female_0_4, male_5_plus, female_5_plus
					FROM reporting."108_patient_imaging"
					ORDER BY category_name, imaging_name
				`;
				break;

			case "6": // Admissions Deaths
				query = `
					SELECT report_month, diagnosis, disease_id, 
						   "0-4years Male Cases", "0-4years female Cases", 
						   "5years+ Male Cases", "5years+ female Cases", 
						   "0-4years Male Deaths", "0-4years female Deaths", 
						   "5years+ Male Deaths", "5years+ female Deaths"
					FROM reporting."108_admission_death"
				`;
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY diagnosis`;
				break;

			case "7": // Mental Health
				query = `
					SELECT report_month, diagnosis, disease_id, 
						   "<5Y Male", "<5Y Female", "5-9Y Male", "5-9Y Female", 
						   "10-19Y Male", "10-19Y Female", "20-34Y Male", "20-34Y Female", 
						   "35-59Y Male", "35-59Y Female", "60+Y Male", "60+Y Female"
					FROM reporting."108_mental_health"
				`;
				if (report_month) {
					query += ` WHERE report_month = $1`;
					params.push(report_month);
				}
				query += ` ORDER BY diagnosis`;
				break;

			default:
				return res.status(400).json({ message: "Invalid section" });
		}

		const { rows } = await pool.query(query, params);
		res.json(rows);
	} catch (error) {
		console.error("HMIS 108 download error:", error);
		res.status(500).json({ message: error.message });
	}
});

export default router;
