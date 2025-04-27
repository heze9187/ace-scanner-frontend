// import axios from 'axios';

// function getCookie(name) {
//   const cookieValue = document.cookie
//     .split('; ')
//     .find(row => row.startsWith(name + '='))
//     ?.split('=')[1];

//   console.log(`[getCookie] Reading cookie ${name}:`, cookieValue); // 🔥 Debug log
//   return cookieValue;
// }

// const isProduction = process.env.NODE_ENV === 'production';
// console.log(`[env] isProduction:`, isProduction); // 🔥 Debug log

// const api = axios.create({
//   baseURL: isProduction
//     ? 'https://ace-scanner-backend.onrender.com/api/'
//     : 'http://localhost:8000/api/',
//   withCredentials: true,
//   xsrfCookieName: 'csrftoken',
//   xsrfHeaderName: 'X-CSRFToken',
// });

// // ✨ Always set X-CSRFToken manually
// api.interceptors.request.use((config) => {
//   console.log(`[request] ${config.method?.toUpperCase()} ${config.url}`); // 🔥 Debug log

//   const csrfToken = getCookie('csrftoken');

//   if (!csrfToken) {
//     console.warn('[request] No CSRF token found in cookies! ❌'); // 🔥 Debug log
//   }

//   if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
//     config.headers['X-CSRFToken'] = csrfToken;
//     console.log('[request] Injected X-CSRFToken header:', csrfToken); // 🔥 Debug log
//   }

//   return config;
// }, (error) => {
//   console.error('[request] Axios request error:', error);
//   return Promise.reject(error);
// });

// export const getCsrfToken = async () => {
//   try {
//     console.log('[csrf] Fetching CSRF token...'); // 🔥 Debug log
//     await api.get('csrf/');
//     console.log('[csrf] CSRF token fetch success ✅'); // 🔥 Debug log
//   } catch (error) {
//     console.error('[csrf] Error fetching CSRF token ❌:', error);
//   }
// };

// export default api;


import axios from 'axios';

// Helper to read cookie
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
  return cookieValue;
}

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';

const api = axios.create({
  baseURL: isProduction
    ? 'https://api.ace-scanner.com/api/'
    : 'http://localhost:8000/api/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// ✅ Always attach CSRF for unsafe methods (POST, PUT, etc)
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
    console.log('[request] Injected X-CSRFToken header ✅', csrfToken);
  } else {
    console.warn('[request] No CSRF token found ❌');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Fetch CSRF
export const getCsrfToken = async () => {
  try {
    console.log('[csrf] Fetching CSRF token...');
    await api.get('csrf/');
    console.log('[csrf] Fetched CSRF token ✅');
  } catch (error) {
    console.error('[csrf] Error fetching CSRF token ❌', error);
  }
};

export { getCookie };
export default api;