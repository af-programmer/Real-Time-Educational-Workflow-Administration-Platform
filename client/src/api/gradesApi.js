import apiFetch from './apiFetch';

export const gradesApi = {
  getMyClasses: () => apiFetch.get('/grades/my-classes'),
  getMySubjects: () => apiFetch.get('/grades/my-subjects'),
  getMyGrades: (params) => apiFetch.get('/grades/mine', { params }),
  getExamTypes: () => apiFetch.get('/grades/exam-types'),
  create: (data) => apiFetch.post('/grades', data),
  update: (id, data) => apiFetch.put(`/grades/${id}`, data),
  getStudentGrades: (studentId) => apiFetch.get(`/grades/student/${studentId}`),
};
