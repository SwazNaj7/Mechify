'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function JournalingLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>

      {/* Form Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Image Upload */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
