import axiosInstance from './axiosInstance';

export const messagesApi = {
  getInbox: () => axiosInstance.get('/messages'),
  send: (data) => axiosInstance.post('/messages', data),
  broadcast: (data) => axiosInstance.post('/messages/broadcast', data),
  markRead: (id) => axiosInstance.patch(`/messages/${id}/read`),
};
