import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Dev logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    // Example: attach token if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('[REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Dev logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[API RESPONSE]', response);
    }
    return response;
  },
  (error) => {
    console.error('[RESPONSE ERROR]', error);

    // Handle global errors (example: unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      // window.location.href = '/login'; // optional
    }

    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = () =>
  axios.get('http://localhost:8000/health/'); // outside /api

// Students
export const getStudents = () => API.get('/students/');
export const createStudent = (data) => API.post('/students/', data);
export const updateStudent = (id, data) => API.put(`/students/${id}/`, data);

// PATCH (partial update)
export const patchStudent = (id, data) => API.patch(`/students/${id}/`, data);

export const deleteStudent = (id) => API.delete(`/students/${id}/`);

// Subjects
export const getSubjects = () => API.get('/subjects/');
export const createSubject = (data) => API.post('/subjects/', data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}/`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}/`);

// Section
export const getSections = (subjectId = null) =>
  API.get('/sections/', {
    params: subjectId ? { subject: subjectId } : {},
  });

export const createSection = (data) => API.post('/sections/', data);
export const updateSection = (id, data) => API.put(`/sections/${id}/`, data);
export const deleteSection = (id) => API.delete(`/sections/${id}/`);

// Enrollments
export const getEnrollments = (filters = {}) =>
  API.get('/enrollments/', { params: filters });

export const createEnrollment = (data) =>
  API.post('/enrollments/', data);

// PUT full update
export const updateEnrollment = (id, data) =>
  API.put(`/enrollments/${id}/`, data);

// DELETE (drop)
export const dropEnrollment = (id) =>
  API.delete(`/enrollments/${id}/`);

// Summaries
export const getSummaries = () => API.get('/summaries/');
export const getStudentSummary = (id) =>
  API.get(`/summaries/${id}/`);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/');