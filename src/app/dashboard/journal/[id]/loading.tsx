'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TradeDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Back Button */}
      <Skeleton className="h-9 w-24" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-7 w-12 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-9" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Image */}
        <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
          <Skeleton className="aspect-video w-full" />
        </Card>

        {/* Trade Details */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24 mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
