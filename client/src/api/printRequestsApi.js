import apiFetch from './apiFetch';

export const printRequestsApi = {
  getMine: (params) => apiFetch.get('/print-requests/mine', { params }),
  getAll: (params) => apiFetch.get('/print-requests', { params }),
  getHistory: (params) => apiFetch.get('/print-requests/history', { params }),
  getById: (id) => apiFetch.get(`/print-requests/${id}`),
  create: (formData) =>
    apiFetch.post('/print-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
    }),
  updateStatus: (id, status) =>
    apiFetch.patch(`/print-requests/${id}/status`, { status }),
  getCoverUrl: (id) => `/api/print-requests/${id}/cover`,
  getCover: (id) => apiFetch.get(`/print-requests/${id}/cover`, { responseType: 'arraybuffer' }),
  delete: (id) => apiFetch.delete(`/print-requests/${id}`),
};

export const libraryApi = {
  getAll: () => apiFetch.get('/library'),
  upload: (formData) => apiFetch.post('/library', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => apiFetch.patch(`/library/${id}`, data),
  delete: (id) => apiFetch.delete(`/library/${id}`),
};

