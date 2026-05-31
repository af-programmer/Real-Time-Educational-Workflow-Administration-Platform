import Badge from '../common/Badge';
import { format } from 'date-fns';

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  printed: 'Printed',
  completed: 'Completed',
};

export default function PrintCard({ request, onStatusChange, showTeacher = false }) {
  const isUrgent = request.priority === 'urgent';

  return (
    <div className={`card p-4 ${isUrgent ? 'ring-2 ring-red-400 bg-red-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={request.priority} variant={request.priority} pulse={isUrgent} />
            <Badge label={statusLabels[request.status]} variant={request.status} />
          </div>
          {showTeacher && (
            <p className="mt-1.5 font-semibold text-gray-900">{request.teacher_name}</p>
          )}
          <p className="mt-1 text-sm text-gray-600">{request.subject_name}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-gray-900">{request.total_copies}</p>
          <p className="text-xs text-gray-500">copies</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>
          <span className="font-medium">Date:</span>{' '}
          {request.lesson_date
            ? format(new Date(request.lesson_date), 'dd MMM yyyy')
            : '—'}
        </div>
        <div>
          <span className="font-medium">Time:</span> {request.lesson_time || '—'}
        </div>
        <div>
          <span className="font-medium">Submitted:</span>{' '}
          {format(new Date(request.created_at), 'dd MMM, HH:mm')}
        </div>
      </div>

      {request.notes && (
        <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
          {request.notes}
        </p>
      )}

      {onStatusChange && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <select
            value={request.status}
            onChange={(e) => onStatusChange(request.id, e.target.value)}
            className="input text-sm py-1.5"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="printed">Printed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
}
