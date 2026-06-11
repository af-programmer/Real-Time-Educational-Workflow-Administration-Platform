import { useState } from 'react';
import { libraryApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';

export function UploadModal({ subjects, onClose, onUploaded }) {
  const [form, setForm] = useState({ subject_id: '', description: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { toast.error('Please select a file.'); return; }
    if (!form.subject_id) { toast.error('Please select a subject.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (form.subject_id !== 'others') fd.append('subject_id', form.subject_id);
      fd.append('description', form.description);
      await libraryApi.upload(fd);
      toast.success('File uploaded!');
      onUploaded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally { setUploading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Upload to Library</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Subject *</label>
            <select className="input" value={form.subject_id}
              onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}>
              <option value="">Select subject...</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" placeholder="Optional description..."
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">File *</label>
            {file ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-700 flex-1 truncate">📄 {file.name}</span>
                <button type="button" onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg leading-none">&times;</button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setFile(e.target.files[0] || null)} />
                <div className="text-2xl mb-1">📎</div>
                <p className="text-sm text-gray-500">Click to select file</p>
              </label>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={uploading} className="btn-primary flex-1 py-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditModal({ file, subjects, onClose, onSaved }) {
  const [form, setForm] = useState({ description: file.description || '', subject_id: file.subject_id ?? 'others' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await libraryApi.update(file.id, {
        ...form,
        subject_id: form.subject_id === 'others' ? null : form.subject_id,
      });
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
            <select className="input" value={form.subject_id}
              onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
