import { Link } from 'react-router-dom';
import { useMyPrintRequests } from '../../hooks/usePrintRequests';
import PrintCard from '../../components/print/PrintCard';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useState } from 'react';

const STATUS_ORDER = { pending: 0, in_progress: 1, printed: 2, completed: 3 };

export default function MyPrintRequests() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, pagination, loading } = useMyPrintRequests({ page });

  if (loading) return <Spinner className="py-20" />;

  const filtered = statusFilter ? data.filter((r) => r.status === statusFilter) : data;
  const sorted = [...filtered].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <p className="text-gray-500 text-sm">{pagination?.total || 0} total requests</p>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input text-sm py-1 px-2 h-auto"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="printed">Printed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <Link to="/teacher/new-print-request">
          <Button>+ New Request</Button>
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-6xl mb-4">🖨️</div>
          <p className="text-lg font-semibold text-gray-700">No print requests yet</p>
          <p className="text-gray-400 text-sm mt-2">Create your first print request to get started.</p>
          <Link to="/teacher/new-print-request" className="mt-4 inline-block">
            <Button>Create Print Request</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((req) => (
            <PrintCard key={req.id} request={req} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
