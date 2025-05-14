"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatDate, initials } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { SubmissionGradingModal } from "./submission-grading-modal";

type RouterSubmissions =
  RouterOutputs["professor"]["courses"]["assignments"]["submissions"];

export function Submissions({
  sectionId,
  assignmentId,
}: {
  sectionId: number;
  assignmentId: string;
}) {
  const [selectedSubmission, setSelectedSubmission] = useState<
    | RouterOutputs["professor"]["courses"]["assignments"]["submissions"][0]
    | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [submissions, { refetch }] =
    api.professor.courses.assignments.submissions.useSuspenseQuery({
      sectionId,
      id: assignmentId,
    });

  const [assignmentDetails] =
    api.professor.courses.assignments.getOne.useSuspenseQuery({
      sectionId,
      id: assignmentId,
    });

  if (!submissions) return null;

  // Group submissions by student
  const groupedSubmissions = submissions.reduce(
    (acc, submission) => {
      const studentId = submission.student.user.id;
      if (!acc[studentId]) {
        acc[studentId] = [];
      }
      acc[studentId].push(submission);
      return acc;
    },
    {} as Record<string, RouterSubmissions>,
  );

  // Sort submissions within each student group by date (newest first)
  Object.keys(groupedSubmissions).forEach((studentId) => {
    groupedSubmissions[studentId]?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });

  const handleSubmissionClick = (submissions: RouterSubmissions) => {
    // Get the latest submission (first in array after sorting)
    const latestSubmission = submissions[0];
    if (latestSubmission) {
      setSelectedSubmission(latestSubmission);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Submissions ({Object.keys(groupedSubmissions).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {submissions.length > 0 ? (
              Object.entries(groupedSubmissions).map(
                ([studentId, studentSubmissions]) => (
                  <Submission
                    key={studentId}
                    attempts={studentSubmissions}
                    onClick={() => handleSubmissionClick(studentSubmissions)}
                  />
                ),
              )
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <p>This assignment has no submissions.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SubmissionGradingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        submission={selectedSubmission}
        sectionId={sectionId}
        assignmentId={assignmentId}
        maxPoints={assignmentDetails?.points}
        onSuccess={refetch}
      />
    </>
  );
}

export function Submission({
  attempts,
  onClick,
}: {
  attempts: RouterSubmissions;
  onClick: () => void;
}) {
  const latestSubmission = attempts[0]!;

  return (
    <div
      className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-md border p-3 transition-colors"
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={latestSubmission.student.user.image || ""}
          alt={latestSubmission.student.user.name || ""}
        />
        <AvatarFallback>
          {initials(latestSubmission.student.user.name || "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">
          {latestSubmission.student.user.name}
        </p>
        <div className="text-muted-foreground flex items-center text-xs">
          <Calendar className="mr-1 h-3 w-3" />
          <span>Submitted on {formatDate(latestSubmission.date)}</span>
        </div>
      </div>

      <div className="ml-auto flex flex-col items-end gap-1">
        {/* Grade status indicator */}
        {latestSubmission.grade.grade ? (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            Graded: {latestSubmission.grade.grade}
          </Badge>
        ) : (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            Not graded
          </Badge>
        )}

        {/* Multiple submissions indicator */}
        {attempts.length > 1 && (
          <span className="text-muted-foreground text-xs">
            {attempts.length} submissions
          </span>
        )}
      </div>
    </div>
  );
}
