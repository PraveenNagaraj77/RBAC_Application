import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  console.log('Request URL:', config.url);

  // Skip adding Authorization header for register/login routes
  if (
    config.url?.includes('/auth/register') ||
    config.url?.includes('/auth/login')
  ) {
    console.log('Skipping Authorization header for:', config.url);
    return config;
  }

  const token = localStorage.getItem('token');
  if (token) {
    console.log('Adding Authorization header with token:', token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('No token found, no Authorization header added');
  }

  return config;
});

export default api;
