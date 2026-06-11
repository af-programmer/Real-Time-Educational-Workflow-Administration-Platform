import Badge from '../common/Badge';
import { printRequestsApi } from '../../api/printRequestsApi';
import { format } from 'date-fns';

export default function PrintRequestHistoryList({ requests }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
        Print Request History ({requests.length})
      </div>
      {requests.length === 0 ? (
        <p className="text-center py-10 text-gray-400 text-sm">No print requests yet.</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{req.subject_name}</p>
                <p className="text-xs text-gray-500">
                  {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM yyyy') : ''} · {req.total_copies} copies
                </p>
                {req.notes && (
                  <p className="text-xs text-gray-400 mt-0.5 italic line-clamp-1">{req.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={req.priority} variant={req.priority} />
                <Badge label={req.status} variant={req.status} />
                <a href={printRequestsApi.getCoverUrl(req.id)} target="_blank" rel="noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Cover PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
