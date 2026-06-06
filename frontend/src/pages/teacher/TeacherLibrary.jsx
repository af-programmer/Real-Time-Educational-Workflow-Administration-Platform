import { useState, useEffect, useCallback } from 'react';
import { libraryApi } from '../../api/printRequestsApi';
import { teachersApi } from '../../api/usersApi';
import { UploadModal, EditModal } from '../../components/common/LibraryModals';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function TeacherLibrary() {
  const [grouped, setGrouped] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editFile, setEditFile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [libRes, profRes] = await Promise.all([libraryApi.getAll(), teachersApi.getMe()]);
      setGrouped(libRes.data.grouped || {});
      setSubjects(profRes.data.data?.subjects || []);
    } catch { toast.error('Failed to load library.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    if (!confirm('Delete this file?')) return;
    try { await libraryApi.delete(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed to delete.'); }
  }

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowUpload(true)} className="btn-primary px-4 py-2">+ Upload File</button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <div className="text-5xl mb-3">📚</div>
          <p className="font-medium">Your library is empty</p>
          <p className="text-sm mt-1">Upload files to organize your print materials by subject.</p>
        </div>
      ) : Object.entries(grouped).map(([subjectName, files]) => (
        <div key={subjectName} className="card overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">📁 {subjectName}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{f.original_name}</p>
                  {f.description && <p className="text-xs text-gray-500">{f.description}</p>}
                  <p className="text-xs text-gray-400">{(f.file_size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href={libraryApi.getDownloadUrl(f.id)} target="_blank" rel="noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-800">⬇️ Download</a>
                  <button onClick={() => setEditFile(f)} className="text-xs text-gray-500 hover:text-gray-700">✏️ Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="text-xs text-red-500 hover:text-red-700">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showUpload && <UploadModal subjects={subjects} onClose={() => setShowUpload(false)}
        onUploaded={() => { setShowUpload(false); load(); }} />}
      {editFile && <EditModal file={editFile} subjects={subjects} onClose={() => setEditFile(null)}
        onSaved={() => { setEditFile(null); load(); }} />}
    </div>
  );
}
