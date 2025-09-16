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
					SELECT report_month, procedure, procedure_count
					FROM reporting."108_surgical_procedures"
				`;
        let params = [];
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY report_month, procedure`;
        const { rows } = await pool.query(query, params);
        allSections.surgical = rows;
      } catch (error) {
        console.error("Error fetching surgical data:", error);
        allSections.surgical = [];
      }

      // Section 4: Blood Transfusion (4a summary, 4b by demographics)
      try {
        let query = `
					SELECT report_month, "section", blood_product_type, units_requested, units_received, units_transfused, adverse_reactions, age_group, gender, unit
					FROM reporting."108_blood_transfusion"
				`;
        let params = [];
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY "section", blood_product_type, age_group, gender`;
        const { rows } = await pool.query(query, params);
        allSections.bloodTransfusion = rows;
      } catch (error) {
        console.error("Error fetching blood transfusion data:", error);
        allSections.bloodTransfusion = [];
      }

      // Section 2: Referrals
      try {
        let query = `
					SELECT report_month, "Outgoing Referrals", "Incoming Referrals", "Self Referrals", "Runaway Patients"
					FROM reporting."108_04_referrals"
				`;
        let params = [];
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY report_month`;
        const { rows } = await pool.query(query, params);
        allSections.referrals = rows;
      } catch (error) {
        console.error("Error fetching referrals data:", error);
        allSections.referrals = [];
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

      case "2": // Referrals
        query = `
					SELECT report_month, "Outgoing Referrals", "Incoming Referrals", "Self Referrals", "Runaway Patients"
					FROM reporting."108_04_referrals"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY report_month`;
        break;

      case "3": // Surgical Procedures
        query = `
					SELECT report_month, procedure, procedure_count
					FROM reporting."108_surgical_procedures"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY report_month, procedure`;
        break;

      case "4": // Blood Transfusion (both 4a and 4b)
        query = `
					SELECT report_month, "section", blood_product_type, units_requested, units_received, units_transfused, adverse_reactions, age_group, gender, unit
					FROM reporting."108_blood_transfusion"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY "section", blood_product_type, age_group, gender`;
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

// MCH Report download endpoint
router.get("/mch", async (req, res) => {
  try {
    const { report_month, section } = req.query;

    if (!report_month) {
      return res.status(400).json({ message: "Report month is required" });
    }

    // If no section specified, return all MCH sections
    if (!section) {
      const allSections = {};

      // Get Antenatal data
      const antenatalQuery = `
        SELECT hmis_code, 
               "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"
        FROM reporting."105_02_anc_1"
        WHERE report_month = $1
        ORDER BY hmis_code
      `;
      const antenatalResult = await pool.query(antenatalQuery, [report_month]);
      allSections.antenatal = antenatalResult.rows;

      // Get Postnatal data
      const postnatalQuery = `
        SELECT total_patients, below_15yrs,
               "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"
        FROM reporting.postnatal_attendance
        WHERE report_month = $1
        ORDER BY total_patients
      `;
      const postnatalResult = await pool.query(postnatalQuery, [report_month]);
      allSections.postnatal = postnatalResult.rows;

      // Get Family Planning data
      const fpQuery = `
        SELECT hmis_code, family_planning_name,
               under_15_new, "15_19_new", "20_24_new", "25_49_new", "50_plus_new"
        FROM reporting."105_family_planning_visits"
        WHERE report_month = $1
        ORDER BY hmis_code
      `;
      const fpResult = await pool.query(fpQuery, [report_month]);
      allSections.familyPlanning = fpResult.rows;

      // Get Child Health data
      const childHealthQuery = `
        SELECT vaccine_id, vaccine_name,
               "0-5m Male", "0-5m Female", "6-11m Male", "6-11m Female", 
               "12-59m Male", "12-59m Female", "5-14y Male", "5-14y Female"
        FROM reporting."105_02_child_health"
        WHERE report_month = $1
        ORDER BY vaccine_id
      `;
      const childHealthResult = await pool.query(childHealthQuery, [
        report_month,
      ]);
      allSections.childHealth = childHealthResult.rows;

      // Get Tetanus data
      const tetanusQuery = `
        SELECT vaccine_id as code, vaccine_name as label,
               pregnant, non_pregnant
        FROM reporting."105_02_tetanus_vaccination"
        WHERE report_month = $1
        ORDER BY vaccine_id
      `;
      const tetanusResult = await pool.query(tetanusQuery, [report_month]);
      allSections.tetanus = tetanusResult.rows.map((row) => ({
        code: row.code,
        label: row.label,
        data: {
          pregnant: { Static: row.pregnant || 0 },
          nonPregnant: {
            Static: row.non_pregnant || 0,
            Outreach: 0,
            School: 0,
          },
        },
      }));

      // Get Immunization data
      const immunizationQuery = `
        SELECT vaccine_id as code, vaccine_name as label,
               "Under1y", "1-4y", "5-14y"
        FROM reporting."105_02_child_immunization"
        WHERE report_month = $1
        ORDER BY vaccine_id
      `;
      const immunizationResult = await pool.query(immunizationQuery, [
        report_month,
      ]);
      allSections.immunization = immunizationResult.rows.map((row) => ({
        code: row.code,
        label: row.label,
        data: {
          under1: { static: row["Under1y"] || 0, outreach: 0 },
          "1to4": { static: row["1-4y"] || 0, outreach: 0 },
          "5to14": { static: row["5-14y"] || 0, outreach: 0 },
        },
      }));

      return res.json(allSections);
    }

    let query;
    let params = [];

    switch (section) {
      case "2.1": // Antenatal
        query = `
					SELECT hmis_code, 
						   "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"
					FROM reporting."105_02_anc_1"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY hmis_code`;
        break;

      case "2.3": // Postnatal
        query = `
					SELECT hmis_code, 
						   "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50+yrs"
					FROM reporting.postnatal_attendance
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY hmis_code`;
        break;

      case "2.4.1": // Family Planning
        query = `
					SELECT hmis_code, method_name,
						   "Below_15yrs", "15_19yrs", "20_24yrs", "25_50yrs", "50_plus_revisit"
					FROM reporting."105_family_planning_visits"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY hmis_code`;
        break;

      case "2.6": // Child Health Services
        query = `
					SELECT hmis_code, hmis_name,
						   "0-11m Male", "0-11m Female", "12-23m Male", "12-23m Female", 
						   "24-59m Male", "24-59m Female", "5-14y Male", "5-14y Female"
					FROM reporting."105_02_child_health"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY hmis_code`;
        break;

      case "2.6.2": // Tetanus Vaccination
        query = `
					SELECT vaccine_id as code, vaccine_name as label,
						   pregnant, non_pregnant
					FROM reporting."105_02_tetanus_vaccination"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY vaccine_id`;
        break;

      case "2.6.3": // Child Immunization
        query = `
					SELECT vaccine_id as code, vaccine_name as label,
						   "Under1y", "1-4y", "5-14y"
					FROM reporting."105_02_child_immunization"
				`;
        if (report_month) {
          query += ` WHERE report_month = $1`;
          params.push(report_month);
        }
        query += ` ORDER BY vaccine_id`;
        break;

      default:
        return res.status(400).json({ message: "Invalid section" });
    }

    const { rows } = await pool.query(query, params);

    // Transform data for specific sections that need special formatting
    let transformedData = rows;
    if (section === "2.6.2") {
      // Transform tetanus data to match the expected format
      transformedData = rows.map((row) => ({
        code: row.code,
        label: row.label,
        data: {
          pregnant: { Static: row.pregnant || 0 },
          nonPregnant: {
            Static: row.non_pregnant || 0,
            Outreach: 0,
            School: 0,
          },
        },
      }));
    } else if (section === "2.6.3") {
      // Transform immunization data to match the expected format
      transformedData = rows.map((row) => ({
        code: row.code,
        label: row.label,
        data: {
          under1: { static: row["Under1y"] || 0, outreach: 0 },
          "1to4": { static: row["1-4y"] || 0, outreach: 0 },
          "5to14": { static: row["5-14y"] || 0, outreach: 0 },
        },
      }));
    }

    res.json(transformedData);
  } catch (error) {
    console.error("MCH download error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
