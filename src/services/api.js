import axios from 'axios';

// En local (npm run dev), VITE_API_URL n'est pas définie : on utilise le proxy Vite ('/api').
// En production (Vercel), VITE_API_URL doit pointer vers l'URL du backend Render,
// ex : https://soundfarm-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('soundfarm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('soundfarm_token');
      localStorage.removeItem('soundfarm_user');
      if (window.location.pathname !== '/connexion') {
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
