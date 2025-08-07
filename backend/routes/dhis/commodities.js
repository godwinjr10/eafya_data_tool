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
        t.report_month AS period,
        t.hmis_name,
        t.dataelement AS dataElement,
        'HllvX50cXC0' AS categoryOptionCombo,
        t.data_element_name,
        COALESCE(
            CASE
                WHEN data_element_name = 'Stock at Hand' THEN t."stock_level"
                WHEN data_element_name = 'Quantity Consumed' THEN t."qty_consumed"
                WHEN data_element_name = 'Days out of stock' THEN t."days_out_of_stock"
                WHEN data_element_name = 'Quantity Expired' THEN t."quantity_expired"
            END,
            0
        ) AS value
    FROM reporting.commodities_push t
    WHERE t.report_month = '${period}'
`;

export async function fetchStructuredData(period) {
    const { rows } = await pool.query(fetchStructuredDataQuery(period));
    return rows;
}

export async function pushToDHIS2(dataset, period) {
    try {
        const rows = await fetchStructuredData(period);
        if (!rows || rows.length === 0) {
            throw new Error('No commodities data found to push to DHIS2');
        }

        // Format data for DHIS2
        const dataValues = [];
        for (const row of rows) {
            dataValues.push({
                dataElement: row.dataelement,
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
        console.log('Final DHIS2 commodities payload:', JSON.stringify(dataValueSet, null, 2));
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
            
            console.log(`✅ Posted commodities data for period ${period}:`, response.data.status);
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
                console.error('Status:', err.response.status);
                console.error('Headers:', err.response.headers);
                console.error('Data:', err.response.data);
            } else if (err.request) {
                console.error('No response received:', err.request);
            } else {
                console.error('Error setting up request:', err.message);
            }

            const errorMessage = err.response?.data?.message || 
                               err.response?.data || 
                               err.message;
            
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
        console.error('❌ DHIS2 Commodities Push Failed:', error.message);
        throw error;
    }
}