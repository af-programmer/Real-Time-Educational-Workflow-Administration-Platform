import { useEffect, useState } from 'react';
import { classesApi } from '../../api/usersApi';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const EMPTY = { name: '', date_of_birth: '', parent_phone: '', parent_email: '' };

function StudentFormModal({ classId, student, onSave, onClose }) {
  const [form, setForm] = useState(
    student
      ? { name: student.name, date_of_birth: student.date_of_birth?.slice(0, 10) || '', parent_phone: student.parent_phone || '', parent_email: student.parent_email || '' }
      : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    // normalize empty strings to null for unique/optional fields
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim() === '' ? null : v.trim()])
    );
    try {
      if (student) {
        await classesApi.updateStudent(student.id, payload);
      } else {
        await classesApi.createStudent({ ...payload, class_id: classId });
      }
      onSave();
    } catch {
      toast.error('Failed to save student');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{student ? 'Edit Student' : 'Add Student'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Name *', key: 'name', type: 'text' },
            { label: 'Date of Birth', key: 'date_of_birth', type: 'date' },
            { label: 'Parent Phone', key: 'parent_phone', type: 'text' },
            { label: 'Parent Email', key: 'parent_email', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-4 py-2 text-sm">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransferModal({ student, classes, currentClassId, onTransferred, onClose }) {
  const [targetClassId, setTargetClassId] = useState('');
  const [saving, setSaving] = useState(false);
  const options = classes.filter((c) => c.id !== currentClassId);

  async function handleTransfer() {
    if (!targetClassId) return toast.error('Please select a class');
    setSaving(true);
    try {
      await classesApi.updateStudent(student.id, { class_id: targetClassId });
      toast.success(`${student.name} transferred successfully`);
      onTransferred();
    } catch {
      toast.error('Failed to transfer student');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Transfer Student</h2>
        <p className="text-sm text-gray-500 mb-4">{student.name}</p>
        <select
          value={targetClassId}
          onChange={(e) => setTargetClassId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Select target class…</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>{c.name} — {c.grade_level}</option>
          ))}
        </select>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={handleTransfer} disabled={saving} className="btn-primary px-4 py-2 text-sm">
            {saving ? 'Transferring…' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentsModal({ cls, classes, onClose }) {
  const [students, setStudents] = useState(cls.students || []);
  const [editTarget, setEditTarget] = useState(null);
  const [transferTarget, setTransferTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  async function refresh() {
    try {
      const r = await classesApi.getById(cls.id);
      setStudents(r.data.data.students || []);
    } catch {}
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete "${student.name}"?`)) return;
    try {
      await classesApi.deleteStudent(student.id);
      toast.success('Student deleted');
      refresh();
    } catch {
      toast.error('Failed to delete student');
    }
  }

  function handleSaved() {
    toast.success('Student saved');
    setShowAdd(false);
    setEditTarget(null);
    refresh();
  }

  function handleTransferred() {
    setTransferTarget(null);
    refresh();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{cls.name} — {cls.grade_level}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdd(true)}
                className="btn-primary text-sm px-3 py-1.5"
              >
                + Add Student
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
          </div>
          <div className="overflow-auto flex-1">
            {students.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No students in this class.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Phone</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-600">{s.parent_phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{s.parent_email || '—'}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => setEditTarget(s)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setTransferTarget(s)}
                          className="text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
                        >
                          Transfer
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {(showAdd || editTarget) && (
        <StudentFormModal
          classId={cls.id}
          student={editTarget || null}
          onSave={handleSaved}
          onClose={() => { setShowAdd(false); setEditTarget(null); }}
        />
      )}

      {transferTarget && (
        <TransferModal
          student={transferTarget}
          classes={classes}
          currentClassId={cls.id}
          onTransferred={handleTransferred}
          onClose={() => setTransferTarget(null)}
        />
      )}
    </>
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

      {selected && <StudentsModal cls={selected} classes={classes} onClose={() => setSelected(null)} />}
    </div>
  );
}
