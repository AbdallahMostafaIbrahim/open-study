"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/react";

export const CourseMaterial = ({ sectionId }: { sectionId: number }) => {
  // Get all materials for this section
  const [materials, { isLoading, error }] =
    api.professor.courses.material.get.useSuspenseQuery({
      sectionId,
    });

  // State to track which groups are collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  // Group materials by their group property
  const grouped = materials.reduce<Record<string, typeof materials>>(
    (acc, mat) => {
      const grp = mat.group || "Ungrouped";
      if (!acc[grp]) acc[grp] = [];
      acc[grp].push(mat);
      return acc;
    },
    {},
  );

  // Toggle the collapsed state of a group
  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Render the add material button
  const renderAddButton = () => (
    <Link href={`/professor/courses/${sectionId}/content/new`}>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Material
      </Button>
    </Link>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="rounded-full bg-neutral-700 p-6">
        <FolderOpen className="h-12 w-12 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold">No course materials yet</h2>
      <p className="text-muted-foreground max-w-md">
        Add your first course material to help your students access important
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
          <h1 className="text-2xl font-bold">Course Materials</h1>
          {renderAddButton()}
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Course Materials</h1>
        {renderAddButton()}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="overflow-hidden rounded-lg border">
            <div
              className="flex cursor-pointer items-center justify-between bg-neutral-800 px-4 py-3"
              onClick={() => toggleGroup(group)}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-neutral-500" />
                <h2 className="text-lg font-semibold">
                  {group} ({items.length})
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {collapsedGroups[group] ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </Button>
            </div>

            {!collapsedGroups[group] && (
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/professor/courses/${sectionId}/content/${item.id}`}
                    >
                      <Card className="hover:border-primary relative cursor-pointer transition-all duration-200 hover:shadow-md">
                        <div className="absolute top-2 right-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm">
                              By {item.author.user.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {formatDate(item.date)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
