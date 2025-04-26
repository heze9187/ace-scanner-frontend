import axios from 'axios';

// 1. Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// 2. Create the axios instance
const api = axios.create({
  baseURL: isProduction
    ? 'https://ace-scanner-backend.onrender.com/api/'
    : 'http://localhost:8000/api/',
  withCredentials: true,
  xsrfCookieName: "csrftoken",      // <--- force axios to match Django cookie name
  xsrfHeaderName: "X-CSRFToken",    // <--- force axios to match Django header name
});

// 3. Auto-inject CSRF token on safe methods
api.interceptors.request.use(async (config) => {
  const csrfToken = getCookie('csrftoken');

  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 4. Helper: Fetch CSRF token cookie
export const getCsrfToken = async () => {
  try {
    await api.get('csrf/');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// 5. Helper: Read cookie
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];

  return cookieValue;
}

export default api;