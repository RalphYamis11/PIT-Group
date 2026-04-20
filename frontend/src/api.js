import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Token helpers ─────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');
export const setTokens = (access, refresh) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// ── Attach access token to every request ──────────────────
API.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers['Authorization'] = `JWT ${token}`;
  return config;
});

// ── Auto-refresh token on 401 ─────────────────────────────
API.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = getRefreshToken();
        const res = await axios.post('http://localhost:8000/auth/jwt/refresh/', { refresh });
        setTokens(res.data.access, refresh);
        original.headers['Authorization'] = `JWT ${res.data.access}`;
        return API(original);
      } catch {
        clearTokens();
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const loginUser  = (data) => axios.post('http://localhost:8000/auth/jwt/create/', data);
export const logoutUser = ()     => { clearTokens(); };
export const getProfile = ()     => API.get('http://localhost:8000/auth/users/me/');
export const checkAuth  = ()     => {
  const token = getAccessToken();
  if (!token) return Promise.reject('No token');
  return API.get('http://localhost:8000/auth/users/me/');
};

// ── Students ──────────────────────────────────────────────
export const getStudents    = (params = {}) => API.get('/students/',        { params });
export const getStudent     = (id)          => API.get(`/students/${id}/`);
export const createStudent  = (data)        => API.post('/students/',       data);
export const updateStudent  = (id, data)    => API.put(`/students/${id}/`,  data);
export const deleteStudent  = (id)          => API.delete(`/students/${id}/`);

// ── Subjects ──────────────────────────────────────────────
export const getSubjects    = (params = {}) => API.get('/subjects/',        { params });
export const createSubject  = (data)        => API.post('/subjects/',       data);
export const updateSubject  = (id, data)    => API.put(`/subjects/${id}/`,  data);
export const deleteSubject  = (id)          => API.delete(`/subjects/${id}/`);

// ── Sections ──────────────────────────────────────────────
export const getSections    = (subjectId = null, params = {}) =>
  API.get('/sections/', { params: { ...(subjectId ? { subject: subjectId } : {}), ...params } });
export const createSection  = (data)        => API.post('/sections/',       data);
export const updateSection  = (id, data)    => API.put(`/sections/${id}/`,  data);
export const deleteSection  = (id)          => API.delete(`/sections/${id}/`);

// ── Enrollments ───────────────────────────────────────────
export const getEnrollments   = (filters = {}) => API.get('/enrollments/',        { params: filters });
export const createEnrollment = (data)          => API.post('/enrollments/',       data);
export const updateEnrollment = (id, data)      => API.patch(`/enrollments/${id}/`, data);
export const dropEnrollment   = (id)            => API.delete(`/enrollments/${id}/`);

// ── Summaries ─────────────────────────────────────────────
export const getSummaries      = (params = {}) => API.get('/summaries/',      { params });
export const getStudentSummary = (id)          => API.get(`/summaries/${id}/`);

// ── Dashboard ─────────────────────────────────────────────
export const getDashboardStats = () => API.get('/dashboard/');

export default API;