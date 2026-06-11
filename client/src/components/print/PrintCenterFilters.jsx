export default function PrintCenterFilters({ filters, setFilters }) {
  const clear = () => setFilters({ priority: '', status: '', dateFrom: '', dateTo: '' });
  return (
    <div className="card p-4 flex flex-wrap gap-4">
      <div>
        <label className="label">Priority</label>
        <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="input">
          <option value="">All Priorities</option>
          <option value="urgent">🚨 Urgent</option>
          <option value="important">⚠️ Important</option>
          <option value="normal">📄 Normal</option>
        </select>
      </div>
      <div>
        <label className="label">Status</label>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="input">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="printed">Printed</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="label">From Date</label>
        <input type="date" value={filters.dateFrom} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} className="input" />
      </div>
      <div>
        <label className="label">To Date</label>
        <input type="date" value={filters.dateTo} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} className="input" />
      </div>
      <div className="self-end">
        <button onClick={clear} className="btn-ghost text-sm">Clear Filters</button>
      </div>
    </div>
  );
}
