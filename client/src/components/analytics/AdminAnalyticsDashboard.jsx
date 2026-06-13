import { useEffect, useState, useMemo } from 'react';
import analyticsApi from '../../api/analyticsApi';

const CHART_WIDTH = 500;
const CHART_HEIGHT = 180;
const PAD_LEFT = 38;
const PAD_BOTTOM = 28;
const PAD_TOP = 8;
const CHART_INNER_W = CHART_WIDTH - PAD_LEFT;
const CHART_INNER_H = CHART_HEIGHT - PAD_BOTTOM - PAD_TOP;

function BarChart({ data, valueKey, labelKey, color, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => Number(d[valueKey])), 1);
  const groupW = CHART_INNER_W / (data.length || 1);
  const barW = Math.min(groupW * 0.55, 48);
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full" aria-label="bar chart">
      {yTicks.map((pct) => {
        const y = PAD_TOP + CHART_INNER_H - (pct / 100) * CHART_INNER_H;
        const tickVal = Math.round((max * pct) / 100);
        return (
          <g key={pct}>
            <line x1={PAD_LEFT} y1={y} x2={CHART_WIDTH} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD_LEFT - 4} y={y + 3.5} textAnchor="end" fontSize="9" fill="#9ca3af">
              {tickVal}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const val = Number(d[valueKey]);
        const barH = max > 0 ? (val / max) * CHART_INNER_H : 0;
        const x = PAD_LEFT + i * groupW + (groupW - barW) / 2;
        const y = PAD_TOP + CHART_INNER_H - barH;
        const raw = String(d[labelKey]);
        const label = raw.length > 6 ? raw.slice(0, 6) + '…' : raw;

        return (
          <g key={raw}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} rx="3" opacity="0.9" />
            {barH > 18 && (
              <text
                x={x + barW / 2}
                y={y + 13}
                textAnchor="middle"
                fontSize="9"
                fill="white"
                fontWeight="700"
              >
                {val}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={PAD_TOP + CHART_INNER_H + 18}
              textAnchor="middle"
              fontSize="9"
              fill="#6b7280"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChartCard({ title, subtitle, badge, badgeColor, loading, error, empty, chart, footer }) {
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

      {loading && (
        <p className="py-10 text-center text-sm text-gray-400">Loading analytics...</p>
      )}
      {!loading && error && (
        <p className="py-10 text-center text-sm text-red-400">Unable to load analytics</p>
      )}
      {!loading && !error && empty && (
        <p className="py-10 text-center text-sm text-gray-400">No data available</p>
      )}
      {!loading && !error && !empty && chart}

      {footer && !loading && !error && !empty && (
        <p className="text-xs text-gray-400 mt-1 text-right">{footer}</p>
      )}
    </div>
  );
}

export default function AdminAnalyticsDashboard() {
  const [grades, setGrades] = useState([]);
  const [prints, setPrints] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingPrints, setLoadingPrints] = useState(true);
  const [errorGrades, setErrorGrades] = useState(false);
  const [errorPrints, setErrorPrints] = useState(false);

  useEffect(() => {
    let mounted = true;

    analyticsApi
      .getGrades()
      .then((res) => { if (mounted) setGrades(res.data.data); })
      .catch(() => { if (mounted) setErrorGrades(true); })
      .finally(() => { if (mounted) setLoadingGrades(false); });

    analyticsApi
      .getPrintRequests()
      .then((res) => { if (mounted) setPrints(res.data.data); })
      .catch(() => { if (mounted) setErrorPrints(true); })
      .finally(() => { if (mounted) setLoadingPrints(false); });

    return () => { mounted = false; };
  }, []);

  const avgGrade = useMemo(() => {
    if (!grades.length) return '—';
    const totalCount = grades.reduce((s, g) => s + Number(g.count), 0);
    if (!totalCount) return '—';
    const weighted = grades.reduce((s, g) => s + Number(g.averageGrade) * Number(g.count), 0);
    return `${Math.round(weighted / totalCount)}%`;
  }, [grades]);

  const totalEntries = useMemo(
    () => grades.reduce((s, g) => s + Number(g.count), 0),
    [grades]
  );

  const totalPrints = useMemo(
    () => prints.reduce((s, p) => s + Number(p.requests), 0),
    [prints]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Analytics Dashboard</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Grades Analytics"
          subtitle="Average grade (%) per class"
          badge={avgGrade}
          badgeColor="text-indigo-600"
          loading={loadingGrades}
          error={errorGrades}
          empty={!grades.length}
          chart={
            <BarChart
              data={grades}
              valueKey="averageGrade"
              labelKey="className"
              color="#6366f1"
              maxValue={100}
            />
          }
          footer={totalEntries > 0 ? `Based on ${totalEntries} grade entries across ${grades.length} classes` : null}
        />

        <ChartCard
          title="Print Requests Analytics"
          subtitle="Request volume trend — last 6 months"
          badge={totalPrints}
          badgeColor="text-emerald-600"
          loading={loadingPrints}
          error={errorPrints}
          empty={!prints.length}
          chart={
            <BarChart
              data={prints}
              valueKey="requests"
              labelKey="month"
              color="#10b981"
            />
          }
          footer={prints.length > 0 ? `Across ${prints.length} months tracked` : null}
        />
      </div>
    </div>
  );
}
