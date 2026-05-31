import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me'),
  resetPassword: (userId, newPassword) =>
    axiosInstance.post('/auth/reset-password', { userId, newPassword }),
};
