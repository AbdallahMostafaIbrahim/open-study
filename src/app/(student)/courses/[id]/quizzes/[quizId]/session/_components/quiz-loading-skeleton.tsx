import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function QuizLoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="p-6">
            <Skeleton className="mb-4 h-8 w-full" />
            <Skeleton className="mb-8 h-24 w-full" />

            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <Skeleton className="mb-3 h-6 w-32" />
            <Skeleton className="mb-3 h-8 w-full" />
            <Skeleton className="h-2 w-full" />
          </Card>

          <Card className="p-4">
            <Skeleton className="mb-4 h-6 w-20" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
