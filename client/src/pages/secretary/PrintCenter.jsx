import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllPrintRequests } from '../../hooks/usePrintRequests';
import { printRequestsApi } from '../../api/printRequestsApi';
import PrintQueue from '../../components/print/PrintQueue';
import PrintCenterFilters from '../../components/print/PrintCenterFilters';
import toast from 'react-hot-toast';

export default function PrintCenter() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    priority: searchParams.get('priority') || '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data, pagination, loading, refetch, updateStatus } = useAllPrintRequests({ ...filters, page });
  const urgentCount = data.filter((r) => r.priority === 'urgent' && r.status === 'pending').length;

  async function handleDelete(id) {
    if (!confirm('Delete this print request?')) return;
    try {
      await printRequestsApi.delete(id);
      toast.success('Deleted.');
      refetch();
    } catch { toast.error('Failed to delete.'); }
  }

  return (
    <div className="space-y-5">
      {urgentCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-pulse">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-semibold text-red-800">
              {urgentCount} urgent request{urgentCount > 1 ? 's' : ''} need attention!
            </p>
            <p className="text-sm text-red-600">Please process these immediately.</p>
          </div>
        </div>
      )}
      <PrintCenterFilters filters={filters} setFilters={setFilters} />
      <PrintQueue
        requests={data} pagination={pagination} loading={loading}
        onPageChange={setPage} onStatusChange={updateStatus}
        onRefresh={refetch} onDelete={handleDelete}
      />
    </div>
  );
}
