import express from 'express';
import Dataset from '../models/dataset.js';
import { pool } from '../config/database.js';
import { Op, literal } from 'sequelize';

const router = express.Router();

// Create new dataset
router.post('/', async (req, res) => {
    try {
        // Ensure sections array has the correct structure if provided
        if (req.body.sections) {
            req.body.sections = req.body.sections.map(section => ({
                section_id: section.section_id,
                section_name: section.section_name
            }));
        }
        const dataset = await Dataset.create(req.body);
        res.status(201).json(dataset);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all datasets with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const datasets = await Dataset.findAll();
        res.status(200).json({
            success: true,
            count: datasets.length,
            datasets: datasets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get dataset by ID
router.get('/:id', async (req, res) => {
    try {
        const dataset = await Dataset.findByPk(req.params.id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        res.json(dataset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update dataset
router.put('/:id', async (req, res) => {
    try {
        const dataset = await Dataset.findByPk(req.params.id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        // Handle basic fields
        const updateData = { ...req.body };
        delete updateData.sections; // Remove sections from basic update

        // Update basic fields if any
        if (Object.keys(updateData).length > 0) {
            await dataset.update(updateData);
        }

        // Handle sections update if provided
        if (req.body.sections) {
            const { remove, update, add } = req.body.sections;
            let currentSections = [...dataset.sections];

            // Remove sections by section_id
            if (remove && Array.isArray(remove)) {
                currentSections = currentSections.filter(section => 
                    !remove.includes(section.section_id)
                );
            }

            // Update sections
            if (update && Array.isArray(update)) {
                update.forEach(updateItem => {
                    const index = currentSections.findIndex(
                        section => section.section_id === updateItem.section_id
                    );
                    if (index !== -1) {
                        currentSections[index] = {
                            section_id: updateItem.section_id,
                            section_name: updateItem.section_name
                        };
                    }
                });
            }

            // Add new sections
            if (add && Array.isArray(add)) {
                const newSections = add.map(section => ({
                    section_id: section.section_id,
                    section_name: section.section_name
                }));
                currentSections = [...currentSections, ...newSections];
            }

            // Update the sections array
            await dataset.update({ sections: currentSections });
        }

        // Fetch and return the updated dataset
        const updatedDataset = await Dataset.findByPk(req.params.id);
        res.json(updatedDataset);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete dataset
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Dataset.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        res.json({ message: 'Dataset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk create datasets
router.post('/bulk', async (req, res) => {
    try {
        // Ensure sections array has the correct structure for each dataset
        const datasetsWithFormattedSections = req.body.map(dataset => ({
            ...dataset,
            sections: dataset.sections ? dataset.sections.map(section => ({
                section_id: section.section_id,
                section_name: section.section_name
            })) : []
        }));

        const datasets = await Dataset.bulkCreate(datasetsWithFormattedSections, {
            validate: true,
            returning: true
        });
        res.status(201).json(datasets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router; 