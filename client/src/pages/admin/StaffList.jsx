import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    usersApi.getAll({ search, role: roleFilter || undefined, page, limit: 20 })
      .then((r) => {
        setUsers((r.data.data || []).filter((u) => u.role !== 'admin'));
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  return (
    <div className="space-y-5">
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input max-w-xs"
          placeholder="Search by name or email..."
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          <option value="">All Staff</option>
          <option value="teacher">Teachers</option>
          <option value="secretary">Secretaries</option>
        </select>
      </div>

      {loading ? <Spinner className="py-16" /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => (
              <Link
                key={u.id}
                to={`/admin/staff/${u.id}`}
                className="card p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold text-xl flex-shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{u.name}</p>
                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge label={u.role} variant={u.role} />
                      {u.is_blocked && <Badge label="Blocked" variant="urgent" />}
                      {!u.is_active && <Badge label="Inactive" variant="pending" />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {users.length === 0 && (
            <div className="text-center py-16 card text-gray-400">
              <div className="text-5xl mb-3">👥</div>
              <p>No staff found</p>
            </div>
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
