import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllPrintRequests } from '../../hooks/usePrintRequests';
import PrintQueue from '../../components/print/PrintQueue';

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

  return (
    <div className="space-y-5">
      {/* Urgent Banner */}
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

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4">
        <div>
          <label className="label">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
            className="input"
          >
            <option value="">All Priorities</option>
            <option value="urgent">🚨 Urgent</option>
            <option value="important">⚠️ Important</option>
            <option value="normal">📄 Normal</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="printed">Printed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="label">From Date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            className="input"
          />
        </div>
        <div>
          <label className="label">To Date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            className="input"
          />
        </div>
        <div className="self-end">
          <button
            onClick={() => setFilters({ priority: '', status: '', dateFrom: '', dateTo: '' })}
            className="btn-ghost text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Queue */}
      <PrintQueue
        requests={data}
        pagination={pagination}
        loading={loading}
        onPageChange={setPage}
        onStatusChange={updateStatus}
        onRefresh={refetch}
      />
    </div>
  );
}
