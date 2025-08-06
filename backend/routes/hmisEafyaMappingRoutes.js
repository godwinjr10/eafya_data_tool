import express from 'express';
import { HmisEafyaMapping } from '../models/hmisEafyaMapping';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all mappings
router.get('/mappings', auth, async (req, res) => {
    try {
        const mappings = await HmisEafyaMapping.getAllMappings();
        res.json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get mappings for specific HMIS code
router.get('/mappings/:hmisCode', auth, async (req, res) => {
    try {
        const mappings = await HmisEafyaMapping.getMappingsByHmisCode(req.params.hmisCode);
        res.json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a single mapping
router.post('/mappings', auth, async (req, res) => {
    try {
        const mapping = await HmisEafyaMapping.createMapping(req.body, req.user.id);
        res.status(201).json(mapping);
    } catch (error) {
        if (error.message === 'This mapping already exists') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Create multiple mappings
router.post('/mappings/bulk', auth, async (req, res) => {
    try {
        const mappings = await HmisEafyaMapping.createManyMappings(req.body, req.user.id);
        res.status(201).json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific mapping
router.delete('/mappings/:hmisCode/:eafyaDiseaseId', auth, async (req, res) => {
    try {
        const mapping = await HmisEafyaMapping.deleteMapping(
            req.params.hmisCode,
            req.params.eafyaDiseaseId,
            req.user.id
        );
        if (mapping) {
            res.json(mapping);
        } else {
            res.status(404).json({ message: 'Mapping not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete all mappings for an HMIS code
router.delete('/mappings/:hmisCode', auth, async (req, res) => {
    try {
        const mappings = await HmisEafyaMapping.deleteMappingsByHmisCode(
            req.params.hmisCode,
            req.user.id
        );
        res.json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a mapping
router.put('/mappings/:hmisCode/:eafyaDiseaseId', auth, async (req, res) => {
    try {
        const mapping = await HmisEafyaMapping.updateMapping(
            req.params.hmisCode,
            req.params.eafyaDiseaseId,
            req.body,
            req.user.id
        );
        if (mapping) {
            res.json(mapping);
        } else {
            res.status(404).json({ message: 'Mapping not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;