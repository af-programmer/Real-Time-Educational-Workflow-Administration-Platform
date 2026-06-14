export default function ChartCard({ title, subtitle, badge, badgeColor, loading, error, empty, chart, footer }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className={`text-2xl font-bold ${badgeColor}`}>{badge}</p>
        </div>
      </div>

      {loading && <p className="py-10 text-center text-sm text-gray-400">Loading analytics...</p>}
      {!loading && error && <p className="py-10 text-center text-sm text-red-400">Unable to load analytics</p>}
      {!loading && !error && empty && <p className="py-10 text-center text-sm text-gray-400">No data available</p>}
      {!loading && !error && !empty && chart}
      {footer && !loading && !error && !empty && (
        <p className="text-xs text-gray-400 mt-1 text-right">{footer}</p>
      )}
    </div>
  );
}
