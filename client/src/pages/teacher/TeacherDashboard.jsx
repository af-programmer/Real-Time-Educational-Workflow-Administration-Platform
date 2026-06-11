import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { printRequestsApi } from '../../api/printRequestsApi';
import { messagesApi } from '../../api/messagesApi';
import { teachersApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import DailyQuote from '../../components/common/DailyQuote';
import StatCard from '../../components/common/StatCard';
import ClassesSubjectsCard from '../../components/dashboard/ClassesSubjectsCard';
import RecentPrintRequestsCard from '../../components/dashboard/RecentPrintRequestsCard';

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

      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h2 className="text-2xl font-bold">Good day, {user?.name}! 👋</h2>
        <p className="mt-1 text-white/80">
          You educate {profile?.classes?.length || 0} classes and teach {profile?.subjects?.length || 0} subjects.
        </p>
      </div>

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Classes" value={profile?.classes?.length || 0} icon="🏫" color="bg-blue-100" to="/teacher/classes" />
        <StatCard label="Print Requests" value={recentRequests.length} icon="🖨️" color="bg-purple-100" to="/teacher/print-requests" />
        <StatCard label="Unread Messages" value={unreadMessages} icon="✉️" color="bg-pink-100" to="/teacher/messages" />
        <StatCard label="Notifications" value={unreadCount} icon="🔔" color="bg-yellow-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ClassesSubjectsCard profile={profile} />
        <RecentPrintRequestsCard recentRequests={recentRequests} />
      </div>
    </div>
  );
}
