import { useEffect, useState } from 'react';
import { subjectsApi } from '../../api/usersApi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await subjectsApi.getAllAdmin();
      setSubjects(res.data.data);
    } catch { toast.error('Failed to load subjects.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await subjectsApi.create({ name: name.trim(), description: description.trim() || null });
      toast.success('Subject added!');
      setName('');
      setDescription('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject.');
    } finally { setSaving(false); }
  }

  async function toggleActive(subject) {
    try {
      await subjectsApi.toggleActive(subject.id, !subject.is_active);
      setSubjects((prev) =>
        prev.map((s) => s.id === subject.id ? { ...s, is_active: !s.is_active } : s)
      );
      toast.success(subject.is_active ? 'Subject suspended.' : 'Subject activated.');
    } catch { toast.error('Failed to update subject.'); }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="card p-5 flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Subject Name *</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            className="input" placeholder="e.g. Mathematics" required
          />
        </div>
        <div className="flex-[2] min-w-[200px]">
          <label className="label">Description</label>
          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="input" placeholder="Optional description..."
          />
        </div>
        <Button type="submit" loading={saving}>Add Subject</Button>
      </form>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading...</p>
      ) : (
        <div className="card divide-y divide-gray-100">
          {!subjects.length && <p className="py-8 text-center text-gray-400">No subjects yet.</p>}
          {subjects.map((s) => (
            <div key={s.id} className={`flex items-center gap-4 px-5 py-3 ${!s.is_active ? 'opacity-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{s.name}</p>
                {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {s.is_active ? 'Active' : 'Suspended'}
              </span>
              <Button variant="secondary" size="sm" onClick={() => toggleActive(s)}>
                {s.is_active ? 'Suspend' : 'Activate'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
