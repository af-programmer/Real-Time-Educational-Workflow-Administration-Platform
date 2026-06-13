import apiFetch from './apiFetch';

const analyticsApi = {
  getGrades: () => apiFetch.get('/admin/analytics/grades'),
  getPrintRequests: () => apiFetch.get('/admin/analytics/print-requests'),
};

export default analyticsApi;
