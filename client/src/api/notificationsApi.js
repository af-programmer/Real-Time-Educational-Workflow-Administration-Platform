import axiosInstance from './axiosInstance';

export const notificationsApi = {
  getAll: () => axiosInstance.get('/notifications'),
  markAllRead: () => axiosInstance.patch('/notifications/read-all'),
  markOneRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
  createAnnouncement: (data) => axiosInstance.post('/notifications/announcement', data),
};
