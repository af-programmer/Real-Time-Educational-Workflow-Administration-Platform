import axiosInstance from './axiosInstance';

export const gradesApi = {
  getMyClasses: () => axiosInstance.get('/grades/my-classes'),
  getMySubjects: () => axiosInstance.get('/grades/my-subjects'),
  getMyGrades: (params) => axiosInstance.get('/grades/mine', { params }),
  create: (data) => axiosInstance.post('/grades', data),
  update: (id, data) => axiosInstance.put(`/grades/${id}`, data),
  getStudentGrades: (studentId) => axiosInstance.get(`/grades/student/${studentId}`),
};
