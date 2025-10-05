import express from 'express';
import { pushToDHIS2 as pushConditionsToDHIS2 } from './conditions.js';
import { pushToDHIS2 as pushHmis10502ToDHIS2 } from './hmis_105_02.js';
import { pushToDHIS2 as pushHmis10506ToDHIS2 } from './hmis_105_06.js';
import { pushToDHIS2 as pushHmis10510ToDHIS2 } from './hmis_105_10.js';

const router = express.Router();

router.post('/sync', async (req, res) => {
    try {
        const { dataset, period } = req.body;
        if (!dataset || !period) {
            throw new Error('Dataset and period are required');
        }
        const baseUrl = process.env.DHIS2_BASE_URL && process.env.DHIS2_BASE_URL.trim();
        if (!baseUrl) {
            throw new Error('DHIS2_BASE_URL is not configured');
        }
        const result = await pushConditionsToDHIS2('RtEYsASU7PG', period);


        if (result.status === 'success') {
            return res.json({
                status: 'success',
                message: '✅ All data pushed to DHIS2 successfully',
                details: {
                    ...result.summary,
                    successfulPeriods: result.successDetails.map(d => d.period)
                }
            });
        }
        return res.status(207).json({
            status: 'partial',
            message: '⚠️ Some records failed to push to DHIS2',
            details: {
                ...result.summary,
                failedPeriods: result.failureDetails.map(d => d.period),
                successfulPeriods: result.successDetails.map(d => d.period)
            },
            errors: result.failureDetails.map(d => ({
                period: d.period,
                error: d.error
            }))
        });
    } catch (error) {
        console.error('❌ DHIS2 Sync failed:', error);
        res.status(500).json({
            status: 'error',
            message: '❌ Failed to push data to DHIS2',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});


export default router;