import { useState } from 'react';
import Badge from '../common/Badge';
import PdfViewer from '../common/PdfViewer';
import { format } from 'date-fns';
import { printRequestsApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  printed: 'Printed',
  completed: 'Completed',
};

export default function PrintCard({ request, onStatusChange, onDelete, showTeacher = false, showCover = false }) {
  const isUrgent = request.priority === 'urgent';
  const [openingFile, setOpeningFile] = useState(false);
  const [coverData, setCoverData] = useState(null);
  const [openingCover, setOpeningCover] = useState(false);

  async function handleOpenFile() {
    setOpeningFile(true);
    try {
      const res = await printRequestsApi.getById(request.id);
      const files = res.data?.data?.files || [];
      if (!files.length) { toast.error('No files attached.'); return; }
      files.forEach((f) => window.open(`/uploads/${f.stored_name}`, '_blank'));
    } catch {
      toast.error('Failed to open file.');
    } finally {
      setOpeningFile(false);
    }
  }

  async function handleCover() {
    setOpeningCover(true);
    try {
      const res = await printRequestsApi.getCover(request.id);
      setCoverData(res.data);
    } catch {
      toast.error('Failed to generate cover page.');
    } finally {
      setOpeningCover(false);
    }
  }

  return (
    <>
      <div className={`card p-4 ${isUrgent ? 'ring-2 ring-red-400 bg-red-50' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={request.priority} variant={request.priority} pulse={isUrgent} />
              <Badge label={statusLabels[request.status]} variant={request.status} />
            </div>
            {showTeacher && <p className="mt-1.5 font-semibold text-gray-900">{request.teacher_name}</p>}
            <p className="mt-1 text-sm text-gray-600">{request.subject_name}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gray-900">{request.total_copies}</p>
            <p className="text-xs text-gray-500">copies</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div><span className="font-medium">Date:</span>{' '}
            {request.lesson_date ? format(new Date(request.lesson_date), 'dd MMM yyyy') : '—'}
          </div>
          <div><span className="font-medium">Time:</span> {request.lesson_time || '—'}</div>
          <div><span className="font-medium">Submitted:</span>{' '}
            {format(new Date(request.created_at), 'dd MMM, HH:mm')}
          </div>
        </div>

        {request.notes && (
          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">{request.notes}</p>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex gap-2">
            <button onClick={handleOpenFile} disabled={openingFile}
              className="flex-1 btn-ghost text-xs py-1.5">
              🖨️ {openingFile ? 'Opening...' : 'Open File'}
            </button>
            {showCover && (
              <button onClick={handleCover} disabled={openingCover} className="flex-1 btn-ghost text-xs py-1.5">
                📄 {openingCover ? 'Generating...' : 'Cover Page'}
              </button>
            )}
          </div>

          {onStatusChange && (
            <select value={request.status} onChange={(e) => onStatusChange(request.id, e.target.value)}
              className="input text-sm py-1.5">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="printed">Printed</option>
              <option value="completed">Completed</option>
            </select>
          )}

          {onDelete && (
            <button onClick={() => onDelete(request.id)}
              className="text-xs text-red-500 hover:text-red-700 text-center py-1">
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {coverData && (
        <PdfViewer
          blobData={coverData}
          title={`Cover — ${request.subject_name || 'Print Request'}`}
          onClose={() => setCoverData(null)}
        />
      )}
    </>
  );
}
