import axiosInstance from './axiosInstance';

export const printRequestsApi = {
  getMine: (params) => axiosInstance.get('/print-requests/mine', { params }),
  getAll: (params) => axiosInstance.get('/print-requests', { params }),
  getHistory: (params) => axiosInstance.get('/print-requests/history', { params }),
  getById: (id) => axiosInstance.get(`/print-requests/${id}`),
  create: (formData) =>
    axiosInstance.post('/print-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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
  getDownloadUrl: (id) => `http://localhost:5000/api/library/${id}/download`,
};

export const classesStudentsApi = {
  getStudents: (classId) => axiosInstance.get(`/classes/${classId}/students`),
  getAllClasses: () => axiosInstance.get('/classes'),
  createStudent: (data) => axiosInstance.post('/classes/students', data),
  updateStudent: (id, data) => axiosInstance.put(`/classes/students/${id}`, data),
  getStudent: (id) => axiosInstance.get(`/classes/students/${id}`),
};

export const teacherApi = {
  getMyClasses: () => axiosInstance.get('/teachers/me/classes'),
  getMySubjects: () => axiosInstance.get('/teachers/me/subjects'),
};
