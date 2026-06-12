import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { printRequestsApi } from '../../api/printRequestsApi';
import { messagesApi } from '../../api/messagesApi';
import { teachersApi } from '../../api/usersApi';
import { classesStudentsApi } from '../../api/usersApi';
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
  const [rosterClass, setRosterClass] = useState(null);
  const [rosterStudents, setRosterStudents] = useState(null);
  const [rosterLoading, setRosterLoading] = useState(false);

  const isHomeroom = !!user?.is_homeroom;

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

  const handleClassClick = async (cls) => {
    if (rosterClass?.id === cls.id) { setRosterClass(null); setRosterStudents(null); return; }
    setRosterClass(cls);
    setRosterStudents(null);
    setRosterLoading(true);
    try {
      const r = await classesStudentsApi.getStudents(cls.id);
      setRosterStudents(r.data.data || []);
    } catch { setRosterStudents([]); }
    finally { setRosterLoading(false); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      <DailyQuote role="teacher" />

      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h2 className="text-2xl font-bold">Good day, {user?.name}! 👋</h2>
        <p className="mt-1 text-white/80">
          {isHomeroom
            ? `You educate ${profile?.classes?.length || 0} classes and teach ${profile?.subjects?.length || 0} subjects.`
            : `You teach ${profile?.subjects?.length || 0} subject${(profile?.subjects?.length || 0) !== 1 ? 's' : ''} across ${profile?.classes?.length || 0} class${(profile?.classes?.length || 0) !== 1 ? 'es' : ''}.`
          }
        </p>
      </div>

      {/* Homeroom classes banner — EDUCATOR only */}
      {isHomeroom && profile?.homeroomClasses?.length > 0 && (
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

      {/* Stat cards — homeroom sees Classes link; professional sees Subjects count */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isHomeroom ? (
          <StatCard label="My Classes" value={profile?.classes?.length || 0} icon="🏫" color="bg-blue-100" to="/teacher/classes" />
        ) : (
          <StatCard label="My Subjects" value={profile?.subjects?.length || 0} icon="📖" color="bg-blue-100" />
        )}
        <StatCard label="Print Requests" value={recentRequests.length} icon="🖨️" color="bg-purple-100" to="/teacher/print-requests" />
        <StatCard label="Unread Messages" value={unreadMessages} icon="✉️" color="bg-pink-100" to="/teacher/messages" />
        <StatCard label="Notifications" value={unreadCount} icon="🔔" color="bg-yellow-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ClassesSubjectsCard profile={profile} isHomeroom={isHomeroom} onClassClick={handleClassClick} />
          {rosterClass && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Class {rosterClass.name} — Students</h4>
                <button onClick={() => { setRosterClass(null); setRosterStudents(null); }} className="text-xs text-gray-400 hover:text-gray-600">✕ Close</button>
              </div>
              {rosterLoading ? (
                <Spinner className="py-6" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-500 font-medium w-8">#</th>
                        <th className="text-left px-3 py-2 text-gray-500 font-medium">Student Name</th>
                        <th className="text-left px-3 py-2 text-gray-500 font-medium w-40">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {rosterStudents?.map((s, i) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-medium text-gray-900">{s.name}</td>
                          <td className="px-3 py-2"><div className="h-6 border border-gray-200 rounded" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!rosterStudents?.length && <p className="text-center py-6 text-gray-400 text-sm">No students in this class.</p>}
                </div>
              )}
            </div>
          )}
        </div>
        <RecentPrintRequestsCard recentRequests={recentRequests} />
      </div>
    </div>
  );
}
