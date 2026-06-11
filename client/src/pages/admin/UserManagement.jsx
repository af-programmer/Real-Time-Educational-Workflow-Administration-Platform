import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersApi, classesApi, subjectsApi } from '../../api/usersApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import UserFilters from '../../components/users/UserFilters';
import CreateUserModal from '../../components/users/CreateUserModal';
import AssignModal from '../../components/users/AssignModal';

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: searchParams.get('role') || '', search: '', page: 1 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setFilters({ role: searchParams.get('role') || '', search: '', page: 1 });
  }, [searchParams]);

  const load = () => {
    setLoading(true);
    usersApi.getAll(filters)
      .then((r) => {
        const data = r.data?.data;
        setUsers(Array.isArray(data) ? data : []);
        setPagination(r.data?.pagination || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters]);

  useEffect(() => {
    classesApi.getAll().then((r) => setClasses(r.data.data || [])).catch(() => {});
    subjectsApi.getAll().then((r) => setSubjects(r.data.data || [])).catch(() => {});
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
      render: (role, row) => {
        const homeroom = role === 'teacher' && row.is_homeroom;
        return <Badge label={homeroom ? 'Teacher Educator' : role.charAt(0).toUpperCase() + role.slice(1)} variant={homeroom ? 'homeroom_teacher' : role} />;
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
          {row.role === 'teacher' && (
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
      <AssignModal user={showAssignModal} classes={classes} subjects={subjects} onClose={() => setShowAssignModal(null)} />
    </div>
  );
}
