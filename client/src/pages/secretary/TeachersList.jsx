import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teachersApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    teachersApi.getAll({ search, page, limit: 20 })
      .then((r) => {
        setTeachers(r.data.data || []);
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="card p-4">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input max-w-md"
          placeholder="Search teachers by name or email..."
        />
      </div>

      {/* Teacher Grid */}
      {loading ? (
        <Spinner className="py-16" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <Link
                key={teacher.id}
                to={`/secretary/teachers/${teacher.id}`}
                className="card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold text-xl flex-shrink-0">
                    {teacher.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {teacher.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {teacher.is_homeroom
                        ? <Badge label="EDUCATOR" variant="homeroom_teacher" />
                        : <Badge label="Professional Teacher" variant="professional_teacher" />}
                      {teacher.is_blocked && <Badge label="Blocked" variant="urgent" />}
                      {!teacher.is_active && <Badge label="Inactive" variant="pending" />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {teachers.length === 0 && (
            <div className="text-center py-16 card text-gray-400">
              <div className="text-5xl mb-3">👩‍🏫</div>
              <p>No teachers found</p>
            </div>
          )}

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
