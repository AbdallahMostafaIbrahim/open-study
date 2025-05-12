"use client";

import { Award, Calendar, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export const Assignments = ({ sectionId }: { sectionId: number }) => {
  // Get all materials for this section
  const [materials, { isLoading, error }] =
    api.professor.courses.assignments.get.useSuspenseQuery({
      sectionId,
    });

  // Function to format date in a more readable way
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Render the add material button
  const renderAddButton = () => (
    <Link href={`/professor/courses/${sectionId}/assignments/new`}>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Assignment
      </Button>
    </Link>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="rounded-full bg-neutral-700 p-6">
        <FolderOpen className="h-12 w-12 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold">No assignments yet</h2>
      <p className="text-muted-foreground max-w-md">
        Add your first assignment to help your students access important
        resources.
      </p>
      <div className="pt-4">{renderAddButton()}</div>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading materials...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading materials</div>;
  }

  if (materials.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Assignments</h1>
          {renderAddButton()}
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {renderAddButton()}
      </div>

      <div className="flex flex-col space-y-4">
        {materials.map((item) => (
          <Link
            key={item.id}
            href={`/professor/courses/${sectionId}/assignments/${item.id}`}
          >
            <div className="hover:border-primary bg-card w-full cursor-pointer rounded-md border transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between p-6">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    By {item.author.user.name} • {formatDate(item.date)}
                  </p>

                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="text-muted-foreground mr-1.5 h-4 w-4" />
                      <span>
                        Due: {item.dueDate ? formatDate(item.dueDate) : "None"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="text-muted-foreground mr-1.5 h-4 w-4" />
                      <span>{item.points} pts</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
