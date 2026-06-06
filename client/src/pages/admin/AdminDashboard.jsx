import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import { printRequestsApi } from '../../api/printRequestsApi';
import useNotificationStore from '../../store/notificationStore';
import Spinner from '../../components/common/Spinner';

function StatCard({ label, value, icon, color, to }) {
  const inner = (
    <div className={`card p-5 flex items-center gap-4 ${to ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { unreadCount } = useNotificationStore();
  const [stats, setStats] = useState({ teachers: 0, secretaries: 0, totalUsers: 0, printRequests: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [teachRes, secRes, allUsersRes] = await Promise.all([
          usersApi.getAll({ role: 'teacher', limit: 1 }),
          usersApi.getAll({ role: 'secretary', limit: 1 }),
          usersApi.getAll({ limit: 5 }),
        ]);

        if (!mounted) return;

        setStats((prev) => ({
          ...prev,
          teachers: teachRes.data?.pagination?.total ?? teachRes.data?.data?.length ?? 0,
          secretaries: secRes.data?.pagination?.total ?? secRes.data?.data?.length ?? 0,
          totalUsers: allUsersRes.data?.pagination?.total ?? allUsersRes.data?.data?.length ?? 0,
        }));

        const fetchedUsers = allUsersRes.data?.data;
        setRecentUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }

      try {
        const printRes = await printRequestsApi.getAll({ limit: 100 });
        if (mounted) {
          setStats((prev) => ({ ...prev, printRequests: printRes.data?.pagination?.total || 0 }));
        }
      } catch {
        // print requests count stays 0
      }

      if (mounted) setLoading(false);
    }

    loadData();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="card p-6 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white">
        <h2 className="text-2xl font-bold">Admin Dashboard ⚙️</h2>
        <p className="mt-1 text-white/80">Full system control and management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="bg-blue-100" to="/admin/users" />
        <StatCard label="Teachers" value={stats.teachers} icon="👩‍🏫" color="bg-teal-100" to="/admin/users" />
        <StatCard label="Secretaries" value={stats.secretaries} icon="💼" color="bg-pink-100" to="/admin/users" />
        <StatCard label="Print Requests" value={stats.printRequests} icon="🖨️" color="bg-purple-100" />
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

      {/* Recent Users */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Users</h3>
          <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">View all →</Link>
        </div>

        {recentUsers.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">No users found.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                  u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                  u.role === 'teacher' ? 'bg-teal-100 text-teal-700' :
                  'bg-pink-100 text-pink-700'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
