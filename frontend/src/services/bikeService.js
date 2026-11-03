import api from './api';

export const getAllBikes      = (params) => api.get('/bikes', { params });
export const getBikeById      = (id)     => api.get(`/bikes/${id}`);
export const createBike       = (data)   => api.post('/bikes', data);
export const updateBike       = (id, data) => api.put(`/bikes/${id}`, data);
export const deleteBike       = (id)     => api.delete(`/bikes/${id}`);
export const toggleAvailability = (id, availability) =>
  api.patch(`/bikes/${id}/availability`, { availability });
