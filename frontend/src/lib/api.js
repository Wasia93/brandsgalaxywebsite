import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  // Let browser set Content-Type automatically for FormData (multipart + boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('auth-storage');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (_) {}
  }
  return config;
});

// On 401 → clear stale session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth-storage');
      } catch (_) {}
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/** Extract a readable string from any FastAPI error response */
export function getErrorMessage(err, fallback = 'Something went wrong') {
  const detail = err?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    // Pydantic v2 validation errors → [{type, loc, msg, input, url}, ...]
    return detail.map((e) => e.msg ?? JSON.stringify(e)).join(', ');
  }
  return fallback;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (email, password) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/api/auth/me'),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => api.get('/api/products/', { params }),
  getOne: (identifier) => api.get(`/api/products/${identifier}`),
  getCategories: () => api.get('/api/products/categories'),
  getBrands: () => api.get('/api/products/brands'),
};
