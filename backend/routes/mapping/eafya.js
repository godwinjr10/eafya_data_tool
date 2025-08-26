import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

router.get('/commodities', async (req, res) => {
    try {

        const query = `
        SELECT 
            id,
            section_id, 
            section_name,
            hmis_code,
            hmis_name,
            eafya_product_id, 
            eafya_product_name,
            dhis2_data_element_id, 
            data_element_name
            FROM reporting.dhis_eafya_mapping_commodities
            order by hmis_code
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id,
                s."name"
            FROM dwh.dim_eafya_product s
            WHERE s.product_type = 'drug'
            ORDER BY s."name"
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/labtests', async (req, res) => {
    try {

        const query = `
        SELECT 
            id, 
            section_id, 
            category, 
            hmis_code, 
            hmis_name, 
            eafya_labtest_id, 
            eafya_labtest_name,
            dhis2_data_element_id
            FROM reporting.dhis_eafya_mapping_labtests
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/lab', async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_lab_test
            ORDER BY "name"
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create one or more lab test mappings
router.post('/labtests', async (req, res) => {
    try {
        const {
            section_id,
            category,
            hmis_code,
            hmis_name,
            dhis2_data_element_id = null,
            mappings // [{ id, name }] eAFYA lab tests
        } = req.body;

        if (!hmis_code || !hmis_name || !Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({
                message: 'Missing required fields: hmis_code, hmis_name and non-empty mappings array'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const m of mappings) {
                await client.query(
                    `INSERT INTO reporting.dhis_eafya_mapping_labtests (
                        section_id,
                        category,
                        hmis_code,
                        hmis_name,
                        eafya_labtest_id,
                        eafya_labtest_name,
                        dhis2_data_element_id
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        section_id || null,
                        category || null,
                        hmis_code,
                        hmis_name,
                        m.id,
                        m.name || null,
                        dhis2_data_element_id
                    ]
                );
            }

            await client.query('COMMIT');
            return res.json({ message: 'Lab test mappings saved', count: mappings.length });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving lab test mappings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific lab test mapping by id
router.delete('/labtests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reporting.dhis_eafya_mapping_labtests WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Lab test mapping deleted' });
    } catch (error) {
        console.error('Error deleting lab test mapping:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create one or more commodity mappings
router.post('/commodities', async (req, res) => {
    try {
        const {
            section_id,
            hmis_code,
            hmis_name,
            dhis2_data_element_id = null,
            data_element_name = null,
            mappings // [{ id, name }] eAFYA products
        } = req.body;

        if (!hmis_code || !hmis_name || !Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({
                message: 'Missing required fields: hmis_code, hmis_name and non-empty mappings array'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const m of mappings) {
                await client.query(
                    `INSERT INTO reporting.dhis_eafya_mapping_commodities (
                        section_id,
                        hmis_code,
                        hmis_name,
                        eafya_product_id,
                        eafya_product_name,
                        dhis2_data_element_id,
                        data_element_name
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        section_id || null,
                        hmis_code,
                        hmis_name,
                        m.id,
                        m.name || null,
                        dhis2_data_element_id,
                        data_element_name
                    ]
                );
            }

            await client.query('COMMIT');
            return res.json({ message: 'Commodity mappings saved', count: mappings.length });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving commodity mappings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific commodity mapping by id
router.delete('/commodities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reporting.dhis_eafya_mapping_commodities WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Commodity mapping deleted' });
    } catch (error) {
        console.error('Error deleting commodity mapping:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get family planning mappings
router.get('/familyplanning', async (req, res) => {
    try {
        const query = `
        SELECT 
            id,
            section_id, 
            section_name,
            hmis_code,
            hmis_name,
            eafya_id, 
            eafya_name,
            categoryoptioncombo_name
        FROM reporting.dhis_eafya_mapping_familyplanning
        ORDER BY hmis_code
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get family planning items for mapping
router.get('/familyplanning-items', async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_family_planning
            ORDER BY "name"
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create one or more family planning mappings
router.post('/familyplanning', async (req, res) => {
    try {
        const {
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            categoryoptioncombo_name = null,
            mappings // [{ id, name }] eAFYA family planning items
        } = req.body;

        if (!hmis_code || !hmis_name || !Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({
                message: 'Missing required fields: hmis_code, hmis_name and non-empty mappings array'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const m of mappings) {
                await client.query(
                    `INSERT INTO reporting.dhis_eafya_mapping_familyplanning (
                        section_id,
                        section_name,
                        hmis_code,
                        hmis_name,
                        eafya_id,
                        eafya_name,
                        categoryoptioncombo_name
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        section_id || null,
                        section_name || null,
                        hmis_code,
                        hmis_name,
                        m.id,
                        m.name || null,
                        categoryoptioncombo_name
                    ]
                );
            }

            await client.query('COMMIT');
            return res.json({ message: 'Family planning mappings saved', count: mappings.length });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving family planning mappings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific family planning mapping by id
router.delete('/familyplanning/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reporting.dhis_eafya_mapping_familyplanning WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Family planning mapping deleted' });
    } catch (error) {
        console.error('Error deleting family planning mapping:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get vaccines mappings
router.get('/vaccines', async (req, res) => {
    try {
        const query = `
        SELECT 
            id,
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            eafya_vaccine_id, 
            eafya_vaccine_name
        FROM reporting.dhis_eafya_mapping_vaccines
        ORDER BY hmis_code
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vaccine items for mapping
router.get('/vaccine-items', async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_vaccine
            ORDER BY "name"
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create one or more vaccine mappings
router.post('/vaccines', async (req, res) => {
    try {
        const {
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            mappings // [{ id, name }] eAFYA vaccines
        } = req.body;

        if (!hmis_code || !hmis_name || !Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({
                message: 'Missing required fields: hmis_code, hmis_name and non-empty mappings array'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const m of mappings) {
                await client.query(
                    `INSERT INTO reporting.dhis_eafya_mapping_vaccines (
                        section_id,
                        section_name,
                        hmis_code,
                        hmis_name,
                        eafya_vaccine_id,
                        eafya_vaccine_name
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        section_id || null,
                        section_name || null,
                        hmis_code,
                        hmis_name,
                        m.id,
                        m.name || null
                    ]
                );
            }

            await client.query('COMMIT');
            return res.json({ message: 'Vaccine mappings saved', count: mappings.length });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving vaccine mappings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific vaccine mapping by id
router.delete('/vaccines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reporting.dhis_eafya_mapping_vaccines WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Vaccine mapping deleted' });
    } catch (error) {
        console.error('Error deleting vaccine mapping:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get conditions mappings
router.get('/conditions', async (req, res) => {
    try {
        const query = `
        SELECT 
            id,
            csv_id,
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            eafya_disease_id, 
            eafya_disease_name,
            data_element_id,
            category_optioncombo_id, 
            category_optioncombo_name
        FROM reporting.dhis_eafya_mapping_conditions_final
        ORDER BY hmis_code
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get disease items for mapping
router.get('/disease-items', async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                "name"
            FROM dwh.dim_eafya_disease
            ORDER BY "name"
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create one or more condition mappings
router.post('/conditions', async (req, res) => {
    try {
        const {
            csv_id,
            section_id,
            section_name,
            hmis_code,
            hmis_name,
            data_element_id = null,
            category_optioncombo_id = null,
            category_optioncombo_name = null,
            mappings // [{ id, name }] eAFYA diseases
        } = req.body;

        if (!hmis_code || !hmis_name || !Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({
                message: 'Missing required fields: hmis_code, hmis_name and non-empty mappings array'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const m of mappings) {
                await client.query(
                    `INSERT INTO reporting.dhis_eafya_mapping_conditions_final (
                        csv_id,
                        section_id,
                        section_name,
                        hmis_code,
                        hmis_name,
                        eafya_disease_id,
                        eafya_disease_name,
                        data_element_id,
                        category_optioncombo_id,
                        category_optioncombo_name
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [
                        csv_id || null,
                        section_id || null,
                        section_name || null,
                        hmis_code,
                        hmis_name,
                        m.id,
                        m.name || null,
                        data_element_id,
                        category_optioncombo_id,
                        category_optioncombo_name
                    ]
                );
            }

            await client.query('COMMIT');
            return res.json({ message: 'Condition mappings saved', count: mappings.length });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving condition mappings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific condition mapping by id
router.delete('/conditions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reporting.dhis_eafya_mapping_conditions_final WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.json({ message: 'Condition mapping deleted' });
    } catch (error) {
        console.error('Error deleting condition mapping:', error);
        res.status(500).json({ message: error.message });
    }
});


export default router;