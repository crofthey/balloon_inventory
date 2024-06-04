// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.82:5000/api/items'  // Use environment variable or fallback to localhost
});

// Add a request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

// Add a response interceptor for logging
api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

export const getItems = () => api.get('/');
export const addItem = (item) => api.post('/add', item);
export const submitItemsUsage = (name, description, items) => api.post('/use', { name, description, items });
export const getAllocations = () => api.get('/history');
export const updateItemQuantity = (id, qty) => api.put(`/update-quantity/${id}`, { qty });
