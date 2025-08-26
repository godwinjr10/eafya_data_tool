import express from 'express';
import DhisEafyaMapping from '../models/dhis_eafya_mapping.js';
import { pool } from '../config/database.js';
import { Op } from 'sequelize';

const router = express.Router();

// Create new mapping
router.post('/', async (req, res) => {
    try {
        const mapping = await DhisEafyaMapping.create(req.body);
        res.status(201).json(mapping);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all mappings with pagination and filtering (using raw SQL for better performance)
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            section_id, 
            eafya_hmis_id,
            data_element_id,
            search 
        } = req.query;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (section_id) {
            whereClause += ` AND section_id = $${paramCount}`;
            params.push(section_id);
            paramCount++;
        }

        if (eafya_hmis_id) {
            whereClause += ` AND eafya_hmis_id = $${paramCount}`;
            params.push(eafya_hmis_id);
            paramCount++;
        }

        if (data_element_id) {
            whereClause += ` AND data_element_id = $${paramCount}`;
            params.push(data_element_id);
            paramCount++;
        }

        if (search) {
            whereClause += ` AND (
                section_name ILIKE $${paramCount}
                OR eafya_name ILIKE $${paramCount}
                OR hmis_name ILIKE $${paramCount}
                OR category_optioncombo_name ILIKE $${paramCount}
            )`;
            params.push(`%${search}%`);
            paramCount++;
        }

        // Count total records
        const countQuery = `
            SELECT COUNT(*) 
            FROM reporting.dhis_eafya_mapping 
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        const offset = (page - 1) * limit;
        const query = `
            SELECT *
            FROM reporting.dhis_eafya_mapping
            ${whereClause}
            ORDER BY section_id, eafya_hmis_id
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        params.push(limit, offset);

        const { rows } = await pool.query(query, params);

        res.json({
            data: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get distinct sections
router.get('/sections', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT section_id, section_name 
            FROM reporting.dhis_eafya_mapping
            ORDER BY section_id
        `;
        
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get mapping by ID (using Sequelize)
router.get('/:id', async (req, res) => {
    try {
        const mapping = await DhisEafyaMapping.findByPk(req.params.id);
        if (!mapping) {
            return res.status(404).json({ message: 'Mapping not found' });
        }
        res.json(mapping);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update mapping
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await DhisEafyaMapping.update(req.body, {
            where: { id: req.params.id },
            returning: true
        });

        if (!updated) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        const updatedMapping = await DhisEafyaMapping.findByPk(req.params.id);
        res.json(updatedMapping);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete mapping
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await DhisEafyaMapping.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Mapping deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk create mappings
router.post('/bulk', async (req, res) => {
    try {
        const mappings = await DhisEafyaMapping.bulkCreate(req.body, {
            validate: true,
            returning: true
        });
        res.status(201).json(mappings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get mappings by section
router.get('/section/:sectionId', async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM reporting.dhis_eafya_mapping
            WHERE section_id = $1
            ORDER BY eafya_hmis_id
        `;
        
        const { rows } = await pool.query(query, [req.params.sectionId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 