'use client';

import { format } from 'date-fns';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GradeBadge } from './grade-badge';
import { ResultBadge } from './result-badge';
import type { Trade } from '@/types/trade';
import { cn } from '@/lib/utils';

interface TradeCardProps {
  trade: Trade;
  onClick?: () => void;
}

export function TradeCard({ trade, onClick }: TradeCardProps) {
  const isLong = trade.direction === 'long';

  // Format the time in user's local timezone
  const formatTradeTime = (timeString: string) => {
    try {
      // new Date() automatically converts ISO string to local timezone
      const date = new Date(timeString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 bg-card/50 backdrop-blur overflow-hidden',
        onClick && 'hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {trade.image_url && trade.image_url.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trade.image_url}
            alt={`${trade.instrument} trade chart`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* Direction indicator */}
        {trade.direction && (
          <div
            className={cn(
              'absolute top-2 right-2 p-1.5 rounded-md',
              isLong
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            )}
          >
            {isLong ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Header with instrument, timeframe, grade and result */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{trade.instrument}</span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {trade.timeframe}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GradeBadge grade={trade.setup_grade} size="sm" />
            <ResultBadge result={trade.result} size="sm" />
          </div>
        </div>

        {/* Time info */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTradeTime(trade.open_time)}</span>
        </div>

        {/* AI Reasoning preview */}
        {trade.ai_reasoning && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {trade.ai_reasoning}
          </p>
        )}

        {/* Notes preview */}
        {trade.notes && !trade.ai_reasoning && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {trade.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
