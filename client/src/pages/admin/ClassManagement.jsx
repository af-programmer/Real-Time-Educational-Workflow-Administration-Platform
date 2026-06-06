import { useEffect, useState } from 'react';
import { classesApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';

function StudentsModal({ cls, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {cls.name} — {cls.grade_level} Students
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-auto flex-1">
          {cls.students.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No students in this class.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cls.students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.parent_phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.parent_email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [loadingClass, setLoadingClass] = useState(false);

  useEffect(() => {
    classesApi.getAll()
      .then((r) => setClasses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleClassClick(cls) {
    setLoadingClass(true);
    try {
      const r = await classesApi.getById(cls.id);
      setSelected(r.data.data);
    } catch {
      setSelected({ ...cls, students: [] });
    } finally {
      setLoadingClass(false);
    }
  }

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5">
      {loadingClass && <Spinner className="py-4" />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => handleClassClick(cls)}
            className="card p-5 text-left hover:shadow-md hover:ring-2 hover:ring-primary-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{cls.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{cls.grade_level}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <div className="text-center">
                  <p className="text-xl font-bold leading-none">{cls.student_count}</p>
                  <p className="text-xs">pupils</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Academic Year: {cls.academic_year || 'N/A'}</p>
          </button>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-20 card text-gray-400">
          <div className="text-5xl mb-3">🏫</div>
          <p>No classes found. Run the database seed to populate classes.</p>
        </div>
      )}

      {selected && <StudentsModal cls={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
