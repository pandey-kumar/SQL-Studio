import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and session ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add session ID for guest users
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const assignmentAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  getCategories: () => api.get('/assignments/categories'),
  getDifficultyStats: () => api.get('/assignments/stats/difficulty'),
};

export const queryAPI = {
  execute: (data) => api.post('/query/execute', data),
  validate: (data) => api.post('/query/validate', data),
};

export const hintAPI = {
  getHint: (data) => api.post('/hints', data),
  explainConcept: (concept) => api.post('/hints/explain', { concept }),
};

export const progressAPI = {
  getProgress: (assignmentId) => api.get(`/progress/${assignmentId}`),
  updateProgress: (assignmentId, data) => api.patch(`/progress/${assignmentId}`, data),
  markCompleted: (assignmentId, data) => api.post(`/progress/${assignmentId}/complete`, data),
  useHint: (assignmentId) => api.post(`/progress/${assignmentId}/hint`),
  getUserProgress: () => api.get('/progress/me'),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  updatePassword: (data) => api.patch('/auth/password', data),
};
