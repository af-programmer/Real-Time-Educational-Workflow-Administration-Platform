import apiFetch from './apiFetch';

export const usersApi = {
  getAll: (params) => apiFetch.get('/users', { params }),
  getById: (id) => apiFetch.get(`/users/${id}`),
  getProfile: (id) => apiFetch.get(`/users/${id}/profile`),
  create: (data) => apiFetch.post('/users', data),
  update: (id, data) => apiFetch.put(`/users/${id}`, data),
  delete: (id) => apiFetch.delete(`/users/${id}`),
  suspend: (id, suspend) => apiFetch.patch(`/users/${id}/suspend`, { suspend }),
  assignClasses: (id, classIds) => apiFetch.post(`/users/${id}/assign-classes`, { classIds }),
  assignSubjects: (id, subjectIds) => apiFetch.post(`/users/${id}/assign-subjects`, { subjectIds }),
  assignHomeroomClasses: (id, classIds) => apiFetch.post(`/users/${id}/assign-homeroom-classes`, { classIds }),
  uploadAvatar: (formData) => apiFetch.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const teachersApi = {
  getAll: (params) => apiFetch.get('/teachers', { params }),
  getMe: () => apiFetch.get('/teachers/me'),
  getProfile: (id) => apiFetch.get(`/teachers/${id}/profile`),
  getSecretaries: () => apiFetch.get('/teachers/secretaries'),
  getAdmins: () => apiFetch.get('/teachers/admins'),
  getMyHomeroomTeachers: () => apiFetch.get('/teachers/my-homeroom-teachers'),
  getMyClasses: () => apiFetch.get('/teachers/me/classes'),
  getMySubjects: () => apiFetch.get('/teachers/me/subjects'),
};

export const classesApi = {
  getAll: () => apiFetch.get('/classes'),
  getById: (id) => apiFetch.get(`/classes/${id}`),
  createStudent: (data) => apiFetch.post('/classes/students', data),
  updateStudent: (id, data) => apiFetch.put(`/classes/students/${id}`, data),
  deleteStudent: (id) => apiFetch.delete(`/classes/students/${id}`),
};

export const subjectsApi = {
  getAll: () => apiFetch.get('/subjects'),
};

// Student / class-level operations (moved from printRequestsApi.js)
export const classesStudentsApi = {
  getStudents: (classId) => apiFetch.get(`/classes/${classId}/students`),
  getAllClasses: () => apiFetch.get('/classes'),
  createStudent: (data) => apiFetch.post('/classes/students', data),
  updateStudent: (id, data) => apiFetch.put(`/classes/students/${id}`, data),
  getStudent: (id) => apiFetch.get(`/classes/students/${id}`),
  getStudentGrades: (studentId) => apiFetch.get(`/grades/student/${studentId}`),
};
