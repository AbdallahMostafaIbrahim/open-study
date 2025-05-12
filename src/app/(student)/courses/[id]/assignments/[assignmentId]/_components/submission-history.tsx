import { CardContent } from "~/components/ui/card";
import { SubmissionItem } from "./submission-item";

interface SubmissionHistoryProps {
  sortedSubmissions: any[];
  grades: any[];
  dueDate?: Date | null;
}

export function SubmissionHistory({
  sortedSubmissions,
  grades,
  dueDate,
}: SubmissionHistoryProps) {
  // Get grade for a specific attempt
  const getGradeForAttempt = (attemptNumber: number) => {
    return grades.find((grade) => grade.attempt === attemptNumber);
  };

  return (
    <CardContent className="space-y-6 pt-4">
      {sortedSubmissions.length === 0 ? (
        <div className="text-muted-foreground py-5 text-center">
          No submissions.
        </div>
      ) : (
        <div className="space-y-8">
          {sortedSubmissions.map((submission) => (
            <SubmissionItem
              key={submission.id}
              submission={submission}
              grade={getGradeForAttempt(submission.attempt)}
              dueDate={dueDate}
            />
          ))}
        </div>
      )}
    </CardContent>
  );
}
