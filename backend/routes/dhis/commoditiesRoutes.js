import express from 'express';
import { pushToDHIS2 } from './commodities.js';

const router = express.Router();

/**
 * @route POST /api/dhis2/commodities/sync
 * @description Push commodities data to DHIS2 for a specific period
 * @access Private
 */
router.post('/', async (req, res) => {
    try {
        const { dataset, period } = req.body;
        
        // Validate required fields
        if (!dataset || !period) {
            return res.status(400).json({
                status: 'error',
                message: 'Dataset and period are required fields',
                timestamp: new Date().toISOString()
            });
        }

        // Validate period format (YYYYMM)
        const periodRegex = /^(20)\d{4}$/;
        if (!periodRegex.test(period)) {
            return res.status(400).json({
                status: 'error',
                message: 'Period must be in YYYYMM format (e.g., 202401)',
                timestamp: new Date().toISOString()
            });
        }

        const result = await pushToDHIS2(dataset, period);
        
        if (result.status === 'success') {
            res.json({
                status: 'success',
                message: '✅ All commodities data pushed to DHIS2 successfully',
                details: {
                    ...result.summary,
                    successfulPeriods: result.successDetails.map(d => d.period)
                },
                timestamp: new Date().toISOString()
            });
        } else {
            // Partial success or failure
            res.status(207).json({
                status: 'partial',
                message: '⚠️ Some commodities records failed to push to DHIS2',
                details: {
                    ...result.summary,
                    failedPeriods: result.failureDetails.map(d => d.period),
                    successfulPeriods: result.successDetails.map(d => d.period)
                },
                errors: result.failureDetails.map(d => ({
                    period: d.period,
                    error: d.error
                })),
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('❌ DHIS2 Commodities Sync failed:', error);
        res.status(500).json({
            status: 'error',
            message: '❌ Failed to push commodities data to DHIS2',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * @route GET /api/dhis2/commodities/preview/:period
 * @description Preview commodities data that would be sent to DHIS2 for a specific period
 * @access Private
 */
router.get('/preview/:period', async (req, res) => {
    try {
        const { period } = req.params;
        
        // Validate period format (YYYYMM)
        const periodRegex = /^(20)\d{4}$/;
        if (!periodRegex.test(period)) {
            return res.status(400).json({
                status: 'error',
                message: 'Period must be in YYYYMM format (e.g., 202401)',
                timestamp: new Date().toISOString()
            });
        }

        // Fetch data without pushing to DHIS2
        const { fetchStructuredData } = await import('./commodities.js');
        const data = await fetchStructuredData(period);

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No commodities data found for the specified period',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            status: 'success',
            message: 'Commodities data preview generated successfully',
            data: {
                totalRecords: data.length,
                period: period,
                records: data
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Commodities Preview failed:', error);
        res.status(500).json({
            status: 'error',
            message: '❌ Failed to generate commodities data preview',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;
