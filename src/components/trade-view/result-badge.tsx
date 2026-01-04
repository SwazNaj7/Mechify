import { cn } from '@/lib/utils';
import type { TradeResult } from '@/types/trade';

interface ResultBadgeProps {
  result: TradeResult;
  size?: 'sm' | 'md' | 'lg';
}

const resultConfig: Record<TradeResult, { label: string; className: string }> = {
  take_profit: {
    label: 'TP',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  stopped_out: {
    label: 'SL',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  break_even: {
    label: 'BE',
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function ResultBadge({ result, size = 'md' }: ResultBadgeProps) {
  const config = resultConfig[result];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md border',
        config.className,
        sizeClasses[size]
      )}
    >
      {config.label}
    </span>
  );
}
