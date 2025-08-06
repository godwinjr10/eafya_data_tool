import express from "express";
import { pool } from "../../config/database.js";
import dhis2Api from "../../config/dhis2.js";

const router = express.Router();

// Helper function to get DHIS2 mapping for a disease/condition
async function getDhis2MappingForDisease(diseaseId) {
  try {
    const query = `
      SELECT 
          data_element_id,
          category_optioncombo_id,
          category_optioncombo_name,
          eafya_name
      FROM reporting.dhis_eafya_mapping 
      WHERE eafya_id = $1 OR eafya_hmis_id = $1
      LIMIT 1
    `;
    const { rows } = await pool.query(query, [diseaseId.toString()]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting DHIS2 mapping:", error);
    return null;
  }
}

// Helper function to format period for DHIS2
function formatPeriodForDhis2(reportMonth) {
  // DHIS2 expects YYYYMM format
  return reportMonth;
}

// Push data to DHIS2
router.post("/push", async (req, res) => {
  try {
    const { orgUnit, period, dryRun = false } = req.body;

    // Validate required parameters
    if (!orgUnit) {
      return res.status(400).json({
        success: false,
        message: "orgUnit is required in request body",
      });
    }

    console.log(
      `Starting DHIS2 push for period: ${period || "all available data"}`
    );

    // Build query with optional period filter
    let query = `
      SELECT
        TO_CHAR(date_created, 'YYYYMM') AS report_month,
        disease_id,
        COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Male' THEN 1 END) AS "0-28d Male",
        COUNT(CASE WHEN age_days BETWEEN 0 AND 28 AND gender = 'Female' THEN 1 END) AS "0-28d Female",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Male' THEN 1 END) AS "29d-4y Male",
        COUNT(CASE WHEN age_days >= 29 AND age_years < 5 AND gender = 'Female' THEN 1 END) AS "29d-4y Female",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Male' THEN 1 END) AS "5-9y Male",
        COUNT(CASE WHEN age_years BETWEEN 5 AND 9 AND gender = 'Female' THEN 1 END) AS "5-9y Female",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Male' THEN 1 END) AS "10-19y Male",
        COUNT(CASE WHEN age_years BETWEEN 10 AND 19 AND gender = 'Female' THEN 1 END) AS "10-19y Female",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Male' THEN 1 END) AS "20y+ Male",
        COUNT(CASE WHEN age_years >= 20 AND gender = 'Female' THEN 1 END) AS "20y+ Female"
      FROM (
        SELECT
          date_created,
          disease_id,
          gender,
          DATE_PART('year', AGE(date_created, birth_date)) AS age_years, 
          (date_created::DATE - birth_date::DATE) AS age_days
        FROM reporting.patient_diagnosis
        ${period ? `WHERE TO_CHAR(date_created, 'YYYYMM') = $1` : ""}
      ) sub
      GROUP BY TO_CHAR(date_created, 'YYYYMM'), disease_id
      HAVING SUM(CASE WHEN age_days >= 0 THEN 1 ELSE 0 END) > 0
      ORDER BY report_month DESC
    `;

    const queryParams = period ? [period] : [];
    const { rows } = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No data found for ${
          period ? `period ${period}` : "any period"
        }`,
      });
    }

    console.log(`Found ${rows.length} disease/period combinations to process`);

    // Transform data to DHIS2 format
    const dataValues = [];
    const unmappedDiseases = new Set();

    for (const row of rows) {
      // Get DHIS2 mapping for this disease
      const mapping = await getDhis2MappingForDisease(row.disease_id);

      if (!mapping) {
        unmappedDiseases.add(row.disease_id);
        console.warn(
          `No DHIS2 mapping found for disease_id: ${row.disease_id}`
        );
        continue;
      }

      // Age/gender columns to process
      const ageGenderColumns = [
        "0-28d Male",
        "0-28d Female",
        "29d-4y Male",
        "29d-4y Female",
        "5-9y Male",
        "5-9y Female",
        "10-19y Male",
        "10-19y Female",
        "20y+ Male",
        "20y+ Female",
      ];

      // Create data values for each age/gender group
      ageGenderColumns.forEach((column) => {
        const value = row[column];
        if (value !== null && value !== undefined && parseInt(value) > 0) {
          dataValues.push({
            dataElement: mapping.data_element_id,
            categoryOptionCombo: mapping.category_optioncombo_id,
            value: value.toString(),
            period: formatPeriodForDhis2(row.report_month),
            orgUnit: orgUnit,
            comment: `Disease: ${
              mapping.eafya_name || row.disease_id
            }, Category: ${column}`,
          });
        }
      });
    }

    if (dataValues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid data values found to push to DHIS2",
        unmappedDiseases: Array.from(unmappedDiseases),
      });
    }

    const dhis2Payload = {
      dataValues: dataValues,
    };

    console.log(`Prepared ${dataValues.length} data values for DHIS2`);

    // If dry run, return the payload without pushing
    if (dryRun) {
      return res.json({
        success: true,
        message: "Dry run completed successfully",
        payload: dhis2Payload,
        summary: {
          totalDataValues: dataValues.length,
          totalDiseases: rows.length,
          unmappedDiseases: Array.from(unmappedDiseases),
          period: period || "all periods",
          orgUnit,
        },
      });
    }

    // Push to DHIS2
    console.log("Pushing data to DHIS2...");
    const dhis2Response = await dhis2Api.post("/dataValueSets", dhis2Payload);

    // Log the successful push to database
    const logQuery = `
      INSERT INTO reporting.dhis2_push_log 
      (dataset_id, org_unit, period, data_values_count, status, response, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

    try {
      await pool.query(logQuery, [
        "CONDITIONS_DATASET", // You might want to make this configurable
        orgUnit,
        period || "ALL_PERIODS",
        dataValues.length,
        "success",
        JSON.stringify(dhis2Response.data),
      ]);
    } catch (logError) {
      console.warn("Failed to log push to database:", logError.message);
    }

    res.json({
      success: true,
      message: "Data successfully pushed to DHIS2",
      dhis2Response: dhis2Response.data,
      summary: {
        totalDataValues: dataValues.length,
        totalDiseases: rows.length,
        unmappedDiseases: Array.from(unmappedDiseases),
        period: period || "all periods",
        orgUnit,
      },
    });
  } catch (error) {
    console.error("Error pushing data to DHIS2:", error);

    // Log the failed push to database
    if (req.body.orgUnit && req.body.period) {
      try {
        const logQuery = `
          INSERT INTO reporting.dhis2_push_log 
          (dataset_id, org_unit, period, data_values_count, status, error_message, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `;
        await pool.query(logQuery, [
          "CONDITIONS_DATASET",
          req.body.orgUnit,
          req.body.period || "ALL_PERIODS",
          0,
          "error",
          error.message,
        ]);
      } catch (logError) {
        console.warn("Failed to log error to database:", logError.message);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error pushing data to DHIS2",
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

export default router;
