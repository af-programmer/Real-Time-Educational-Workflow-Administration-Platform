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

      const roleRoutes = {
        admin: '/admin',
        secretary: '/secretary',
        teacher: '/teacher',
      };
      navigate(roleRoutes[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
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
