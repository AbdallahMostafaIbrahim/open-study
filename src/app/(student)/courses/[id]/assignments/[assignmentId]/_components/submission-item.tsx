import { Award, Clock, FileText, MessageSquare, Upload } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { S3_URL } from "~/lib/constants";

interface SubmissionItemProps {
  submission: any;
  grade: any;
  dueDate?: Date | null;
}

export function SubmissionItem({
  submission,
  grade,
  dueDate,
}: SubmissionItemProps) {
  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const isLate = dueDate && new Date(submission.date) > new Date(dueDate);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Attempt {submission.attempt}</Badge>
          <span className="text-muted-foreground flex items-center text-sm">
            <Clock className="mr-1 inline h-3.5 w-3.5" />
            {formatDate(submission.date)}
          </span>
          {isLate && (
            <Badge variant="destructive" className="ml-2">
              Late
            </Badge>
          )}
        </div>

        {grade && (
          <div className="flex items-center">
            <Badge
              variant={grade.grade ? "default" : "outline"}
              className={grade.grade ? "bg-green-500 hover:bg-green-500" : ""}
            >
              <Award className="mr-1 h-3.5 w-3.5" />
              {grade.grade !== null
                ? `Grade: ${grade.grade}`
                : "Not graded yet"}
            </Badge>
          </div>
        )}
      </div>

      <div className="bg-card space-y-4 rounded-md border p-4">
        {/* Submission content */}
        {submission.text && (
          <div className="space-y-1">
            <h4 className="flex items-center text-sm font-medium">
              <FileText className="text-muted-foreground mr-2 h-4 w-4" />
              Your Answer
            </h4>
            <div className="bg-muted rounded-md p-3 text-sm whitespace-pre-wrap">
              {submission.text}
            </div>
          </div>
        )}

        {/* Files */}
        {submission.files && submission.files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Files ({submission.files.length})
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {submission.files.map((file: any) => (
                <a
                  key={file.id}
                  href={`${S3_URL}${file.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-accent flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center">
                    <Upload className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">{file.name || "File"}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {file.type || "Document"}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Teacher feedback if available */}
        {grade?.feedback && (
          <div className="space-y-1 pt-2">
            <Separator />
            <div className="pt-3">
              <h4 className="mb-2 flex items-center text-sm font-medium">
                <MessageSquare className="text-muted-foreground mr-2 h-4 w-4" />
                Instructor Feedback
              </h4>
              <div className="bg-muted rounded-md p-3 text-sm italic">
                {grade.feedback}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
