import axiosInstance from './axiosInstance';

export const printRequestsApi = {
  getMine: (params) => axiosInstance.get('/print-requests/mine', { params }),
  getAll: (params) => axiosInstance.get('/print-requests', { params }),
  getById: (id) => axiosInstance.get(`/print-requests/${id}`),
  create: (formData) =>
    axiosInstance.post('/print-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id, status) =>
    axiosInstance.patch(`/print-requests/${id}/status`, { status }),
  getCoverUrl: (id) => `/api/print-requests/${id}/cover`,
  merge: (requestIds, notes) =>
    axiosInstance.post('/print-requests/merge', { requestIds, notes }),
};
