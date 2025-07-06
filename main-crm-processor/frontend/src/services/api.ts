import axios from 'axios';
import type { ProcessingRequest, ProcessingResponse, LeadResponse, Stats } from '../types/api';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Process meeting summary
  processMeeting: async (request: ProcessingRequest): Promise<ProcessingResponse> => {
    const response = await api.post('/api/process', request);
    return response.data;
  },

  // Get all leads
  getLeads: async (limit?: number): Promise<LeadResponse> => {
    const params = limit ? { limit } : {};
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  // Get statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/api/stats');
    return response.data;
  },

  // Clear all leads (for testing)
  clearLeads: async (): Promise<{ message: string }> => {
    const response = await api.delete('/api/leads');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ message: string; status: string }> => {
    const response = await api.get('/');
    return response.data;
  },
};

export default apiService;