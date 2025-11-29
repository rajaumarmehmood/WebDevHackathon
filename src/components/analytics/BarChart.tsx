'use client';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  maxValue?: number;
}

export default function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-black dark:text-white">{item.label}</span>
              <span className="text-neutral-500">{item.value}</span>
            </div>
            <div className="relative h-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-3"
                style={{
                  width: `${Math.max(percentage, 5)}%`,
                  backgroundColor: item.color,
                }}
              >
                {percentage > 15 && (
                  <span className="text-xs font-semibold text-white drop-shadow">
                    {Math.round(percentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
