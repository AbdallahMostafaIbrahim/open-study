"use client";

import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const CourseMaterialSkeleton = () => {
  // Create multiple skeleton groups to simulate the loading state
  const skeletonGroups = Array.from({ length: 2 }, (_, i) => i);
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="space-y-8">
      {/* Header with title and button skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" /> {/* Add material button */}
      </div>

      {/* Skeleton for material groups */}
      <div className="space-y-6">
        {skeletonGroups.map((group) => (
          <div key={group} className="overflow-hidden rounded-lg border">
            {/* Group header skeleton */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" /> {/* Icon skeleton */}
                <Skeleton className="h-6 w-40" /> {/* Group title skeleton */}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />{" "}
              {/* Toggle button skeleton */}
            </div>

            {/* Group content skeleton */}
            <div className="p-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {skeletonItems.map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-full" /> {/* Title skeleton */}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />{" "}
                        {/* Author skeleton */}
                        <Skeleton className="h-4 w-20" /> {/* Date skeleton */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
