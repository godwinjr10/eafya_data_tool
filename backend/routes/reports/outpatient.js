import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

// Get outpatient report data
router.get('/', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({ message: 'Both from_date and to_date are required' });
        }

        const query = `
            SELECT 
                patient_id, 
                birth_date,
                EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date))::integer as age,
                gender, 
                clinic, 
                visit_type_name, 
                disease_name, 
                classification, 
                date_created
            FROM reporting.patient_diagnosis
            WHERE date_created BETWEEN $1 AND $2
            ORDER BY date_created DESC
        `;

        const params = [from_date, to_date];

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/inpatient', async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({ message: 'Both from_date and to_date are required' });
        }

        const query = `
            SELECT 
                e.patient_id, 
                e.gender, 
                a.admission_ward_name,
                a.date_created, 
                a.medical_discharge_date
                FROM reporting.patient_admissions a
                inner join reporting.encounters e on e.encounter_id = a.encounter_id
            WHERE a.date_created BETWEEN $1 AND $2
            ORDER BY a.date_created DESC
        `;

        const params = [from_date, to_date];

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;