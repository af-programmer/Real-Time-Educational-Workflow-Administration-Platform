import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { libraryApi } from '../../api/printRequestsApi';
import apiFetch from '../../api/apiFetch';
import { teachersApi } from '../../api/usersApi';
import UploadModal from '../../components/library/UploadModal';
import EditModal from '../../components/library/EditModal';
import LibrarySubjectGroup from '../../components/library/LibrarySubjectGroup';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

async function downloadFile(id, filename) {
  try {
    const res = await apiFetch.get(`/library/${id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  } catch { toast.error('Download failed.'); }
}

export default function TeacherLibrary() {
  const navigate = useNavigate();
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
        <LibrarySubjectGroup key={subjectName} subjectName={subjectName} files={files}
          onPrint={(f) => navigate('/teacher/new-print-request', { state: { libraryFile: f } })}
          onDownload={(f) => downloadFile(f.id, f.original_name)}
          onEdit={setEditFile}
          onDelete={handleDelete} />
      ))}

      {showUpload && <UploadModal subjects={subjects} onClose={() => setShowUpload(false)} onUploaded={() => { setShowUpload(false); load(); }} />}
      {editFile && <EditModal file={editFile} subjects={subjects} onClose={() => setEditFile(null)} onSaved={() => { setEditFile(null); load(); }} />}
    </div>
  );
}
