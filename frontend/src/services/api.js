import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

export const login = (formData) => API.post('/users/login', formData);

export const getProducts = () => API.get('/products');

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminPosts = () => API.get('/admin/posts');
export const getAdminTransactions = () => API.get('/admin/transactions');