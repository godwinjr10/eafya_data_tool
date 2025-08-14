import express from "express";
import { pool } from "../config/database.js";
import axios from "axios";

const router = express.Router();

// DHIS2 Configuration - Add these to your environment variables
const DHIS2_CONFIG = {
  baseURL: process.env.DHIS2_BASE_URL || "https://your-dhis2-instance.org/api",
  username: process.env.DHIS2_USERNAME || "your-username",
  password: process.env.DHIS2_PASSWORD || "your-password",
};

// Create axios instance for DHIS2 API
const dhis2Api = axios.create({
  baseURL: DHIS2_CONFIG.baseURL,
  auth: {
    username: DHIS2_CONFIG.username,
    password: DHIS2_CONFIG.password,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

// Mapping between materialized view columns and DHIS2 data elements
const ATTENDANCE_COLUMN_MAPPING = {
  "0-28d Male": {
    dataElement: "ATTENDANCE_0_28_MALE",
    categoryOptionCombo: "DEFAULT",
  },
  "0-28d Female": {
    dataElement: "ATTENDANCE_0_28_FEMALE",
    categoryOptionCombo: "DEFAULT",
  },
  "29d-4y Male": {
    dataElement: "ATTENDANCE_29D_4Y_MALE",
    categoryOptionCombo: "DEFAULT",
  },
  "29d-4y Female": {
    dataElement: "ATTENDANCE_29D_4Y_FEMALE",
    categoryOptionCombo: "DEFAULT",
  },
  "5-9y Male": {
    dataElement: "ATTENDANCE_5_9_MALE",
    categoryOptionCombo: "DEFAULT",
  },
  "5-9y Female": {
    dataElement: "ATTENDANCE_5_9_FEMALE",
    categoryOptionCombo: "DEFAULT",
  },
  "10-19y Male": {
    dataElement: "ATTENDANCE_10_19_MALE",
    categoryOptionCombo: "DEFAULT",
  },
  "10-19y Female": {
    dataElement: "ATTENDANCE_10_19_FEMALE",
    categoryOptionCombo: "DEFAULT",
  },
  "20y+ Male": {
    dataElement: "ATTENDANCE_20_PLUS_MALE",
    categoryOptionCombo: "DEFAULT",
  },
  "20y+ Female": {
    dataElement: "ATTENDANCE_20_PLUS_FEMALE",
    categoryOptionCombo: "DEFAULT",
  },
};

// Helper function to get DHIS2 mapping for a condition
async function getDhis2MappingForCondition(diseaseId) {
  try {
    const query = `
            SELECT 
                dem.data_element_id,
                dem.category_optioncombo_id,
                dem.category_optioncombo_name
            FROM reporting.dhis_eafya_mapping dem
            WHERE dem.eafya_id = $1
        `;
    const { rows } = await pool.query(query, [diseaseId]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting DHIS2 mapping:", error);
    return null;
  }
}

// Helper function to format period for DHIS2
function formatPeriodForDhis2(reportMonth) {
  // Convert YYYYMM to YYYYMM format for DHIS2
  return reportMonth;
}

// Get attendance data for DHIS2 push
router.get("/attendance/:month", async (req, res) => {
  try {
    const { month } = req.params;

    const query = `
            SELECT * FROM reporting."105_01_attendance"
            WHERE report_month = $1
        `;

    const { rows } = await pool.query(query, [month]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance data found for the specified month",
      });
    }

    const attendanceData = rows[0];
    const dataValues = [];

    // Transform attendance data to DHIS2 format
    Object.keys(ATTENDANCE_COLUMN_MAPPING).forEach((column) => {
      if (
        attendanceData[column] !== null &&
        attendanceData[column] !== undefined
      ) {
        const mapping = ATTENDANCE_COLUMN_MAPPING[column];
        dataValues.push({
          dataElement: mapping.dataElement,
          categoryOptionCombo: mapping.categoryOptionCombo,
          value: attendanceData[column].toString(),
          period: formatPeriodForDhis2(attendanceData.report_month),
        });
      }
    });

    res.json({
      success: true,
      dataValues,
      summary: {
        month: attendanceData.report_month,
        totalDataValues: dataValues.length,
      },
    });
  } catch (error) {
    console.error("Error getting attendance data:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get conditions data for DHIS2 push
router.get("/conditions/:month", async (req, res) => {
  try {
    const { month } = req.params;

    const query = `
            SELECT * FROM reporting."105_01_conditions"
            WHERE report_month = $1
        `;

    const { rows } = await pool.query(query, [month]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No conditions data found for the specified month",
      });
    }

    const dataValues = [];

    // Process each condition row
    for (const row of rows) {
      // Get DHIS2 mapping for this disease
      const mapping = await getDhis2MappingForCondition(row.disease_id);

      if (!mapping) {
        console.warn(
          `No DHIS2 mapping found for disease_id: ${row.disease_id}`
        );
        continue;
      }

      // Transform each age/gender column to DHIS2 format
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

      ageGenderColumns.forEach((column) => {
        if (
          row[column] !== null &&
          row[column] !== undefined &&
          row[column] > 0
        ) {
          dataValues.push({
            dataElement: mapping.data_element_id,
            categoryOptionCombo: mapping.category_optioncombo_id,
            value: row[column].toString(),
            period: formatPeriodForDhis2(row.report_month),
            // Add additional metadata
            comment: `Disease: ${row.disease_id}, Age/Gender: ${column}`,
          });
        }
      });
    }

    res.json({
      success: true,
      dataValues,
      summary: {
        month: month,
        totalConditions: rows.length,
        totalDataValues: dataValues.length,
      },
    });
  } catch (error) {
    console.error("Error getting conditions data:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Push data to DHIS2
router.post("/push/:datasetId/:month", async (req, res) => {
  try {
    const { datasetId, month } = req.params;
    const { orgUnit, dryRun = false } = req.body;

    if (!orgUnit) {
      return res.status(400).json({
        success: false,
        message: "orgUnit is required",
      });
    }

    console.log(
      `Starting DHIS2 push for dataset: ${datasetId}, month: ${month}`
    );

    // Collect all data values
    let allDataValues = [];

    // Get attendance data
    try {
      const attendanceResponse = await axios.get(
        `http://localhost:3001/api/dhis2/attendance/${month}`
      );
      if (attendanceResponse.data.success) {
        allDataValues = allDataValues.concat(
          attendanceResponse.data.dataValues
        );
      }
    } catch (error) {
      console.warn("No attendance data found:", error.message);
    }

    // Get conditions data
    try {
      const conditionsResponse = await axios.get(
        `http://localhost:3001/api/dhis2/conditions/${month}`
      );
      if (conditionsResponse.data.success) {
        allDataValues = allDataValues.concat(
          conditionsResponse.data.dataValues
        );
      }
    } catch (error) {
      console.warn("No conditions data found:", error.message);
    }

    if (allDataValues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found to push for the specified month",
      });
    }

    // Add orgUnit to all data values
    allDataValues = allDataValues.map((dv) => ({
      ...dv,
      orgUnit: orgUnit,
    }));

    const dhis2Payload = {
      dataValues: allDataValues,
    };

    console.log(`Prepared ${allDataValues.length} data values for DHIS2`);

    if (dryRun) {
      return res.json({
        success: true,
        message: "Dry run completed successfully",
        payload: dhis2Payload,
        summary: {
          totalDataValues: allDataValues.length,
          datasetId,
          month,
          orgUnit,
        },
      });
    }

    // Push to DHIS2
    const dhis2Response = await dhis2Api.post("/dataValueSets", dhis2Payload);

    // Log the push to database
    const logQuery = `
            INSERT INTO reporting.dhis2_push_log 
            (dataset_id, org_unit, period, data_values_count, status, response, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `;

    try {
      await pool.query(logQuery, [
        datasetId,
        orgUnit,
        month,
        allDataValues.length,
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
        totalDataValues: allDataValues.length,
        datasetId,
        month,
        orgUnit,
      },
    });
  } catch (error) {
    console.error("Error pushing to DHIS2:", error);

    // Log the error to database
    const errorLogQuery = `
            INSERT INTO reporting.dhis2_push_log 
            (dataset_id, org_unit, period, data_values_count, status, error_message, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `;

    try {
      await pool.query(errorLogQuery, [
        req.params.datasetId,
        req.body.orgUnit || "unknown",
        req.params.month,
        0,
        "error",
        error.message,
      ]);
    } catch (logError) {
      console.warn("Failed to log error to database:", logError.message);
    }

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

// Get push history
router.get("/push-history", async (req, res) => {
  try {
    const query = `
            SELECT 
                id,
                dataset_id,
                org_unit,
                period,
                data_values_count,
                status,
                error_message,
                created_at
            FROM reporting.dhis2_push_log
            ORDER BY created_at DESC
            LIMIT 50
        `;

    const { rows } = await pool.query(query);

    res.json({
      success: true,
      history: rows,
    });
  } catch (error) {
    console.error("Error getting push history:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test DHIS2 connection
router.get("/test-connection", async (req, res) => {
  try {
    const response = await dhis2Api.get("/me");
    res.json({
      success: true,
      message: "DHIS2 connection successful",
      user: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "DHIS2 connection failed",
      error: error.message,
    });
  }
});

export default router;
