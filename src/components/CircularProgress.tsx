'use client';

import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'blue' | 'green' | 'orange';
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  label,
  showPercentage = true,
  color = 'primary',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const colorClasses = {
    primary: 'text-primary',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
  };

  const percentageColorClasses = {
    primary: 'text-primary',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            className="text-muted stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={cn('stroke-current transition-all duration-500 ease-in-out', colorClasses[color])}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-2xl font-bold', percentageColorClasses[color])}>
              {value}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="mt-2 text-sm font-medium text-muted-foreground text-center">
          {label}
        </p>
      )}
    </div>
  );
}
