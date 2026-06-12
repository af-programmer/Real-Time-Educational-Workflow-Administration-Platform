import apiFetch from './apiFetch';

export const notificationsApi = {
  getAll: () => apiFetch.get('/notifications'),
  markAllRead: () => apiFetch.patch('/notifications/read-all'),
  markOneRead: (id) => apiFetch.patch(`/notifications/${id}/read`),
  createAnnouncement: (data) => apiFetch.post('/notifications/announcement', data),
};
