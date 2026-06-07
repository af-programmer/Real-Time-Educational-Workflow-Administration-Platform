import { useState } from 'react';
import { classesStudentsApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';

export default function StudentForm({ classId, student, classes, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: student?.name || '',
    class_id: student?.class_id || classId || '',
    parent_phone: student?.parent_phone || '',
    parent_email: student?.parent_email || '',
    date_of_birth: student?.date_of_birth ? student.date_of_birth.split('T')[0] : '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    );
    try {
      if (student) {
        await classesStudentsApi.updateStudent(student.id, payload);
        toast.success('Student updated.');
      } else {
        await classesStudentsApi.createStudent(payload);
        toast.success('Student added.');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Full Name *</label>
          <input className="input" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Class *</label>
          <select className="input" value={form.class_id} onChange={set('class_id')}>
            <option value="">Select class...</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Date of Birth</label>
          <input type="date" className="input" value={form.date_of_birth} onChange={set('date_of_birth')} />
        </div>
        <div>
          <label className="label">Parent Phone</label>
          <input className="input" value={form.parent_phone} onChange={set('parent_phone')} />
        </div>
        <div>
          <label className="label">Parent Email</label>
          <input type="email" className="input" value={form.parent_email} onChange={set('parent_email')} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2">
          {saving ? 'Saving...' : student ? 'Update' : 'Add Student'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost text-sm px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}
