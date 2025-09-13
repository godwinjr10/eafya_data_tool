import axios from "axios";
import { pool } from "../../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const dhis2Auth = {
  username: process.env.ACTIVE_UA1_DHIS2_USERNAME,
  password: process.env.ACTIVE_UA1_DHIS2_PASSWORD,
};

//const ORG_UNIT = 'h40pKp93Mtc'; nagguru
const ORG_UNIT = "h40pKp93Mtc";
const ATTRIBUTE_OPTION_COMBO = "Lf2Axb9E6B4";

const fetchStructuredDataQuery = (period) => `
WITH all_data AS (
    -- Lab Tests Done (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.total_cases, 0)) AS value,
        'lab_tests_done' as section_type
    FROM reporting."105_10_labtests_done" c
    JOIN reporting.dhis_eafya_mapping_labtests d ON d.eafya_labtest_id = c.lab_test_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name

    UNION ALL

    -- Lab Tests Positive Cases (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.positive_cases, 0)) AS value,
        'lab_tests_positive' as section_type
    FROM reporting."105_10_labtests_done" c
    JOIN reporting.dhis_eafya_mapping_labtests d ON d.eafya_labtest_id = c.lab_test_id
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name

    UNION ALL

    -- Lab Tests Visits - Out Patient (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.lv01_out_patient_opd, 0)) AS value,
        'lab_visits_opd' as section_type
    FROM reporting."105_10_labtests_visits" c
    JOIN reporting.dhis_eafya_mapping_labtests d ON d.hmis_code = 'LV01'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name

    UNION ALL

    -- Lab Tests Visits - In Patient (uses dhis2_data_element_id)
    SELECT 
        c.report_month,
        d.dhis2_data_element_id as data_element_id,
        s.dataelement_name,
        'default' as optioncombo_name,
        'HllvX50cXC0' as categoryoptioncombo,
        SUM(COALESCE(c.lv02_in_patient_ipd, 0)) AS value,
        'lab_visits_ipd' as section_type
    FROM reporting."105_10_labtests_visits" c
    JOIN reporting.dhis_eafya_mapping_labtests d ON d.hmis_code = 'LV02'
    JOIN reporting.dhis_datasets_elements s ON s.dataelement_id = d.dhis2_data_element_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, d.dhis2_data_element_id, s.dataelement_name
)
SELECT 
    report_month,
    data_element_id,
    dataelement_name,
    optioncombo_name,
    categoryoptioncombo,
    SUM(value) AS value
FROM all_data
WHERE value > 0
GROUP BY report_month, data_element_id, dataelement_name, optioncombo_name, categoryoptioncombo
ORDER BY report_month, data_element_id, optioncombo_name
`;

export async function fetchStructuredData(period) {
  const { rows } = await pool.query(fetchStructuredDataQuery(period));
  return rows;
}

export async function pushToDHIS2(dataset, period) {
  try {
    const rows = await fetchStructuredData(period);
    if (!rows || rows.length === 0) {
      throw new Error("No data found to push to DHIS2");
    }

    // Format data for DHIS2
    const dataValues = [];
    for (const row of rows) {
      dataValues.push({
        dataElement: row.data_element_id,
        value: parseInt(row.value) || 0,
        categoryOptionCombo: row.categoryoptioncombo,
      });
    }

    // Ensure DHIS2 base URL is properly formatted
    const baseUrl = process.env.ACTIVE_DHIS2_URL?.trim();
    if (!baseUrl) {
      throw new Error("ACTIVE_DHIS2_URL is not configured");
    }

    // Construct the full URL, ensuring no double slashes
    const apiUrl = `${baseUrl.replace(/\/+$/, "")}/dataValueSets`;

    const dataValueSet = {
      dataSet: dataset,
      // period: period,
      period: "202507",
      orgUnit: ORG_UNIT,
      attributeOptionCombo: ATTRIBUTE_OPTION_COMBO,
      dataValues: dataValues,
    };

    // Log the final payload for verification
    console.log("Final DHIS2 payload:", JSON.stringify(dataValueSet, null, 2));
    console.log("Posting to DHIS2 URL:", apiUrl);

    try {
      const response = await axios.post(apiUrl, dataValueSet, {
        auth: dhis2Auth,
        headers: { "Content-Type": "application/json" },
      });

      console.log(`✅ Posted data for period ${period}:`, response.data.status);
      return {
        status: "success",
        summary: {
          total: rows.length,
          successful: rows.length,
          failed: 0,
        },
        successDetails: [
          {
            period: period,
            orgUnit: ORG_UNIT,
            status: response.data.status,
          },
        ],
        failureDetails: [],
      };
    } catch (err) {
      // Enhanced error logging
      console.error("❌ DHIS2 API Error Details:");
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data:", err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
      }

      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message;

      // console.error(`❌ Failed to post data for period ${REPORTING_PERIOD}:`, errorMessage);

      return {
        status: "error",
        summary: {
          total: rows.length,
          successful: 0,
          failed: rows.length,
        },
        successDetails: [],
        failureDetails: [
          {
            period: period,
            orgUnit: ORG_UNIT,
            error: errorMessage,
          },
        ],
      };
    }
  } catch (error) {
    console.error("❌ DHIS2 Push Failed:", error.message);
    throw error;
  }
}
