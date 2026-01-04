'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TradeFiltersProps {
  instruments: string[];
}

export function TradeFilters({ instruments }: TradeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentResult = searchParams.get('result');
  const currentGrade = searchParams.get('grade');
  const currentInstrument = searchParams.get('instrument');

  const hasFilters = currentResult || currentGrade || currentInstrument;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Result Filter */}
      <Select
        value={currentResult || ''}
        onValueChange={(value) => updateFilter('result', value || null)}
      >
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="Result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="take_profit">Take Profit</SelectItem>
          <SelectItem value="stopped_out">Stopped Out</SelectItem>
          <SelectItem value="break_even">Break Even</SelectItem>
        </SelectContent>
      </Select>

      {/* Grade Filter */}
      <Select
        value={currentGrade || ''}
        onValueChange={(value) => updateFilter('grade', value || null)}
      >
        <SelectTrigger className="w-[120px] bg-card">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A+">A+</SelectItem>
          <SelectItem value="A">A</SelectItem>
          <SelectItem value="A-">A-</SelectItem>
          <SelectItem value="B">B</SelectItem>
          <SelectItem value="C">C</SelectItem>
        </SelectContent>
      </Select>

      {/* Instrument Filter */}
      {instruments.length > 0 && (
        <Select
          value={currentInstrument || ''}
          onValueChange={(value) => updateFilter('instrument', value || null)}
        >
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue placeholder="Instrument" />
          </SelectTrigger>
          <SelectContent>
            {instruments.map((instrument) => (
              <SelectItem key={instrument} value={instrument}>
                {instrument}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-muted-foreground">Active:</span>
          {currentResult && (
            <Badge variant="secondary" className="gap-1">
              {currentResult.replace('_', ' ')}
              <button
                onClick={() => updateFilter('result', null)}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentGrade && (
            <Badge variant="secondary" className="gap-1">
              {currentGrade}
              <button
                onClick={() => updateFilter('grade', null)}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentInstrument && (
            <Badge variant="secondary" className="gap-1">
              {currentInstrument}
              <button
                onClick={() => updateFilter('instrument', null)}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
