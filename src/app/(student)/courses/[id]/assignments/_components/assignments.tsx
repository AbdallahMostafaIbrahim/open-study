"use client";

import { Award, Calendar, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn, formatDate } from "~/lib/utils";
import { api } from "~/trpc/react";

export const Assignments = ({ sectionId }: { sectionId: number }) => {
  // Get all materials for this section
  const [assignments, { isLoading, error }] =
    api.student.courses.assignments.get.useSuspenseQuery({
      sectionId,
    });

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="rounded-full bg-neutral-700 p-6">
        <FolderOpen className="h-12 w-12 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold">No assignments yet</h2>
      <p className="text-muted-foreground max-w-md">
        That's okay! Your instructor hasn't added any assignments yet. Check
        back
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading assignments...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading assignments</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Assignments</h1>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Assignments</h1>

      <div className="flex flex-col space-y-4">
        {assignments.map((item) => (
          <Link
            key={item.id}
            href={`/courses/${sectionId}/assignments/${item.id}`}
          >
            <div className="hover:border-primary bg-card w-full cursor-pointer rounded-md border p-6 transition-all duration-200 hover:shadow-md">
              <div className="space-y-1.5">
                <div className="flex w-full justify-between text-lg">
                  <h2 className="font-bold">{item.title}</h2>
                  <Badge
                    variant={
                      item.submissions.length > 0 ? "default" : "outline"
                    }
                  >
                    {item.submissions.length > 0
                      ? "Submitted"
                      : "Not Submitted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="text-muted-foreground mr-1.5 h-4 w-4" />
                      <span
                        className={cn(
                          "font-semibold",
                          item.dueDate ? "" : "text-muted-foreground",
                        )}
                      >
                        Due: {item.dueDate ? formatDate(item.dueDate) : "None"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="text-muted-foreground mr-1.5 h-4 w-4" />
                      <span>{item.points} pts</span>
                    </div>
                  </div>
                  {item.grades.length > 0 && (
                    <Badge variant="outline">
                      {item.grades[item.grades.length - 1]?.grade}/{item.points}{" "}
                      Points
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
