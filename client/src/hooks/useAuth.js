import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const { setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      const roleRoutes = { admin: '/admin', secretary: '/secretary', teacher: '/teacher' };
      navigate(roleRoutes[data.user.role] || '/');
      return null;
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      let errorMsg;
      if (status === 401) errorMsg = 'Incorrect email or password.';
      else if (status === 403) errorMsg = msg || 'Account suspended or inactive. Contact an administrator.';
      else if (status === 429) errorMsg = 'Too many login attempts. Please wait a moment and try again.';
      else errorMsg = msg || 'Login failed. Please try again.';
      toast.error(errorMsg);
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    storeLogout();
    navigate('/login');
    toast.success('Logged out successfully.');
  };

  return { login, logout, loading };
}
