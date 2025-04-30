"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function CoursesSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            className="flex w-full flex-col sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.75rem)] xl:w-[calc(25%-0.75rem)]"
          >
            <CardHeader>
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>

            <CardContent className="flex-grow">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-2 h-4 w-4/6" />
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
