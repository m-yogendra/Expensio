interface CircularProgressProps {
  percentage: number;
  spent: number;
  budget: number;
  label: string;
}

export function CircularProgress({ percentage, spent, budget, label }: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const strokeColor = percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">{Math.round(percentage)}%</span>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium">₹{spent.toFixed(0)} / ₹{budget.toFixed(0)}</p>
      </div>
    </div>
  );
}
