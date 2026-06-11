import { useState } from 'react';
import { libraryApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';

export default function EditModal({ file, subjects, onClose, onSaved }) {
  const [form, setForm] = useState({ description: file.description || '', subject_id: file.subject_id ?? 'others' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await libraryApi.update(file.id, { ...form, subject_id: form.subject_id === 'others' ? null : form.subject_id });
      toast.success('Updated.');
      onSaved();
    } catch { toast.error('Failed to update.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Edit File</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label">Subject</label>
            <select className="input" value={form.subject_id} onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
