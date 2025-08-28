import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/totals', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            "indicator", 
            value
        FROM reporting."105_02_maternity_totals"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/deliveries', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            below_15_years, 
            "15-19_years", 
            "20-24_years", 
            "25-49_years", 
            "50+_years"
        FROM reporting."105_02_maternity_deliveries"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/livebirths', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            total_births, 
            births_under_2_5kgs
        FROM reporting."105_02_maternity_livebirths"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/deaths', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            under_15_years, 
            "15_to_19_years", 
            "20_to_24_years", 
            "25_to_49_years", 
            "50_plus_years"
        FROM reporting."105_02_maternity_maternal_deaths"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/uterotonics', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            oxytocin, 
            misoprostol, 
            carbetocin, 
            ergometrine
        FROM reporting."105_02_maternity_uterotonics"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/uter_treatment', async (req, res) => {
    try {
        const { report_month } = req.query;

        let query = `
        SELECT 
            report_month, 
            hmis_code, 
            oxytocin, 
            misoprostol, 
            tranexamic_acid, 
            ergometrine
        FROM reporting."105_02_maternity_utero_treatment"
        WHERE report_month = $1`;

        const params = [report_month];

        query += ` ORDER BY hmis_code`;

        const { rows } = await pool.query(query, params);
        console.log('Query Results:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;