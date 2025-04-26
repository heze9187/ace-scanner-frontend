import axios from 'axios';

// Decide base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';

const api = axios.create({
  baseURL: isProduction
    ? 'https://ace-scanner-backend.onrender.com/api/'
    : 'http://localhost:8000/api/',
  withCredentials: true,
});

// Global interceptor to auto-add CSRFToken
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  // Always ensure Content-Type is application/json for POST/PUT/PATCH
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export const getCsrfToken = async () => {
  try {
    await api.get('csrf/');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default api;