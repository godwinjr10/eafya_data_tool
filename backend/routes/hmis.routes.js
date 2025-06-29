import express from 'express';
import HMIS from '../models/hmis.model.js';
import { pool } from '../config/database.js';

const router = express.Router();

// Create new HMIS entry
router.post('/', async (req, res) => {
    try {
        const hmisEntry = await HMIS.create(req.body);
        res.status(201).json(hmisEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get HMIS entries by dataset and section (using raw SQL)
router.get('/', async (req, res) => {
    try {
        const { dataSetId, section, facilityId, month, year } = req.query;
        
        let query = `
            SELECT * FROM "HMIS"
            WHERE "dataSetId" = $1
            AND section = $2
            AND "facilityId" = $3
        `;
        
        const params = [dataSetId, parseInt(section), facilityId];

        if (month && year) {
            query += ` AND ("reportingPeriod"->>'month')::int = $4
                      AND ("reportingPeriod"->>'year')::int = $5`;
            params.push(parseInt(month), parseInt(year));
        }

        query += ` ORDER BY ("reportingPeriod"->>'year')::int DESC,
                          ("reportingPeriod"->>'month')::int DESC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get HMIS entry by ID (using Sequelize)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await HMIS.findByPk(id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update HMIS entry (using Sequelize)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            metadata: {
                ...req.body.metadata,
                lastModifiedAt: new Date()
            }
        };

        const [updated] = await HMIS.update(updateData, {
            where: { id },
            returning: true
        });

        if (!updated) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        const updatedEntry = await HMIS.findByPk(id);
        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete HMIS entry (using raw SQL)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM "HMIS" WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get statistics (using raw SQL)
router.get('/stats/overview', async (req, res) => {
    try {
        const query = `
            SELECT 
                "dataSetId",
                COUNT(*) as total_entries,
                COUNT(CASE WHEN metadata->>'status' = 'submitted' THEN 1 END) as submitted_entries,
                COUNT(CASE WHEN metadata->>'status' = 'approved' THEN 1 END) as approved_entries
            FROM "HMIS"
            GROUP BY "dataSetId"
        `;
        
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get child health vaccines data
router.get('/child-health/vaccines', async (req, res) => {
    try {
        const { report_month } = req.query;
        
        let query = `
            SELECT 
                v.report_month,
                m.section_id,
                m.section_name,
                m.hmis_code,
                m.hmis_name,
                v."0-5m_male",
                v."0-5m_female",
                v."6-11m_male",
                v."6-11m_female",
                v."12-59m_male",
                v."12-59m_female",
                v."5-14y_male",
                v."5-14y_female",
                v.service_point
            FROM reporting."105_03_child_vaccines" v
            JOIN reporting.dhis_eafya_mapping_child_health m 
            ON v.vaccine_id = m.eafya_vaccine_id
            WHERE section_id = '2.3'
        `;

        const params = [];
        let paramCount = 1;

        if (report_month) {
            query += ` AND v.report_month = $${paramCount}`;
            params.push(report_month);
            paramCount++;
        }

        query += ` ORDER BY v.report_month DESC, m.hmis_code`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 