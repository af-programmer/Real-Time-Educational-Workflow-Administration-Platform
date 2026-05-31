import { useState } from 'react';
import PrintCard from './PrintCard';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import { printRequestsApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';

export default function PrintQueue({ requests, pagination, loading, onPageChange, onStatusChange, onRefresh }) {
  const [selected, setSelected] = useState([]);
  const [merging, setMerging] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleMerge = async () => {
    if (selected.length < 2) {
      toast.error('Select at least 2 requests to merge.');
      return;
    }
    setMerging(true);
    try {
      await printRequestsApi.merge(selected);
      toast.success('Requests merged successfully!');
      setSelected([]);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to merge requests.');
    } finally {
      setMerging(false);
    }
  };

  if (loading) return <Spinner className="py-12" />;

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-sm font-medium text-primary-800">
            {selected.length} request{selected.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
            <Button size="sm" loading={merging} onClick={handleMerge}>Merge Selected</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {requests.map((req) => (
          <div key={req.id} className="relative">
            <label className="absolute top-3 right-3 z-10 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(req.id)}
                onChange={() => toggleSelect(req.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
            </label>
            <PrintCard
              request={req}
              showTeacher
              onStatusChange={onStatusChange}
            />
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🖨️</div>
          <p className="font-medium text-gray-500">No print requests found</p>
          <p className="text-sm mt-1">Requests will appear here when teachers submit them.</p>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
