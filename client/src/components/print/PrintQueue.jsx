import PrintCard from './PrintCard';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';

export default function PrintQueue({ requests, pagination, loading, onPageChange, onStatusChange, onRefresh, onDelete }) {
  if (loading) return <Spinner className="py-12" />;

  const active = requests.filter((r) => r.status !== 'completed');

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {active.map((req) => (
          <PrintCard
            key={req.id}
            request={req}
            showTeacher
            showCover
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>

      {active.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🖨️</div>
          <p className="font-medium text-gray-500">No active print requests</p>
          <p className="text-sm mt-1">Completed requests are moved to Print History.</p>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
