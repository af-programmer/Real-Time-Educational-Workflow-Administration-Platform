import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersApi, classesApi } from '../../api/usersApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import UserFilters from '../../components/users/UserFilters';
import CreateUserModal from '../../components/users/CreateUserModal';
import AssignModal from '../../components/users/AssignModal';

const TEACHER_ROLES = ['teacher', 'Educator'];

export default function UserManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [classes, setClasses] = useState([]);

  // Derive all filter values from URL — single source of truth
  const role   = searchParams.get('role')   || '';
  const search = searchParams.get('search') || '';
  const page   = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const filters = { role, search, page };

  // URL-synced setFilters — compatible with functional updater form used by UserFilters
  const setFilters = useCallback((updater) => {
    setSearchParams((prev) => {
      const current = {
        role:   prev.get('role')   || '',
        search: prev.get('search') || '',
        page:   parseInt(prev.get('page') || '1', 10),
      };
      const next = typeof updater === 'function' ? updater(current) : updater;
      const out = new URLSearchParams();
      if (next.role)              out.set('role',   next.role);
      if (next.search)            out.set('search', next.search);
      if (next.page && next.page !== 1) out.set('page', String(next.page));
      return out;
    }, { replace: true });
  }, [setSearchParams]);

  const load = useCallback(() => {
    setLoading(true);
    usersApi.getAll({ role: role || undefined, search, page })
      .then((r) => {
        const data = Array.isArray(r.data?.data) ? r.data.data : [];
        setUsers(data);
        setPagination(r.data?.pagination || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role, search, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    classesApi.getAll().then((r) => setClasses(r.data.data || [])).catch(() => {});
  }, []);

  const toggleSuspend = async (user) => {
    try {
      await usersApi.suspend(user.id, !user.is_suspended);
      toast.success(user.is_suspended ? 'User unsuspended.' : 'User suspended.');
      load();
    } catch { toast.error('Failed to update user.'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersApi.delete(id);
      toast.success('User deleted.');
      load();
    } catch { toast.error('Failed to delete user.'); }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role', header: 'Role',
      render: (role) => {
        if (role === 'Educator') return <Badge label="EDUCATOR" variant="Educator" />;
        if (role === 'teacher') return <Badge label="Professional Teacher" variant="professional_teacher" />;
        return <Badge label={role.charAt(0).toUpperCase() + role.slice(1)} variant={role} />;
      },
    },
    {
      key: 'is_active', header: 'Status',
      render: (_, row) => (
        <div className="flex gap-1">
          {row.is_suspended && <Badge label="Suspended" variant="urgent" />}
          {!row.is_active ? <Badge label="Inactive" variant="pending" /> : <Badge label="Active" variant="completed" />}
        </div>
      ),
    },
    { key: 'created_at', header: 'Joined', render: (date) => format(new Date(date), 'dd MMM yyyy') },
    {
      key: 'actions', header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {TEACHER_ROLES.includes(row.role) && (
            <button onClick={() => setShowAssignModal(row)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Assign</button>
          )}
          <button onClick={() => toggleSuspend(row)} className={clsx('text-xs font-medium', row.is_suspended ? 'text-green-600' : 'text-yellow-600')}>
            {row.is_suspended ? 'Unsuspend' : 'Suspend'}
          </button>
          <button onClick={() => deleteUser(row.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <UserFilters filters={filters} setFilters={setFilters} onCreateClick={() => setShowCreateModal(true)} />
      <div className="card overflow-hidden">
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found." />
      </div>
      <Pagination pagination={pagination} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      <CreateUserModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} classes={classes} onCreated={load} />
      <AssignModal user={showAssignModal} classes={classes} onClose={() => setShowAssignModal(null)} />
    </div>
  );
}
