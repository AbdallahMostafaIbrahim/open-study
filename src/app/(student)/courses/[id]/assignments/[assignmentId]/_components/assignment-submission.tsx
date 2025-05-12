"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { History, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api, type RouterOutputs } from "~/trpc/react";
import { DueDateDisplay } from "./due-date-display";
import { NewSubmissionForm } from "./new-submission-form";
import { SubmissionHistory } from "./submission-history";

// Schema for form validation
const submissionSchema = z.object({
  text: z.string().optional(),
  files: z.array(
    z.object({
      fileKey: z.string(),
      fileType: z.string(),
      fileName: z.string(),
    }),
  ),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

type RouterAssignment = Exclude<
  RouterOutputs["student"]["courses"]["assignments"]["getOne"],
  null
>;

export interface AssignmentSubmissionProps {
  sectionId: number;
  assignmentId: string;
  maxAttempts?: number | null;
  submissions: RouterAssignment["submissions"];
  grades: RouterAssignment["grades"];
  dueDate?: Date | null;
}

export function AssignmentSubmission({
  sectionId,
  assignmentId,
  maxAttempts = 1,
  submissions = [],
  grades = [],
  dueDate = null,
}: AssignmentSubmissionProps) {
  const router = useRouter();
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      text: "",
      files: [],
    },
  });

  // Sort submissions newest to oldest
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Check if user has reached max attempts or deadline passed
  const now = new Date();
  const isDueDatePassed = !!dueDate && new Date(dueDate) < now;
  const isCloseToDeadline =
    dueDate &&
    new Date(dueDate).getTime() - now.getTime() < 24 * 60 * 60 * 1000;

  const attemptsRemaining = (maxAttempts || 0) - submissions.length;
  // Updated to prevent submission after deadline
  const canSubmit =
    (maxAttempts == null || attemptsRemaining > 0) && !isDueDatePassed;

  // Default to history tab if submissions exist and no more attempts or if deadline passed
  const defaultTab =
    submissions.length > 0 && (!canSubmit || isDueDatePassed)
      ? "history"
      : "new";

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Assignment Submission</CardTitle>
          <div className="flex flex-wrap gap-2">
            {submissions.length > 0 && (
              <Badge variant={canSubmit ? "outline" : "destructive"}>
                {maxAttempts == null
                  ? isDueDatePassed
                    ? "Deadline passed"
                    : "You can attempt as many times you want"
                  : canSubmit
                    ? `${attemptsRemaining} attempt${attemptsRemaining !== 1 ? "s" : ""} remaining`
                    : isDueDatePassed
                      ? "Deadline passed"
                      : "No attempts remaining"}
              </Badge>
            )}

            <DueDateDisplay
              dueDate={dueDate}
              isDueDatePassed={isDueDatePassed || false}
              isCloseToDeadline={isCloseToDeadline || false}
            />
          </div>
        </div>

        <CardDescription className="mt-1">
          {submissions.length === 0
            ? isDueDatePassed
              ? "The submission deadline has passed"
              : "Submit your work for this assignment"
            : `You have submitted ${submissions.length} time${submissions.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>

      {!isDueDatePassed ? (
        <Tabs defaultValue={defaultTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new" disabled={!canSubmit || isDueDatePassed}>
                <PenLine className="mr-2 h-4 w-4" />
                New Submission
              </TabsTrigger>
              <TabsTrigger value="history" disabled={submissions.length === 0}>
                <History className="mr-2 h-4 w-4" />
                Submission History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* New Submission Tab */}
          <TabsContent value="new">
            <NewSubmissionForm
              form={form}
              sectionId={sectionId}
              assignmentId={assignmentId}
              canSubmit={canSubmit}
              submissions={submissions}
              maxAttempts={maxAttempts}
              isDueDatePassed={isDueDatePassed || false}
              dueDate={dueDate}
            />
          </TabsContent>

          {/* Submission History Tab */}
          <TabsContent value="history">
            <SubmissionHistory
              sortedSubmissions={sortedSubmissions}
              grades={grades}
              dueDate={dueDate}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <SubmissionHistory
          sortedSubmissions={sortedSubmissions}
          grades={grades}
          dueDate={dueDate}
        />
      )}
    </Card>
  );
}
