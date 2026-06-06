import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { printRequestsApi } from '../../api/printRequestsApi';
import { teachersApi } from '../../api/usersApi';
import { messagesApi } from '../../api/messagesApi';
import useNotificationStore from '../../store/notificationStore';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { format } from 'date-fns';

function StatCard({ label, value, icon, color, to, alert }) {
  const Card = to ? Link : 'div';
  return (
    <Card to={to} className={`card p-5 flex items-center gap-4 ${to ? 'hover:shadow-md transition-shadow' : ''} ${alert ? 'ring-2 ring-red-400' : ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {alert && value > 0 && (
        <span className="ml-auto flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
      )}
    </Card>
  );
}

export default function SecretaryDashboard() {
  const { unreadCount } = useNotificationStore();
  const [stats, setStats] = useState({ pending: 0, urgent: 0, teachers: 0, unreadMsg: 0 });
  const [recentUrgent, setRecentUrgent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      printRequestsApi.getAll({ status: 'pending', limit: 1 }),
      printRequestsApi.getAll({ priority: 'urgent', status: 'pending', limit: 5 }),
      teachersApi.getAll({ limit: 1 }),
      messagesApi.getInbox(),
    ]).then(([pendingRes, urgentRes, teachersRes, msgRes]) => {
      setStats({
        pending: pendingRes.data.pagination?.total || 0,
        urgent: urgentRes.data.pagination?.total || 0,
        teachers: teachersRes.data.pagination?.total || 0,
        unreadMsg: (msgRes.data.data || []).filter((m) => !m.is_read).length,
      });
      setRecentUrgent(urgentRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card p-6 bg-gradient-to-r from-pink-600 to-pink-800 text-white">
        <h2 className="text-2xl font-bold">Secretary Dashboard 📋</h2>
        <p className="mt-1 text-white/80">
          {stats.urgent > 0
            ? `⚠️ You have ${stats.urgent} urgent request${stats.urgent > 1 ? 's' : ''} awaiting attention!`
            : 'All urgent requests are handled.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Requests" value={stats.pending} icon="🖨️" color="bg-blue-100" to="/secretary/print-center" />
        <StatCard label="Urgent Requests" value={stats.urgent} icon="🚨" color="bg-red-100" to="/secretary/print-center?priority=urgent" alert />
        <StatCard label="Total Teachers" value={stats.teachers} icon="👩‍🏫" color="bg-purple-100" to="/secretary/teachers" />
        <StatCard label="Unread Messages" value={stats.unreadMsg} icon="✉️" color="bg-yellow-100" to="/secretary/messages" />
      </div>

      {/* Urgent Queue */}
      {recentUrgent.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🚨</span> Urgent Requests
            </h3>
            <Link to="/secretary/print-center?priority=urgent" className="text-sm text-primary-600">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUrgent.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-medium text-gray-900">{req.teacher_name}</p>
                  <p className="text-sm text-gray-600">
                    {req.subject_name} · {req.total_copies} copies
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM yyyy') : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge label="urgent" variant="urgent" pulse />
                  <Badge label={req.status} variant={req.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
