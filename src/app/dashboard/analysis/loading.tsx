'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AnalysisLoading() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-10 w-16 mx-auto mt-2" />
              <Skeleton className="h-3 w-20 mx-auto mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
