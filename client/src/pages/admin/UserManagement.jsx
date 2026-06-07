import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersApi, classesApi, subjectsApi } from '../../api/usersApi';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: searchParams.get('role') || '', search: '', page: 1 });

  useEffect(() => {
    setFilters({ role: searchParams.get('role') || '', search: '', page: 1 });
  }, [searchParams]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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

  const createUser = async (data) => {
    setSubmitting(true);
    try {
      await usersApi.create(data);
      toast.success('User created!');
      setShowCreateModal(false);
      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBlock = async (user) => {
    try {
      await usersApi.block(user.id, !user.is_blocked);
      toast.success(user.is_blocked ? 'User unblocked.' : 'User blocked.');
      load();
    } catch {
      toast.error('Failed to update user.');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersApi.delete(id);
      toast.success('User deleted.');
      load();
    } catch {
      toast.error('Failed to delete user.');
    }
  };

  const openAssign = async (user) => {
    setShowAssignModal(user);
    setSelectedClasses([]);
    setSelectedSubjects([]);
    try {
      const r = await usersApi.getProfile(user.id);
      const profile = r.data.data;
      setSelectedClasses((profile.classes || []).map((c) => c.id));
      setSelectedSubjects((profile.subjects || []).map((s) => s.id));
    } catch {}
  };

  const saveAssign = async () => {
    if (!showAssignModal) return;
    setSubmitting(true);
    try {
      if (selectedClasses.length) {
        await usersApi.assignClasses(showAssignModal.id, selectedClasses);
      }
      if (selectedSubjects.length) {
        await usersApi.assignSubjects(showAssignModal.id, selectedSubjects);
      }
      toast.success('Assignments saved!');
      setShowAssignModal(null);
    } catch {
      toast.error('Failed to save assignments.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role', header: 'Role',
      render: (role) => <Badge label={role} variant={role} />,
    },
    {
      key: 'is_active', header: 'Status',
      render: (_, row) => (
        <div className="flex gap-1">
          {row.is_blocked && <Badge label="Blocked" variant="urgent" />}
          {!row.is_active ? <Badge label="Inactive" variant="pending" /> : <Badge label="Active" variant="completed" />}
        </div>
      ),
    },
    {
      key: 'created_at', header: 'Joined',
      render: (date) => format(new Date(date), 'dd MMM yyyy'),
    },
    {
      key: 'actions', header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.role === 'teacher' && (
            <button onClick={() => openAssign(row)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Assign
            </button>
          )}
          <button onClick={() => toggleBlock(row)}
            className={clsx('text-xs font-medium', row.is_blocked ? 'text-green-600' : 'text-yellow-600')}>
            {row.is_blocked ? 'Unblock' : 'Block'}
          </button>
          <button onClick={() => deleteUser(row.id)}
            className="text-xs text-red-600 hover:text-red-700 font-medium">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="label">Role</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value, page: 1 }))}
            className="input"
          >
            <option value="">All Roles</option>
            <option value="teacher">Teacher</option>
            <option value="secretary">Secretary</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="label">Search</label>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            className="input"
            placeholder="Name or email..."
          />
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="ml-auto">+ New User</Button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found." />
      </div>
      <Pagination pagination={pagination} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); reset(); }} title="Create New User">
        <form onSubmit={handleSubmit(createUser)} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input {...register('name', { required: true })} className="input" placeholder="John Doe" />
          </div>
          <div>
            <label className="label">Email *</label>
            <input {...register('email', { required: true })} type="email" className="input" />
          </div>
          <div>
            <label className="label">Password *</label>
            <input {...register('password', { required: true, minLength: 8 })} type="password" className="input" />
          </div>
          <div>
            <label className="label">Role *</label>
            <select {...register('role', { required: true })} className="input">
              <option value="">Select role...</option>
              <option value="teacher">Teacher</option>
              <option value="secretary">Secretary</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} type="tel" className="input" placeholder="+1 555..." />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => { setShowCreateModal(false); reset(); }}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create User</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={!!showAssignModal} onClose={() => setShowAssignModal(null)} title={`Assign to ${showAssignModal?.name}`} size="lg">
        <div className="space-y-5">
          <div>
            <p className="label mb-2">Classes</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classes.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(c.id)}
                    onChange={(e) => setSelectedClasses((prev) =>
                      e.target.checked ? [...prev, c.id] : prev.filter((x) => x !== c.id)
                    )}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{c.name} ({c.student_count})</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="label mb-2">Subjects</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(s.id)}
                    onChange={(e) => setSelectedSubjects((prev) =>
                      e.target.checked ? [...prev, s.id] : prev.filter((x) => x !== s.id)
                    )}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{s.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowAssignModal(null)}>Cancel</Button>
            <Button onClick={saveAssign} loading={submitting}>Save Assignments</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
