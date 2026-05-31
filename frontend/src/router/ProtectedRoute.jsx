import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const roleHome = { admin: '/admin', secretary: '/secretary', teacher: '/teacher' };
    return <Navigate to={roleHome[user?.role] || '/login'} replace />;
  }

  return <Outlet />;
}
