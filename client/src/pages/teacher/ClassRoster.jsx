import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import apiFetch from '../../api/apiFetch';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ClassRoster() {
  const { classId } = useParams();
  const [students, setStudents] = useState(null);
  const [className, setClassName] = useState('');
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch.get(`/classes/${classId}/students`),
      apiFetch.get(`/classes/${classId}`),
    ])
      .then(([studentsRes, classRes]) => {
        setStudents(studentsRes.data.data || []);
        setClassName(classRes.data.data?.name || `Class ${classId}`);
      })
      .catch((err) => {
        if (err.status === 403) {
          setAllowed(false);
        } else {
          toast.error('Failed to load roster.');
          setStudents([]);
        }
      });
  }, [classId]);

  if (!allowed) return <Navigate to="/teacher/grades" replace />;
  if (students === null) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/teacher/grades" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
        <h2 className="text-xl font-bold text-gray-900">{className} — Roster</h2>
        <span className="ml-auto text-sm text-gray-400">{students.length} students</span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium w-10">#</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Student Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">ID Number</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Student #</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Father's Phone</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Mother's Phone</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Home Phone</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Parent Email</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Date of Birth</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium w-32">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.id_number || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.student_number || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.phone_father || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.phone_mother || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.phone_home || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.parent_email || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString('en-GB') : '—'}</td>
                <td className="px-4 py-3">
                  <div className="h-7 w-24 border border-gray-200 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">No students in this class.</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="btn-ghost text-sm px-4 py-2"
        >
          🖨️ Print Roster
        </button>
      </div>
    </div>
  );
}
