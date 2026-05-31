import { Link } from 'react-router-dom';
import { useMyPrintRequests } from '../../hooks/usePrintRequests';
import PrintCard from '../../components/print/PrintCard';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useState } from 'react';

export default function MyPrintRequests() {
  const [page, setPage] = useState(1);
  const { data, pagination, loading } = useMyPrintRequests({ page });

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{pagination?.total || 0} total requests</p>
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
          {data.map((req) => (
            <PrintCard key={req.id} request={req} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
