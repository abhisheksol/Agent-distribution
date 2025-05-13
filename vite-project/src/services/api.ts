import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const auth = {
  register: (data: { email: string; password: string }) => 
    api.post('/auth/register', data),
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => 
    api.get('/auth/user')
};

export const agents = {
  getAll: () => api.get('/agents'),
  create: (data: any) => api.post('/agents', data),
  update: (id: string, data: any) => api.put(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`)
};

export const lists = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/lists/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getByAgent: (agentId: string) => 
    api.get(`/lists/agent/${agentId}`),
  getAll: () => 
    api.get('/lists/all')
};

export default api;
