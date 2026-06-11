import axiosInstance from './axiosInstance';

export const printRequestsApi = {
  getMine: (params) => axiosInstance.get('/print-requests/mine', { params }),
  getAll: (params) => axiosInstance.get('/print-requests', { params }),
  getHistory: (params) => axiosInstance.get('/print-requests/history', { params }),
  getById: (id) => axiosInstance.get(`/print-requests/${id}`),
  create: (formData) =>
    axiosInstance.post('/print-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
    }),
  updateStatus: (id, status) =>
    axiosInstance.patch(`/print-requests/${id}/status`, { status }),
  getCoverUrl: (id) => `/api/print-requests/${id}/cover`,
  getCover: (id) => axiosInstance.get(`/print-requests/${id}/cover`, { responseType: 'arraybuffer' }),
  delete: (id) => axiosInstance.delete(`/print-requests/${id}`),
};

export const libraryApi = {
  getAll: () => axiosInstance.get('/library'),
  upload: (formData) => axiosInstance.post('/library', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axiosInstance.patch(`/library/${id}`, data),
  delete: (id) => axiosInstance.delete(`/library/${id}`),
};

