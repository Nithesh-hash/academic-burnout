import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
};

export const behaviourAPI = {
  logBehaviour: (data) => api.post('/api/behaviour', data),
  getHistory: (limit = 30) => api.get(`/api/behaviour-history?limit=${limit}`),
  deleteRecord: (id) => api.delete(`/api/behaviour/${id}`),
  seedSampleData: () => api.post('/api/behaviour/seed'),
};

export const riskAPI = {
  analyzeRisk: (data) => api.post('/api/analyze-risk', data),
  getRiskHistory: (limit = 50) => api.get(`/api/risk-history?limit=${limit}`),
  deleteRiskRecord: (id) => api.delete(`/api/risk-history/${id}`),
  getPersonalBaseline: () => api.get('/api/baseline'),
  resetBaseline: () => api.post('/api/baseline/reset'),
};

export const timetableAPI = {
  uploadScreenshot: (formData) => api.post('/api/timetable-screenshot/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStatus: () => api.get('/api/timetable-screenshot'),
};

export const extracurricularAPI = {
  create: (data) => api.post('/api/extracurricular', data),
  getAll: () => api.get('/api/extracurricular'),
  delete: (id) => api.delete(`/api/extracurricular/${id}`),
};

export default api;


