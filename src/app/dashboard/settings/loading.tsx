'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>

      {/* Settings Card */}
      <Card className="max-w-2xl bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}
