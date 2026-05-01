import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('di_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('di_token')
      localStorage.removeItem('di_admin')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// ── Enquiries ──────────────────────────────────────────────────────────────
export const enquiryAPI = {
  submit: (data) => api.post('/enquiries', data),
  getAll: (params) => api.get('/enquiries', { params }),
  getOne: (id) => api.get(`/enquiries/${id}`),
  update: (id, data) => api.patch(`/enquiries/${id}`, data),
  getStats: () => api.get('/enquiries/stats'),
}

// ── Projects ───────────────────────────────────────────────────────────────
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getAllAdmin: () => api.get('/projects/admin/all'),
  getOne: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

// ── Services ───────────────────────────────────────────────────────────────
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getAllAdmin: () => api.get('/services/admin/all'),
  getOne: (slug) => api.get(`/services/${slug}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

// ── Blogs ──────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getAllAdmin: () => api.get('/blogs/admin/all'),
  getOne: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
}

// ── Jobs ───────────────────────────────────────────────────────────────────
export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (slug) => api.get(`/jobs/${slug}`),
  // Resume URL has already been uploaded to Cloudinary by the browser.
  // We now send plain JSON — no multipart/form-data.
  apply: (id, data) => api.post(`/jobs/${id}/apply`, data),
  getApplications: () => api.get('/jobs/admin/applications'),
  updateApplicationStatus: (id, data) => api.put(`/jobs/admin/applications/${id}/status`, data),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// ── Media ──────────────────────────────────────────────────────────────────
export const mediaAPI = {
  // Returns { signature, timestamp, apiKey, cloudName, folder }
  // Frontend uses these to POST the file directly to Cloudinary
  getSignature: () => api.get('/media/sign'),

  // Deletes a Cloudinary asset by public_id (still backend-signed)
  delete: (publicId) => api.delete(`/media/${encodeURIComponent(publicId)}`),
}

export default api
