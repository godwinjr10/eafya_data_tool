import axios from "axios";
import { pool } from "../../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const dhis2Auth = {
  username: process.env.DHIS2_USERNAME,
  password: process.env.DHIS2_PASSWORD,
};

//const ORG_UNIT = 'h40pKp93Mtc'; nagguru
//const ORG_UNIT = "vX6kcAwvaS0";
const ORG_UNIT = "TjEiAVNTIFy"
const ATTRIBUTE_OPTION_COMBO = "Lf2Axb9E6B4";

const fetchStructuredDataQuery = (period) => `
WITH c_agg AS (
    SELECT 
        h.hmis_code,
        c.report_month,
        SUM(COALESCE(c."0-28d Male",0))   AS m_0_28d_male,
        SUM(COALESCE(c."0-28d Female",0)) AS m_0_28d_female,
        SUM(COALESCE(c."29d-4y Male",0))  AS m_29d_4y_male,
        SUM(COALESCE(c."29d-4y Female",0))AS m_29d_4y_female,
        SUM(COALESCE(c."5-9y Male",0))    AS m_5_9y_male,
        SUM(COALESCE(c."5-9y Female",0))  AS m_5_9y_female,
        SUM(COALESCE(c."10-19y Male",0))  AS m_10_19y_male,
        SUM(COALESCE(c."10-19y Female",0))AS m_10_19y_female,
        SUM(COALESCE(c."20y+ Male",0))    AS m_20y_plus_male,
        SUM(COALESCE(c."20y+ Female",0))  AS m_20y_plus_female
    FROM reporting."105_01_conditions" c
    LEFT JOIN reporting.hmis_eafya_conditions_mapping h 
           ON h.disease_id = c.disease_id
    WHERE c.report_month = '${period}'
    GROUP BY h.hmis_code, c.report_month
)
SELECT 
    c_agg.report_month,
    m.section_id,
    m.section_name,
    m.hmis_code,
    m.hmis_name,
    m.dataelement AS data_element_id,
    d.categoryoptioncombo, 
    COALESCE(
        CASE d.categoryoptioncombo
            WHEN 'zh2zAaHyYQx' THEN c_agg.m_0_28d_male
            WHEN 'wDiX34aiw6i' THEN c_agg.m_0_28d_female
            WHEN 'V2OuNTRI6ua' THEN c_agg.m_29d_4y_male
            WHEN 'huBy3W5qiD2' THEN c_agg.m_29d_4y_female
            WHEN 'F1rms8f9I9a' THEN c_agg.m_5_9y_male
            WHEN 'Crc5reUlspd' THEN c_agg.m_5_9y_female
            WHEN 'c7gvocRdg0f' THEN c_agg.m_10_19y_male
            WHEN 'u3CkZqMHfHP' THEN c_agg.m_10_19y_female
            WHEN 'dCKzhhINakS' THEN c_agg.m_20y_plus_male
            WHEN 'XVHTeecEOM3' THEN c_agg.m_20y_plus_female
        END,
    0) AS value
FROM reporting.dataelements_conditions m
LEFT JOIN c_agg ON c_agg.hmis_code = m.hmis_code
LEFT JOIN reporting.dhis2_dataelements_1051 d ON d.dataelement = m.dataelement
ORDER BY string_to_array(m.section_id, '.')::int[], m.hmis_code`;

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
    const baseUrl = process.env.DHIS2_BASE_URL?.trim();
    if (!baseUrl) {
      throw new Error("DHIS2_BASE_URL is not configured");
    }

    // Construct the full URL, ensuring no double slashes
    const apiUrl = `${baseUrl.replace(/\/+$/, "")}/dataValueSets`;

    const dataValueSet = {
      dataSet: dataset,
      period: period,
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
