import apiFetch from './apiFetch';

export const messagesApi = {
  getInbox: () => apiFetch.get('/messages'),
  send: (data, file) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => v != null && form.append(k, String(v)));
    if (file) form.append('attachment', file);
    return apiFetch.post('/messages', form);
  },
  markRead: (id) => apiFetch.patch(`/messages/${id}/read`),
  delete: (id) => apiFetch.delete(`/messages/${id}`),
};
