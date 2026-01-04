'use client';

import { TrendingUp, TrendingDown, Target, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  children,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-white/10 dark:border-white/5',
        'bg-linear-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5',
        'backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20',
        'before:absolute before:inset-0 before:bg-linear-to-br before:from-white/50 before:to-transparent before:pointer-events-none',
        'after:absolute after:inset-0 after:bg-linear-to-tr after:from-transparent after:via-white/10 after:to-white/30 dark:after:via-white/5 dark:after:to-white/10 after:pointer-events-none',
        className
      )}
    >
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {(subtitle || trendValue) && (
          <div className="flex items-center gap-2 mt-1">
            {trendValue && trend && (
              <span
                className={cn(
                  'text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full',
                  trend === 'up' && 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
                  trend === 'down' && 'text-red-600 dark:text-red-400 bg-red-500/10',
                  trend === 'neutral' && 'text-muted-foreground bg-muted'
                )}
              >
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

// Mini sparkline chart for win rate
function WinRateGraph({ winRate }: { winRate: number }) {
  // Generate deterministic data for visualization based on winRate
  const dataPoints = 7;
  const baseRate = winRate;
  const offsets = [-12, -5, 3, -8, 5, -2, 0]; // Fixed offsets for consistent rendering
  const data = offsets.map((offset, i) => {
    const trendBoost = (i / (dataPoints - 1)) * 8; // Slight upward trend
    return Math.max(0, Math.min(100, baseRate + offset + trendBoost - 4));
  });
  
  const max = 100;
  const min = 0;
  const height = 40;
  const width = 100;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="mt-3 -mb-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-10"
        preserveAspectRatio="none"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={winRate >= 50 ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={winRate >= 50 ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon
          points={areaPoints}
          fill="url(#winRateGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={winRate >= 50 ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Current point */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / (max - min)) * height}
          r="3"
          fill={winRate >= 50 ? '#10b981' : '#ef4444'}
        />
      </svg>
    </div>
  );
}

interface DashboardStatsProps {
  totalTrades: number;
  winRate: number;
  averageGrade: string;
  thisWeekTrades: number;
}

export function DashboardStats({
  totalTrades,
  winRate,
  averageGrade,
  thisWeekTrades,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Trades"
        value={totalTrades}
        icon={<BarChart3 className="h-4 w-4" />}
        subtitle="All time"
      />
      <StatsCard
        title="Win Rate"
        value={`${winRate}%`}
        icon={<Activity className="h-4 w-4" />}
        trend={winRate >= 50 ? 'up' : 'down'}
        trendValue={winRate >= 50 ? 'Profitable' : 'Needs work'}
      >
        <WinRateGraph winRate={winRate} />
      </StatsCard>
      <StatsCard
        title="Avg Grade"
        value={averageGrade}
        icon={<Target className="h-4 w-4" />}
        subtitle="Setup quality"
      />
      <StatsCard
        title="This Week"
        value={thisWeekTrades}
        icon={<TrendingUp className="h-4 w-4" />}
        subtitle="Trades logged"
      />
    </div>
  );
}
