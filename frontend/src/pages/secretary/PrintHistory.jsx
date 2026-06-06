import { useState, useEffect, useCallback } from 'react';
import { printRequestsApi } from '../../api/printRequestsApi';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function PrintHistory() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', priority: '', dateFrom: '', dateTo: '' });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await printRequestsApi.getHistory({ ...filters, page, limit: 20 });
      setData(res.data.data || []);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load history.'); }
    finally { setLoading(false); }
  }, [JSON.stringify(filters), page]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4">
        <input type="search" placeholder="Search teacher or subject..."
          value={filters.search}
          onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
          className="input max-w-xs" />
        <select value={filters.priority}
          onChange={(e) => { setFilters((f) => ({ ...f, priority: e.target.value })); setPage(1); }}
          className="input w-40">
          <option value="">All Priorities</option>
          <option value="urgent">🚨 Urgent</option>
          <option value="important">⚠️ Important</option>
          <option value="normal">📄 Normal</option>
        </select>
        <input type="date" value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
          className="input w-40" />
        <input type="date" value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
          className="input w-40" />
        <button onClick={() => setFilters({ search: '', priority: '', dateFrom: '', dateTo: '' })}
          className="btn-ghost text-sm">Clear</button>
      </div>

      {loading ? <Spinner className="py-16" /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Teacher', 'Subject', 'Copies', 'Priority', 'Lesson Date', 'Completed', 'Cover'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{req.teacher_name}</td>
                    <td className="px-4 py-3 text-gray-600">{req.subject_name}</td>
                    <td className="px-4 py-3 text-gray-600">{req.total_copies}</td>
                    <td className="px-4 py-3"><Badge label={req.priority} variant={req.priority} /></td>
                    <td className="px-4 py-3 text-gray-600">
                      {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {format(new Date(req.updated_at), 'dd MMM, HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => window.open(`http://localhost:5000/api/print-requests/${req.id}/cover`, '_blank')}
                        className="text-primary-600 hover:text-primary-800 text-xs">📄 Cover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <p className="text-center py-12 text-gray-400">No completed print requests yet.</p>
            )}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
