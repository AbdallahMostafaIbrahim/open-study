"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export const AnnouncementsSkeleton = () => {
  // Simulate loading 4 announcements
  const skeletonItems = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" /> {/* Title */}
        <Skeleton className="h-10 w-44" /> {/* Add button */}
      </div>

      {/* Side by side layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left side: Announcement list */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[60vh] px-4">
              <div className="space-y-1">
                {skeletonItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-md px-4 py-3 bg-muted/50"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                    <div className="mt-1 flex items-center">
                      <Skeleton className="mr-1 h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="mt-2 h-8 w-full" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side: Selected announcement details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-3/5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Author info */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-40" />
              </div>
            </div>

            <Separator />

            {/* Announcement content */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/5" />
            </div>

            {/* Skeleton for attachments */}
            <div className="pt-4">
              <Skeleton className="h-6 w-32" />
              <Separator className="my-4" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
