// src/services/propertyService.js
import api from './api';

export const propertyService = {
  // Get all properties with filters
  getAll: async (params = {}) => {
    const response = await api.get('/api/v1/properties', { params });
    return response.data;
  },

  // Get property by ID
  getById: async (id) => {
    const response = await api.get(`/api/v1/properties/${id}`);
    return response.data;
  },

  // Search properties with advanced filters
  search: async (params = {}) => {
    const response = await api.get('/api/v1/properties/search', { params });
    return response.data;
  },

  // Get featured properties
  getFeatured: async () => {
    const response = await api.get('/api/v1/properties/featured');
    return response.data;
  },

  // Get latest properties
  getLatest: async () => {
    const response = await api.get('/api/v1/properties/latest');
    return response.data;
  },

  // Create property (multipart/form-data)
  create: async (formData) => {
    const response = await api.post('/api/v1/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property (multipart/form-data)
  update: async (id, formData) => {
    const response = await api.put(`/api/v1/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  delete: async (id) => {
    const response = await api.delete(`/api/v1/properties/${id}`);
    return response.data;
  },
};