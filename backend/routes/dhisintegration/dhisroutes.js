import express from 'express';
import { pushToDHIS2 as pushConditionsToDHIS2 } from './conditions.js';
import { pushToDHIS2 as pushCommoditiesToDHIS2 } from './commodities.js';

const router = express.Router();

router.post('/sync', async (req, res) => {
    try {
        const { dataset, period } = req.body;
        if (!dataset || !period) {
            throw new Error('Dataset and period are required');
        }
        const result = await pushConditionsToDHIS2(dataset, period);
        
        if (result.status === 'success') {
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

router.post('/commodities/sync', async (req, res) => {
    try {
        const { dataset, period } = req.body;
        if (!dataset || !period) {
            throw new Error('Dataset and period are required');
        }
        const result = await pushCommoditiesToDHIS2(dataset, period);
        
        if (result.status === 'success') {
            res.json({
                status: 'success',
                message: '✅ All commodities data pushed to DHIS2 successfully',
                details: {
                    ...result.summary,
                    successfulPeriods: result.successDetails.map(d => d.period)
                }
            });
        } else if (result.status === 'partial') {
            // Partial success
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
                }))
            });
        } else {
            // Error
            res.status(500).json({
                status: 'error',
                message: '❌ Failed to push commodities data to DHIS2',
                details: {
                    ...result.summary,
                    failedPeriods: result.failureDetails.map(d => d.period)
                },
                errors: result.failureDetails.map(d => ({
                    period: d.period,
                    error: d.error
                }))
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

export default router;