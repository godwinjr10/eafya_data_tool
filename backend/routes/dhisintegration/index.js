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
        const result = await pushConditionsToDHIS2('RtEYsASU7PG', period);

        const result2 = await pushHmis10502ToDHIS2('ic1BSWhGOso', period);

        const result3 = await pushHmis10506ToDHIS2('VDhwrW9DiC1', period);

        const result4 = await pushHmis10510ToDHIS2('quMWqLxzcfO', period);


        if (result.status === 'success' && result2.status === 'success' && result3.status === 'success' && result4.status === 'success' ) {
            res.json({
                status: 'success',
                message: '✅ All data pushed to DHIS2 successfully',
                details: {
                    ...result.summary,
                    successfulPeriods: result.successDetails.map(d => d.period)
                }
            });
        } else {
                    // Partial success
            if (result.status === 'success') {
                res.json({
                    status: 'success',
                    message: '✅ All data pushed to DHIS2 successfully',
                    details: {
                        ...result.summary,
                        successfulPeriods: result.successDetails.map(d => d.period)
                    }
                });
            }
            res.status(207).json({
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
        }
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