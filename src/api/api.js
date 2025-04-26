import axios from 'axios';

function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];

  return cookieValue;
}

const isProduction = process.env.NODE_ENV === 'production';

const api = axios.create({
  baseURL: isProduction
    ? 'https://ace-scanner-backend.onrender.com/api/'
    : 'http://localhost:8000/api/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// ✨ NEW — Always set X-CSRFToken manually
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getCsrfToken = async () => {
  try {
    await api.get('csrf/');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default api;