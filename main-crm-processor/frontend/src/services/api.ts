import axios from 'axios';
import type { ProcessingRequest, ProcessingResponse, LeadResponse, Stats } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Process meeting summary
  processMeeting: async (request: ProcessingRequest): Promise<ProcessingResponse> => {
    try {
      const response = await api.post('/api/process', request);
      return response.data;
    } catch (error: any) {
      console.error('Process meeting error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to process meeting');
    }
  },

  // Get all leads
  getLeads: async (limit?: number): Promise<LeadResponse> => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/api/leads', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get leads error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to get leads');
    }
  },

  // Get statistics
  getStats: async (): Promise<Stats> => {
    try {
      const response = await api.get('/api/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get stats error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to get stats');
    }
  },

  // Clear all leads (for testing)
  clearLeads: async (): Promise<{ message: string }> => {
    try {
      const response = await api.delete('/api/leads');
      return response.data;
    } catch (error: any) {
      console.error('Clear leads error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to clear leads');
    }
  },

  // Health check
  healthCheck: async (): Promise<{ message: string; status: string }> => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error: any) {
      console.error('Health check error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Health check failed');
    }
  },
};

export default apiService;