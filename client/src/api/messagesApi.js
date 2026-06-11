import axiosInstance from './axiosInstance';

export const messagesApi = {
  getInbox: () => axiosInstance.get('/messages'),
  send: (data, file) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => v != null && form.append(k, String(v)));
    if (file) form.append('attachment', file);
    return axiosInstance.post('/messages', form);
  },
  markRead: (id) => axiosInstance.patch(`/messages/${id}/read`),
  delete: (id) => axiosInstance.delete(`/messages/${id}`),
};
