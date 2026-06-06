import axiosInstance from './axiosInstance';

export const usersApi = {
  getAll: (params) => axiosInstance.get('/users', { params }),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  getProfile: (id) => axiosInstance.get(`/users/${id}/profile`),
  create: (data) => axiosInstance.post('/users', data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
  block: (id, block) => axiosInstance.patch(`/users/${id}/block`, { block }),
  assignClasses: (id, classIds) => axiosInstance.post(`/users/${id}/assign-classes`, { classIds }),
  assignSubjects: (id, subjectIds) => axiosInstance.post(`/users/${id}/assign-subjects`, { subjectIds }),
};

export const teachersApi = {
  getAll: (params) => axiosInstance.get('/teachers', { params }),
  getMe: () => axiosInstance.get('/teachers/me'),
  getProfile: (id) => axiosInstance.get(`/teachers/${id}/profile`),
};

export const classesApi = {
  getAll: () => axiosInstance.get('/classes'),
  getById: (id) => axiosInstance.get(`/classes/${id}`),
};

export const subjectsApi = {
  getAll: () => axiosInstance.get('/subjects'),
};
