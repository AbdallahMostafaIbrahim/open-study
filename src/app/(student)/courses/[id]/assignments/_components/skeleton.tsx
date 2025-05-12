"use client";

import { Card, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const AssignmentsSkeleton = () => {
  // Simulate loading 4 assignments
  const skeletonItems = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Skeleton className="h-8 w-48" />

      {/* Assignment skeletons */}
      <div className="space-y-4">
        {skeletonItems.map((item) => (
          <Card
            key={item}
            className="hover:border-primary bg-card w-full cursor-pointer rounded-md border transition-all duration-200"
          >
            <div className="flex items-start justify-between p-6">
              <div className="w-full space-y-1.5">
                <CardTitle className="text-lg">
                  <Skeleton className="h-6 w-1/3" />
                </CardTitle>
                <div className="flex gap-4 pt-1">
                  <div className="flex items-center text-sm">
                    <Skeleton className="mr-1.5 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center text-sm">
                    <Skeleton className="mr-1.5 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
