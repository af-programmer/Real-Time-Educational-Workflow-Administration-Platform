import axiosInstance from './axiosInstance';

export const usersApi = {
  getAll: (params) => axiosInstance.get('/users', { params }),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  getProfile: (id) => axiosInstance.get(`/users/${id}/profile`),
  create: (data) => axiosInstance.post('/users', data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
  suspend: (id, suspend) => axiosInstance.patch(`/users/${id}/suspend`, { suspend }),
  assignClasses: (id, classIds) => axiosInstance.post(`/users/${id}/assign-classes`, { classIds }),
  assignSubjects: (id, subjectIds) => axiosInstance.post(`/users/${id}/assign-subjects`, { subjectIds }),
  assignHomeroomClasses: (id, classIds) => axiosInstance.post(`/users/${id}/assign-homeroom-classes`, { classIds }),
};

export const teachersApi = {
  getAll: (params) => axiosInstance.get('/teachers', { params }),
  getMe: () => axiosInstance.get('/teachers/me'),
  getProfile: (id) => axiosInstance.get(`/teachers/${id}/profile`),
  getSecretaries: () => axiosInstance.get('/teachers/secretaries'),
  getAdmins: () => axiosInstance.get('/teachers/admins'),
  getMyHomeroomTeachers: () => axiosInstance.get('/teachers/my-homeroom-teachers'),
};

export const classesApi = {
  getAll: () => axiosInstance.get('/classes'),
  getById: (id) => axiosInstance.get(`/classes/${id}`),
  createStudent: (data) => axiosInstance.post('/classes/students', data),
  updateStudent: (id, data) => axiosInstance.put(`/classes/students/${id}`, data),
  deleteStudent: (id) => axiosInstance.delete(`/classes/students/${id}`),
};

export const subjectsApi = {
  getAll: () => axiosInstance.get('/subjects'),
};
