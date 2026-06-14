import apiFetch from './apiFetch';

export const messagesApi = {
  getInbox: () => apiFetch.get('/messages'),
  send: (data, file) => {
    const form = new FormData();
    // Accept either `recipient_ids` (array), `recipient_id` (single), or `recipient_role` (string)
    const { recipient_ids, recipient_id, recipient_role, ...rest } = data || {};
    if (recipient_ids && Array.isArray(recipient_ids)) {
      form.append('recipient_ids', JSON.stringify(recipient_ids));
    } else if (recipient_id != null) {
      form.append('recipient_ids', JSON.stringify([Number(recipient_id)]));
    } else if (recipient_role) {
      form.append('recipient_role', String(recipient_role));
    }
    Object.entries(rest).forEach(([k, v]) => v != null && form.append(k, String(v)));
    if (file) form.append('attachment', file);
    return apiFetch.post('/messages', form);
  },
  markRead: (id) => apiFetch.patch(`/messages/${id}/read`),
  delete: (id) => apiFetch.delete(`/messages/${id}`),
};
