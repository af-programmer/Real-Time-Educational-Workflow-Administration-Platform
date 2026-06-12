import apiFetch from './apiFetch';

export const authApi = {
  login: (credentials) => apiFetch.post('/auth/login', credentials),
  logout: () => apiFetch.post('/auth/logout'),
  me: () => apiFetch.get('/auth/me'),
  resetPassword: (userId, newPassword) =>
    apiFetch.post('/auth/reset-password', { userId, newPassword }),
};
