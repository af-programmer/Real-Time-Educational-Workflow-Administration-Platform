import { useEffect, useState } from 'react';
import { classesApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classesApi.getAll()
      .then((r) => setClasses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div key={cls.id} className="card p-5">
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
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-20 card text-gray-400">
          <div className="text-5xl mb-3">🏫</div>
          <p>No classes found. Run the database seed to populate classes.</p>
        </div>
      )}
    </div>
  );
}
