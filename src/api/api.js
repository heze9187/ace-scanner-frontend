import axios from 'axios';

// 1. Helper: Read cookie (MOVE THIS TO TOP)
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];

  return cookieValue;
}

// 2. Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// 3. Create the axios instance
const api = axios.create({
  baseURL: isProduction
    ? 'https://ace-scanner-backend.onrender.com/api/'
    : 'http://localhost:8000/api/',
  withCredentials: true,
  xsrfCookieName: "csrftoken",      // align with Django cookie
  xsrfHeaderName: "X-CSRFToken",    // align with Django header
});

// 4. Auto-inject CSRF token on unsafe methods
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');  // <-- now function already defined!

  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = csrfToken;   // <-- properly attached!
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 5. Helper: Fetch CSRF token
export const getCsrfToken = async () => {
  try {
    await api.get('csrf/');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default api;