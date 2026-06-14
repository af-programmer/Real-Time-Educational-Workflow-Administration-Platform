import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';

export default function StaffList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derive filter state from URL
  const search     = searchParams.get('search') || '';
  const roleFilter = searchParams.get('role')   || '';
  const page       = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const setSearch = useCallback((val) => {
    setSearchParams((prev) => {
      const out = new URLSearchParams(prev);
      if (val) out.set('search', val); else out.delete('search');
      out.delete('page');
      return out;
    }, { replace: true });
  }, [setSearchParams]);

  const setRoleFilter = useCallback((val) => {
    setSearchParams((prev) => {
      const out = new URLSearchParams(prev);
      if (val) out.set('role', val); else out.delete('role');
      out.delete('page');
      return out;
    }, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback((p) => {
    setSearchParams((prev) => {
      const out = new URLSearchParams(prev);
      if (p > 1) out.set('page', String(p)); else out.delete('page');
      return out;
    }, { replace: true });
  }, [setSearchParams]);

  const load = useCallback(() => {
    setLoading(true);
    usersApi.getAll({ search, role: roleFilter || undefined, page, limit: 20 })
      .then((r) => {
        // Exclude admins from staff list display
        const data = (r.data.data || []).filter((u) => u.role !== 'admin');
        setUsers(data);
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
          placeholder="Search by name or email..."
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="">All Staff</option>
          <option value="all_teachers">All Teachers</option>
          <option value="teacher">Professional Teachers</option>
          <option value="Educator">Edocators</option>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold text-xl flex-shrink-0 overflow-hidden">
                    {u.avatar_url
                      ? <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${u.avatar_url}`} alt={u.name} className="h-full w-full object-cover" />
                      : u.name?.[0]?.toUpperCase()
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{u.name}</p>
                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {u.role === 'Educator'
                        ? <Badge label="EDUCATOR" variant="Educator" />
                        : u.role === 'teacher'
                          ? <Badge label="Professional Teacher" variant="professional_teacher" />
                          : <Badge label={u.role.charAt(0).toUpperCase() + u.role.slice(1)} variant={u.role} />}
                      {u.is_blocked  && <Badge label="Blocked"   variant="urgent"  />}
                      {!u.is_active  && <Badge label="Inactive"  variant="pending" />}
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
