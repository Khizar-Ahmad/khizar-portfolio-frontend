import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://chatapp.webhop.me/portfolio';

const api = axios.create({ baseURL: BASE_URL });

// Inject admin token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const adminLogin = (secretKey) =>
  api.post('/api/auth/admin/login', { secret_key: secretKey });

// ─── Portfolio Data ───────────────────────────────────────────────────────────
export const getHero = () => api.get('/api/portfolio/hero');
export const updateHero = (data) => api.put('/api/portfolio/hero', data);

export const getExperiences = () => api.get('/api/portfolio/experiences');
export const createExperience = (data) => api.post('/api/portfolio/experiences', data);
export const updateExperience = (id, data) => api.put(`/api/portfolio/experiences/${id}`, data);
export const deleteExperience = (id) => api.delete(`/api/portfolio/experiences/${id}`);

export const getProjects = () => api.get('/api/portfolio/projects');
export const createProject = (data) => api.post('/api/portfolio/projects', data);
export const updateProject = (id, data) => api.put(`/api/portfolio/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/api/portfolio/projects/${id}`);

export const getSkills = () => api.get('/api/portfolio/skills');
export const createSkill = (data) => api.post('/api/portfolio/skills', data);
export const deleteSkill = (id) => api.delete(`/api/portfolio/skills/${id}`);

// ─── Chat / Voice ─────────────────────────────────────────────────────────────
export const sendChat = (message) => api.post('/api/chat', { message });
export const voiceAsk = (message) => api.post('/api/voice/ask', { message });
export const getTTS = async (text) => {
  const response = await api.post('/api/voice/tts', { message: text }, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};

export const BASE = BASE_URL;
export default api;
