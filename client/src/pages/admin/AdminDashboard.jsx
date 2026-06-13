import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import useNotificationStore from '../../store/notificationStore';
import Spinner from '../../components/common/Spinner';
import DailyQuote from '../../components/common/DailyQuote';
import StatCard from '../../components/common/StatCard';
import AdminAnalyticsDashboard from '../../components/analytics/AdminAnalyticsDashboard';

export default function AdminDashboard() {
  const { unreadCount } = useNotificationStore();
  const [stats, setStats] = useState({ teachers: 0, secretaries: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [teachRes, secRes, allUsersRes] = await Promise.all([
          usersApi.getAll({ role: 'teacher', limit: 1 }),
          usersApi.getAll({ role: 'secretary', limit: 1 }),
          usersApi.getAll({ limit: 1 }),
        ]);

        if (!mounted) return;

        setStats({
          teachers: teachRes.data?.pagination?.total ?? teachRes.data?.data?.length ?? 0,
          secretaries: secRes.data?.pagination?.total ?? secRes.data?.data?.length ?? 0,
          totalUsers: allUsersRes.data?.pagination?.total ?? allUsersRes.data?.data?.length ?? 0,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }

      if (mounted) setLoading(false);
    }

    loadData();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      <DailyQuote role="admin" />

      {/* Banner */}
      <div className="card p-6 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white">
        <h2 className="text-2xl font-bold">Admin Dashboard ⚙️</h2>
        <p className="mt-1 text-white/80">Full system control and management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="bg-blue-100" to="/admin/users" />
        <StatCard label="Teachers" value={stats.teachers} icon="👩🏫" color="bg-teal-100" to="/admin/users?role=teacher" />
        <StatCard label="Secretaries" value={stats.secretaries} icon="💼" color="bg-pink-100" to="/admin/users?role=secretary" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/users" className="card p-5 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">👤</div>
          <p className="font-semibold text-gray-900">Manage Users</p>
          <p className="text-sm text-gray-500 mt-1">Create, edit, block users</p>
        </Link>
        <Link to="/admin/classes" className="card p-5 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🏫</div>
          <p className="font-semibold text-gray-900">Manage Classes</p>
          <p className="text-sm text-gray-500 mt-1">View and manage classes</p>
        </Link>
        <Link to="/admin/announcements" className="card p-5 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📢</div>
          <p className="font-semibold text-gray-900">Announcements</p>
          <p className="text-sm text-gray-500 mt-1">Send system-wide messages</p>
        </Link>
      </div>

      <AdminAnalyticsDashboard />
    </div>
  );
}
