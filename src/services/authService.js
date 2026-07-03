// src/services/authService.js
import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
  },

  // Register (admin only)
  register: async (username, email, password, role = 'admin') => {
    const response = await api.post('/api/v1/auth/register', {
      username,
      email,
      password,
      role,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout');
    return response.data;
  },

  // Refresh token (called automatically by interceptor)
  refreshToken: async () => {
    const response = await api.post('/api/v1/auth/refresh-token');
    return response.data;
  },
};