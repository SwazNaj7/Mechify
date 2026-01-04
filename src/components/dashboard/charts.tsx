'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SetupGrade, TradeResult } from '@/types/trade';
import { cn } from '@/lib/utils';

interface GradeDistributionProps {
  distribution: Record<SetupGrade, number>;
}

const gradeConfig: Record<SetupGrade, { color: string; bgColor: string }> = {
  'A+': { color: 'bg-emerald-500', bgColor: 'bg-emerald-500/20' },
  'A': { color: 'bg-green-500', bgColor: 'bg-green-500/20' },
  'A-': { color: 'bg-lime-500', bgColor: 'bg-lime-500/20' },
  'B': { color: 'bg-amber-500', bgColor: 'bg-amber-500/20' },
  'C': { color: 'bg-red-500', bgColor: 'bg-red-500/20' },
};

export function GradeDistribution({ distribution }: GradeDistributionProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const grades: SetupGrade[] = ['A+', 'A', 'A-', 'B', 'C'];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {grades.map((grade) => {
          const count = distribution[grade] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={grade} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{grade}</span>
                <span className="text-muted-foreground">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className={cn('h-2 rounded-full', gradeConfig[grade].bgColor)}>
                <div
                  className={cn('h-full rounded-full transition-all', gradeConfig[grade].color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface ResultDistributionProps {
  distribution: Record<TradeResult, number>;
}

const resultConfig: Record<TradeResult, { label: string; color: string; bgColor: string }> = {
  take_profit: { label: 'Take Profit', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/20' },
  break_even: { label: 'Break Even', color: 'bg-zinc-500', bgColor: 'bg-zinc-500/20' },
  stopped_out: { label: 'Stopped Out', color: 'bg-red-500', bgColor: 'bg-red-500/20' },
};

export function ResultDistribution({ distribution }: ResultDistributionProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const results: TradeResult[] = ['take_profit', 'break_even', 'stopped_out'];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Trade Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.map((result) => {
          const count = distribution[result] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const config = resultConfig[result];

          return (
            <div key={result} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{config.label}</span>
                <span className="text-muted-foreground">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className={cn('h-2 rounded-full', config.bgColor)}>
                <div
                  className={cn('h-full rounded-full transition-all', config.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface SessionPerformanceProps {
  sessions: {
    new_york_am: { wins: number; total: number };
    new_york_pm: { wins: number; total: number };
    asia: { wins: number; total: number };
    london: { wins: number; total: number };
  };
}

export function SessionPerformance({ sessions }: SessionPerformanceProps) {
  const sessionData = [
    { name: 'New York AM', ...sessions.new_york_am },
    { name: 'New York PM', ...sessions.new_york_pm },
    { name: 'London', ...sessions.london },
    { name: 'Asia', ...sessions.asia },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Session Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessionData.map((session) => {
            const winRate = session.total > 0 ? (session.wins / session.total) * 100 : 0;

            return (
              <div key={session.name} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.wins}/{session.total} trades
                  </p>
                </div>
                <div
                  className={cn(
                    'text-lg font-bold',
                    winRate >= 60 && 'text-emerald-500',
                    winRate >= 40 && winRate < 60 && 'text-amber-500',
                    winRate < 40 && 'text-red-500'
                  )}
                >
                  {session.total > 0 ? `${winRate.toFixed(0)}%` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
