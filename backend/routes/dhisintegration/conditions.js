import axios from 'axios';
import { pool } from '../../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const dhis2Auth = {
    username: process.env.DHIS2_USERNAME,
    password: process.env.DHIS2_PASSWORD
};

//const ORG_UNIT = 'h40pKp93Mtc'; nagguru 
const ORG_UNIT = 'vX6kcAwvaS0';
const ATTRIBUTE_OPTION_COMBO = 'Lf2Axb9E6B4';

const fetchStructuredDataQuery = (period) => `
    SELECT
        c.report_month,
        e.dataelement_id,
        d.dataelement_name,
        d.categoryoptioncombo,
        d.optioncombo_name,
        CASE d.categoryoptioncombo
            WHEN 'zh2zAaHyYQx'    THEN SUM(COALESCE(c."0-28d Male", 0))
            WHEN 'wDiX34aiw6i'  THEN SUM(COALESCE(c."0-28d Female", 0))
            WHEN 'V2OuNTRI6ua'   THEN SUM(COALESCE(c."29d-4y Male", 0))
            WHEN 'huBy3W5qiD2' THEN SUM(COALESCE(c."29d-4y Female", 0))
            WHEN 'F1rms8f9I9a'     THEN SUM(COALESCE(c."5-9y Male", 0))
            WHEN 'Crc5reUlspd'   THEN SUM(COALESCE(c."5-9y Female", 0))
            WHEN 'c7gvocRdg0f'   THEN SUM(COALESCE(c."10-19y Male", 0))
            WHEN 'u3CkZqMHfHP' THEN SUM(COALESCE(c."10-19y Female", 0))
            WHEN 'dCKzhhINakS'     THEN SUM(COALESCE(c."20y+ Male", 0))
            WHEN 'XVHTeecEOM3'   THEN SUM(COALESCE(c."20y+ Female", 0))
            ELSE 0
        END AS value
    FROM reporting."105_01_conditions" c
    JOIN reporting.eafya_mappings e ON e.eafya_item_id = c.disease_id
    JOIN reporting.dhis2_1051_dataelements d ON d.dataelement = e.dataelement_id
    WHERE c.report_month = '${period}'
    GROUP BY c.report_month, e.dataelement_id, d.dataelement_name, d.categoryoptioncombo, d.optioncombo_name
    ORDER BY c.report_month, e.dataelement_id, d.categoryoptioncombo
`;

export async function fetchStructuredData(period) {
    const { rows } = await pool.query(fetchStructuredDataQuery(period));
    return rows;
}

export async function pushToDHIS2(dataset, period) {
    try {
        const rows = await fetchStructuredData(period);
        if (!rows || rows.length === 0) {
            throw new Error('No data found to push to DHIS2');
        }

        // Format data for DHIS2
        const dataValues = [];
        for (const row of rows) {
            dataValues.push({
                dataElement: row.dataelement_id,
                value: parseInt(row.value) || 0,  
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
            dataSet: dataset,
            period: period,
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
            
            console.log(`✅ Posted data for period ${period}:`, response.data.status);
            return {
                status: 'success',
                summary: {
                    total: rows.length,
                    successful: rows.length,
                    failed: 0
                },
                successDetails: [{
                    period: period,
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

            // console.error(`❌ Failed to post data for period ${REPORTING_PERIOD}:`, errorMessage);
            
            return {
                status: 'error',
                summary: {
                    total: rows.length,
                    successful: 0,
                    failed: rows.length
                },
                successDetails: [],
                failureDetails: [{
                    period: period,
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
