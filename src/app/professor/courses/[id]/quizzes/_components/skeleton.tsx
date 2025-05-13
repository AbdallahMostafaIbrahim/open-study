"use client";

import { Skeleton } from "~/components/ui/skeleton";

export const QuizzesSkeleton = () => {
    // Simulate loading 3 quizzes
    const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" /> {/* Title */}
                <Skeleton className="h-10 w-44" /> {/* Add button */}
            </div>

            {/* Quiz list */}
            <div className="flex flex-col space-y-4">
                {skeletonItems.map((item) => (
                    <div key={item} className="w-full rounded-md border">
                        <div className="flex items-start justify-between p-6">
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-64" /> {/* Title */}
                                <div className="flex gap-4 pt-2">
                                    <Skeleton className="h-4 w-32" /> {/* Due date */}
                                    <Skeleton className="h-4 w-20" /> {/* Points */}
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" /> {/* Status */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};