'use client';

interface LineChartProps {
  data: {
    label: string;
    value: number;
  }[];
  height?: number;
  color?: string;
  showDots?: boolean;
}

export default function LineChart({
  data,
  height = 200,
  color = '#3b82f6',
  showDots = true,
}: LineChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = 800;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - (item.value / maxValue) * innerHeight;
    return { x, y, value: item.value };
  });

  // Create path for the line
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Create path for the area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="space-y-4">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
            const y = padding.top + innerHeight * (1 - percent);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-neutral-200 dark:text-neutral-800"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-neutral-400 dark:fill-neutral-600"
                >
                  {Math.round(maxValue * percent)}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          <path
            d={areaPath}
            fill={color}
            opacity="0.1"
            className="transition-all duration-700"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
          />

          {/* Dots */}
          {showDots &&
            points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="white"
                  stroke={color}
                  strokeWidth="3"
                  className="transition-all duration-700"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={color}
                  className="transition-all duration-700"
                />
              </g>
            ))}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = padding.left + (index / (data.length - 1)) * innerWidth;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-neutral-600 dark:fill-neutral-400"
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
