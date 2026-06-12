import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllPrintRequests } from '../../hooks/usePrintRequests';
import { printRequestsApi } from '../../api/printRequestsApi';
import PrintQueue from '../../components/print/PrintQueue';
import PrintCenterFilters from '../../components/print/PrintCenterFilters';
import toast from 'react-hot-toast';

export default function PrintCenter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // All filter values derived from URL
  const filters = {
    priority: searchParams.get('priority') || '',
    status:   searchParams.get('status')   || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo:   searchParams.get('dateTo')   || '',
  };
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Write filter changes back to URL so back/forward and deep-links work
  const setFilters = useCallback((updater) => {
    setSearchParams((prev) => {
      const current = {
        priority: prev.get('priority') || '',
        status:   prev.get('status')   || '',
        dateFrom: prev.get('dateFrom') || '',
        dateTo:   prev.get('dateTo')   || '',
      };
      const next = typeof updater === 'function' ? updater(current) : updater;
      const out = new URLSearchParams();
      if (next.priority) out.set('priority', next.priority);
      if (next.status)   out.set('status',   next.status);
      if (next.dateFrom) out.set('dateFrom', next.dateFrom);
      if (next.dateTo)   out.set('dateTo',   next.dateTo);
      // Reset to page 1 whenever filters change
      return out;
    }, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback((p) => {
    setSearchParams((prev) => {
      const out = new URLSearchParams(prev);
      if (p > 1) out.set('page', String(p)); else out.delete('page');
      return out;
    }, { replace: true });
  }, [setSearchParams]);

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
