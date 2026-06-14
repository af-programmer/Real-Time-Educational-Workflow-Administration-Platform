import apiFetch from './apiFetch';

export const messagesApi = {
  getInbox: () => apiFetch.get('/messages'),
  send: (data, file) => {
    const form = new FormData();
    const { recipient_ids, ...rest } = data;
    form.append('recipient_ids', JSON.stringify(recipient_ids));
    Object.entries(rest).forEach(([k, v]) => v != null && form.append(k, String(v)));
    if (file) form.append('attachment', file);
    return apiFetch.post('/messages', form);
  },
  markRead: (id) => apiFetch.patch(`/messages/${id}/read`),
  delete: (id) => apiFetch.delete(`/messages/${id}`),
};
