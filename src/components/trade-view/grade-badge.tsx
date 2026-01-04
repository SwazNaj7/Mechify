import { cn } from '@/lib/utils';
import type { SetupGrade } from '@/types/trade';

interface GradeBadgeProps {
  grade: SetupGrade | null;
  size?: 'sm' | 'md' | 'lg';
}

const gradeColors: Record<SetupGrade, string> = {
  'A+': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'A': 'bg-green-500/20 text-green-400 border-green-500/30',
  'A-': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'B': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'C': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  if (!grade) {
    return (
      <span
        className={cn(
          'inline-flex items-center font-semibold rounded-md border bg-muted/50 text-muted-foreground border-border',
          sizeClasses[size]
        )}
      >
        —
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-md border',
        gradeColors[grade],
        sizeClasses[size]
      )}
    >
      {grade}
    </span>
  );
}
