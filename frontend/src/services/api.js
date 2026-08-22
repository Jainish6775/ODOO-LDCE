import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('globetrotter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('globetrotter_token');
      localStorage.removeItem('globetrotter_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/me/password', data),
  deleteAccount: () => api.delete('/auth/me'),
};

// Trips API
export const tripsAPI = {
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  duplicate: (id) => api.post(`/trips/${id}/duplicate`),
  share: (id) => api.post(`/trips/${id}/share`),
  getBudget: (id) => api.get(`/trips/${id}/budget`),
};

// Trip Stops API
export const stopsAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/stops`),
  create: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  update: (tripId, stopId, data) => api.put(`/trips/${tripId}/stops/${stopId}`, data),
  delete: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorder: (tripId, data) => api.put(`/trips/${tripId}/stops/reorder`, data),
};

// Itinerary API (activities, accommodation, transport within stops)
export const itineraryAPI = {
  getActivities: (stopId) => api.get(`/stops/${stopId}/activities`),
  addActivity: (stopId, data) => api.post(`/stops/${stopId}/activities`, data),
  updateActivity: (stopId, id, data) => api.put(`/stops/${stopId}/activities/${id}`, data),
  deleteActivity: (stopId, id) => api.delete(`/stops/${stopId}/activities/${id}`),
  addAccommodation: (stopId, data) => api.post(`/stops/${stopId}/accommodation`, data),
  updateAccommodation: (stopId, id, data) => api.put(`/stops/${stopId}/accommodation/${id}`, data),
  deleteAccommodation: (stopId, id) => api.delete(`/stops/${stopId}/accommodation/${id}`),
  addTransport: (stopId, data) => api.post(`/stops/${stopId}/transport`, data),
  updateTransport: (stopId, id, data) => api.put(`/stops/${stopId}/transport/${id}`, data),
  deleteTransport: (stopId, id) => api.delete(`/stops/${stopId}/transport/${id}`),
};

// Destinations API
export const destinationsAPI = {
  search: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getActivities: (id, params) => api.get(`/destinations/${id}/activities`, { params }),
};

// Activities API
export const activitiesAPI = {
  search: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
};

// Community API
export const communityAPI = {
  getPublicTrips: (params) => api.get('/community', { params }),
  likeTrip: (tripId) => api.post(`/community/${tripId}/like`),
  saveTrip: (tripId) => api.post(`/community/${tripId}/save`),
  copyTrip: (tripId) => api.post(`/community/${tripId}/copy`),
};

// Saved Destinations API
export const savedAPI = {
  getAll: () => api.get('/saved-destinations'),
  save: (destinationId) => api.post('/saved-destinations', { destination_id: destinationId }),
  remove: (id) => api.delete(`/saved-destinations/${id}`),
};

// Expenses API
export const expensesAPI = {
  add: (tripId, data) => api.post(`/trips/${tripId}/expenses`, data),
  update: (tripId, id, data) => api.put(`/trips/${tripId}/expenses/${id}`, data),
  delete: (tripId, id) => api.delete(`/trips/${tripId}/expenses/${id}`),
};

// Shared (no auth)
export const sharedAPI = {
  getTrip: (token) => api.get(`/shared/${token}`),
};

export default api;
