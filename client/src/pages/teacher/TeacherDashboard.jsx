import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { printRequestsApi } from '../../api/printRequestsApi';
import { messagesApi } from '../../api/messagesApi';
import { teachersApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import DailyQuote from '../../components/common/DailyQuote';
import { format } from 'date-fns';

function StatCard({ label, value, icon, color, to }) {
  const Card = to ? Link : 'div';
  return (
    <Card to={to} className={`card p-5 flex items-center gap-4 ${to ? 'hover:shadow-md transition-shadow' : ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [profile, setProfile] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      teachersApi.getMe(),
      printRequestsApi.getMine({ limit: 5 }),
      messagesApi.getInbox(),
    ]).then(([profileRes, reqRes, msgRes]) => {
      setProfile(profileRes.data.data);
      setRecentRequests(reqRes.data.data || []);
      setUnreadMessages(msgRes.data.data?.filter((m) => !m.is_read).length || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      <DailyQuote role="teacher" />

      {/* Welcome */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h2 className="text-2xl font-bold">Good day, {user?.name}! 👋</h2>
        <p className="mt-1 text-white/80">
          You educate {profile?.classes?.length || 0} classes and teach{' '}
          {profile?.subjects?.length || 0} subjects.
        </p>
      </div>

      {/* Homeroom Classes */}
      {user?.is_homeroom && profile?.homeroomClasses?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">🏠 My Homeroom Classes</h3>
          <div className="flex flex-wrap gap-3">
            {profile.homeroomClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 border border-primary-200">
                <div>
                  <p className="font-semibold text-primary-800">{cls.name}</p>
                  <p className="text-xs text-primary-600">{cls.grade_level} · {cls.student_count} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Classes" value={profile?.classes?.length || 0} icon="🏫" color="bg-blue-100" to="/teacher/classes" />
        <StatCard label="Print Requests" value={recentRequests.length} icon="🖨️" color="bg-purple-100" to="/teacher/print-requests" />
        <StatCard label="Unread Messages" value={unreadMessages} icon="✉️" color="bg-pink-100" to="/teacher/messages" />
        <StatCard label="Notifications" value={unreadCount} icon="🔔" color="bg-yellow-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Classes & Subjects */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">My Classes & Subjects</h3>
          {profile?.classes?.length ? (
            <div className="space-y-2">
              {profile.classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    <p className="text-xs text-gray-500">{cls.grade_level}</p>
                  </div>
                  <span className="text-sm text-gray-500">{cls.student_count} students</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No classes assigned yet.</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {profile?.subjects?.map((s) => (
                <span key={s.id} className="text-xs bg-primary-100 text-primary-700 rounded-full px-3 py-1">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Print Requests */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Print Requests</h3>
            <Link to="/teacher/print-requests" className="text-sm text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          {recentRequests.length ? (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.subject_name}</p>
                    <p className="text-xs text-gray-500">
                      {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM') : ''} · {req.total_copies} copies
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge label={req.priority} variant={req.priority} />
                    <Badge label={req.status} variant={req.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <div className="text-3xl mb-2">🖨️</div>
              <p className="text-sm">No requests yet</p>
              <Link to="/teacher/new-print-request" className="text-sm text-primary-600 mt-2 block">
                Create your first request →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
