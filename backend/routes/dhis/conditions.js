import axios from 'axios';
import { pool } from '../../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const dhis2Auth = {
    username: process.env.DHIS2_USERNAME,
    password: process.env.DHIS2_PASSWORD
};

const ORG_UNIT = 'h40pKp93Mtc';
const DATA_SET = 'RtEYsASU7PG';
const ATTRIBUTE_OPTION_COMBO = 'Lf2Axb9E6B4';
const REPORTING_PERIOD = '202505';

const fetchStructuredDataQuery = `
    SELECT
        t.report_month AS period,
        t.data_element_id AS dataElement,
        t.category_optioncombo_id AS categoryOptionCombo,
         COALESCE(
            CASE
                WHEN category_optioncombo_name = '0-28Dys, Male' THEN t."0_28d_male"
                WHEN category_optioncombo_name = '0-28Dys, Female' THEN t."0_28d_female"
                WHEN category_optioncombo_name = '29Dys-4Yrs, Male' THEN t."29d_4y_male"
                WHEN category_optioncombo_name = '29Dys-4Yrs, Female' THEN t."29d_4y_female"
                WHEN category_optioncombo_name = '5-9Yrs, Male' THEN t."5_9y_male"
                WHEN category_optioncombo_name = '5-9Yrs, Female' THEN t."5_9y_female"
                WHEN category_optioncombo_name = '10-19Yrs, Male' THEN t."10_19y_male"
                WHEN category_optioncombo_name = '10-19Yrs, Female' THEN t."10_19y_female"
                WHEN category_optioncombo_name = '20+Yrs, Male' THEN t."20y_plus_male"
                WHEN category_optioncombo_name = '20+Yrs, Female' THEN t."20y_plus_female"
            END,
            0
        ) AS value
    FROM reporting.conditions_push t
    WHERE t.report_month = '${REPORTING_PERIOD}'
`;

export async function fetchStructuredData() {
    const { rows } = await pool.query(fetchStructuredDataQuery);
    return rows;
}

export async function pushToDHIS2() {
    try {
        const rows = await fetchStructuredData();
        if (!rows || rows.length === 0) {
            throw new Error('No data found to push to DHIS2');
        }

        // Format data for DHIS2
        const dataValues = [];
        for (const row of rows) {
            // Always push a value, using 0 if no value exists
            dataValues.push({
                dataElement: row.dataelement,
                value: parseInt(row.value) || 0,  // Convert to number or use 0 if null/undefined/NaN
                categoryOptionCombo: row.categoryoptioncombo
            });
        }


        // Ensure DHIS2 base URL is properly formatted
        const baseUrl = process.env.DHIS2_BASE_URL?.trim();
        if (!baseUrl) {
            throw new Error('DHIS2_BASE_URL is not configured');
        }

        // Construct the full URL, ensuring no double slashes
        const apiUrl = `${baseUrl.replace(/\/+$/, '')}/dataValueSets`;
        
        const dataValueSet = {
            dataSet: DATA_SET,
            period: REPORTING_PERIOD,
            orgUnit: ORG_UNIT,
            attributeOptionCombo: ATTRIBUTE_OPTION_COMBO,
            dataValues: dataValues
        };

        // Log the final payload for verification
        console.log('Final DHIS2 payload:', JSON.stringify(dataValueSet, null, 2));
        console.log('Posting to DHIS2 URL:', apiUrl);

        try {

            const response = await axios.post(
                apiUrl,
                dataValueSet,
                {
                    auth: dhis2Auth,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            
            console.log(`✅ Posted data for period ${REPORTING_PERIOD}:`, response.data.status);
            return {
                status: 'success',
                summary: {
                    total: rows.length,
                    successful: rows.length,
                    failed: 0
                },
                successDetails: [{
                    period: REPORTING_PERIOD,
                    orgUnit: ORG_UNIT,
                    status: response.data.status
                }],
                failureDetails: []
            };
        } catch (err) {
            // Enhanced error logging
            console.error('❌ DHIS2 API Error Details:');
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Status:', err.response.status);
                console.error('Headers:', err.response.headers);
                console.error('Data:', err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                console.error('No response received:', err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', err.message);
            }

            const errorMessage = err.response?.data?.message || 
                               err.response?.data || 
                               err.message;

            console.error(`❌ Failed to post data for period ${REPORTING_PERIOD}:`, errorMessage);
            
            return {
                status: 'error',
                summary: {
                    total: rows.length,
                    successful: 0,
                    failed: rows.length
                },
                successDetails: [],
                failureDetails: [{
                    period: REPORTING_PERIOD,
                    orgUnit: ORG_UNIT,
                    error: errorMessage
                }]
            };
        }
    } catch (error) {
        console.error('❌ DHIS2 Push Failed:', error.message);
        throw error;
    }
}
