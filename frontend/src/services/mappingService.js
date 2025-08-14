import api from '../helpers/api';

export const mappingService = {
    // Get all mappings
    getAllMappings: async () => {
        const response = await api.get('/mappings');
        return response.data;
    },

    // Get mappings for specific HMIS code
    getMappingsByHmisCode: async (hmisCode) => {
        const response = await api.get(`/mappings/${hmisCode}`);
        return response.data;
    },

    // Create a single mapping
    createMapping: async (mapping) => {
        const response = await api.post('/mappings', mapping);
        return response.data;
    },

    // Create multiple mappings
    createManyMappings: async (mappings) => {
        const response = await api.post('/mappings/bulk', mappings);
        return response.data;
    },

    // Delete a specific mapping
    deleteMapping: async (hmisCode, eafyaDiseaseId) => {
        const response = await api.delete(`/mappings/${hmisCode}/${eafyaDiseaseId}`);
        return response.data;
    },

    // Delete all mappings for an HMIS code
    deleteMappingsByHmisCode: async (hmisCode) => {
        const response = await api.delete(`/mappings/${hmisCode}`);
        return response.data;
    },

    // Update a mapping
    updateMapping: async (hmisCode, eafyaDiseaseId, updates) => {
        const response = await api.put(`/mappings/${hmisCode}/${eafyaDiseaseId}`, updates);
        return response.data;
    }
};