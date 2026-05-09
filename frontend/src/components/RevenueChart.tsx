const revenueData = [
  { month: "Jan", value: 4200 },
  { month: "Feb", value: 5100 },
  { month: "Mar", value: 6100 },
  { month: "Apr", value: 7800 },
  { month: "May", value: 9200 },
  { month: "Jun", value: 10800 },
];

function getRevenueChartPoints(data: typeof revenueData, width = 640, height = 220, padding = 28) {
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * usableWidth;
    const y = padding + (1 - (item.value - min) / range) * usableHeight;
    return { ...item, x, y };
  });
}

export function RevenueChart() {
  const width = 640;
  const height = 220;
  const points = getRevenueChartPoints(revenueData, width, height);
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - 24} L ${points[0].x} ${height - 24} Z`;

  return (
    <div className="mt-5 overflow-hidden rounded-2xl bg-slate-50 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full" role="img" aria-label="Revenue overview chart">
        <defs>
          <linearGradient id="customRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => {
          const y = 28 + line * 48;
          return <line key={line} x1="28" x2="612" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="5 5" />;
        })}

        <path d={areaPath} fill="url(#customRevenueGradient)" />
        <path d={linePath} fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="5" fill="#0f172a" />
            <text x={point.x} y="214" textAnchor="middle" fontSize="13" fill="#64748b">
              {point.month}
            </text>
            <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="12" fill="#334155">
              ${Math.round(point.value / 1000)}k
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
