import api from './api';

export const createAppointment     = (data)         => api.post('/appointments', data);
export const getMyAppointments     = ()              => api.get('/appointments/my');
export const getAllAppointments     = (params)        => api.get('/appointments', { params });
export const getAppointmentById    = (id)            => api.get(`/appointments/${id}`);
export const cancelAppointment     = (id)            => api.patch(`/appointments/${id}/cancel`);
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status });
