import apiFetch from './apiFetch';

export const notificationsApi = {
  getAll: (params) => apiFetch.get('/notifications', { params }),
  markAllRead: () => apiFetch.patch('/notifications/read-all'),
  markOneRead: (id) => apiFetch.patch(`/notifications/${id}/read`),
  createAnnouncement: (data) => apiFetch.post('/notifications/announcement', data),
};
