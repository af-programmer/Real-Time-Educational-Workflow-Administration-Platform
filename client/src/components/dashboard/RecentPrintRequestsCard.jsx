import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { format } from 'date-fns';

export default function RecentPrintRequestsCard({ recentRequests }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Print Requests</h3>
        <Link to="/teacher/print-requests" className="text-sm text-primary-600 hover:text-primary-700">
          View all →
        </Link>
      </div>
      {recentRequests.length ? (
        <div className="space-y-3">
          {recentRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{req.subject_name}</p>
                <p className="text-xs text-gray-500">
                  {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM') : ''} · {req.total_copies} copies
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge label={req.priority} variant={req.priority} />
                <Badge label={req.status} variant={req.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <div className="text-3xl mb-2">🖨️</div>
          <p className="text-sm">No requests yet</p>
          <Link to="/teacher/new-print-request" className="text-sm text-primary-600 mt-2 block">
            Create your first request →
          </Link>
        </div>
      )}
    </div>
  );
}
