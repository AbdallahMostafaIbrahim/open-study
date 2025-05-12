"use client";

import {
  AlarmClock,
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Download,
  File,
  Pen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FileList } from "~/components/files";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { S3_URL } from "~/lib/constants";
import { formatDate, initials } from "~/lib/utils";
import { api } from "~/trpc/react";
import { AssignmentSubmission } from "./assignment-submission";

export function AssignmentDetails({
  sectionId,
  assignmentId,
}: {
  sectionId: number;
  assignmentId: string;
}) {
  const router = useRouter();

  // Fetch assignment details
  const [assignment, { isLoading, error, refetch }] =
    api.student.courses.assignments.getOne.useSuspenseQuery({
      sectionId,
      id: assignmentId,
    });

  if (isLoading || !assignment) {
    return (
      <div className="flex justify-center py-8">
        Loading assignment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error loading assignment</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{assignment.title}</h1>
        </div>
      </div>

      {/* Assignment content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={assignment.author.user.image || ""}
                  alt={assignment.author.user.name || ""}
                />
                <AvatarFallback>
                  {initials(assignment.author.user.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {assignment.author.user.name}
                </p>
                <div className="text-muted-foreground flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Posted on {formatDate(assignment.date)}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
              <div className="text-muted-foreground flex items-center text-xs">
                <AlarmClock className="mr-1 h-4 w-4" />
                <span>
                  Due:{" "}
                  {assignment.dueDate ? formatDate(assignment.dueDate) : "—"}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center text-xs">
                <Award className="mr-1 h-4 w-4" />
                <span>{assignment.points ?? "—"} pts</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {assignment.grades && assignment.grades.length > 0 && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Grade</h3>
              <span className="text-muted-foreground text-sm">
                {assignment.grades[assignment.grades.length - 1]?.grade ??
                  "Not graded yet"}
              </span>
              {assignment.grades[assignment.grades.length - 1]?.feedback && (
                <span className="ml-2 text-xs text-gray-500 italic">
                  {assignment.grades[assignment.grades.length - 1]?.feedback}
                </span>
              )}
            </div>
          )}

          {/* Text content */}
          {assignment.text && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {assignment.text.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Files section */}
          {assignment.files && assignment.files.length > 0 && (
            <div className="pt-4">
              <h3 className="mb-3 text-lg font-semibold">Files</h3>
              <Separator className="mb-4" />
              <FileList files={assignment.files} />
            </div>
          )}

          {!assignment.text &&
            (!assignment.files || assignment.files.length === 0) && (
              <div className="text-muted-foreground py-8 text-center">
                <p>This assignment has no content or files.</p>
              </div>
            )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t pt-4 md:flex-row md:justify-between">
          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span className="flex items-center">
              <Clock className="mr-1 inline h-3.5 w-3.5" />
              Posted on: {formatDate(assignment.date)}
            </span>
            {assignment.maxAttempts && (
              <span className="flex items-center">
                <Pen className="mr-1 inline h-3.5 w-3.5" />
                Max Attempts: {assignment.maxAttempts}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/courses/${sectionId}/assignments`)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to assignments
          </Button>
        </CardFooter>
      </Card>

      {/* Submission */}
      <AssignmentSubmission
        assignmentId={assignmentId}
        sectionId={sectionId}
        grades={assignment.grades}
        submissions={assignment.submissions}
        maxAttempts={assignment.maxAttempts}
        dueDate={assignment.dueDate}
      />
    </div>
  );
}
