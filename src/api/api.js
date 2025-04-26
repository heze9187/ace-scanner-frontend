// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,  // important to send cookies
});

export async function getCsrfToken() {
  await api.get('auth/login/');  // Django will set csrftoken cookie
}

export default api;