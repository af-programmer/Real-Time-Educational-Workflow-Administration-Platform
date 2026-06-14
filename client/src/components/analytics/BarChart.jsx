const CHART_WIDTH = 500;
const CHART_HEIGHT = 180;
const PAD_LEFT = 38;
const PAD_BOTTOM = 28;
const PAD_TOP = 8;
const CHART_INNER_W = CHART_WIDTH - PAD_LEFT;
const CHART_INNER_H = CHART_HEIGHT - PAD_BOTTOM - PAD_TOP;

export default function BarChart({ data, valueKey, labelKey, color, maxValue }) {
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
            <text x={PAD_LEFT - 4} y={y + 3.5} textAnchor="end" fontSize="9" fill="#9ca3af">{tickVal}</text>
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
              <text x={x + barW / 2} y={y + 13} textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
                {val}
              </text>
            )}
            <text x={x + barW / 2} y={PAD_TOP + CHART_INNER_H + 18} textAnchor="middle" fontSize="9" fill="#6b7280">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
