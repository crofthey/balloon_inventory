// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.85:5000/api/'  // Use environment variable or fallback to localhost
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

export const getItems = () => api.get('/items');
export const addItem = (item) => api.post('/items/add', item);
export const submitItemsUsage = (name, description, items) => api.post('/items/use', { name, description, items });
export const getAllocations = () => api.get('/items/history');
export const updateItemQuantity = (id, qty) => api.put(`/items/update-qty/${id}`, { qty });
export const updateItemCost = (id, unit_cost) => api.put(`/items/update-cost/${id}`, { unit_cost });
export const deleteItem = (id) => api.delete(`/items/delete/${id}`);
export const addQuote = (quote) => api.post('/quotes/add', quote);
export const getQuotes = () => api.get('/quotes');
//export const updateQuote = (id, quote) => api.put(`/quotes/update/${quote.id}`, quote);
export const convertQuoteToBooking = (id, bookingDetails) => api.post(`/quotes/convert-to-booking/${id}`, bookingDetails);

export const updateQuote = async (quote) => {
  console.log('Updating quote:', quote); // Debug log
  try {
    const response = await axios.put(`/quotes/update/${quote.id}`, quote);
    console.log('Update response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Update error:', error); // Debug log
    throw error;
  }
};
