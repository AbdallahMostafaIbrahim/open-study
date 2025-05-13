"use client";

import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Download,
  Edit,
  Eye,
  EyeOff,
  File,
  GitBranch,
  HelpCircle,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FileList } from "~/components/files";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { S3_URL } from "~/lib/constants";
import { formatDate, formatDuration, initials } from "~/lib/utils";
import { api } from "~/trpc/react";
import { BestQuizSubmission } from "./best-quiz-submission";

export function QuizDetails({
  sectionId,
  quizId,
}: {
  sectionId: number;
  quizId: string;
}) {
  const router = useRouter();

  // Fetch material details
  const [quiz, { isLoading, error, refetch }] =
    api.student.courses.quizzes.getOne.useSuspenseQuery({
      sectionId,
      id: quizId,
    });

  const { mutate, isPending: isStarting } =
    api.student.courses.quizzes.start.useMutation({
      onSuccess(data) {
        if (data) {
          router.push(`/courses/${sectionId}/quizzes/${quizId}/session`);
        }
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading quiz details...</div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center py-8">
        <p>Quiz not found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error loading material</h3>
        <p>{error.message}</p>
      </div>
    );
  }
  let canStartQuiz = true;

  if (quiz.dueDate) {
    const dueDate = new Date(quiz.dueDate);
    const now = new Date();
    canStartQuiz = dueDate > now;
  }
  if (quiz.maxAttempts) {
    canStartQuiz = canStartQuiz && quiz.maxAttempts > quiz.submissions.length;
  }

  // Check if the last submission doesn't have a finishedAt date
  const canResume = quiz.submissions.some(
    (submission) => !submission.finishedAt,
  );
  const canRetry = quiz.submissions.length > 0;

  // Let's get the best submission (highest score)
  const bestSubmission =
    quiz.submissions && quiz.submissions.length > 0
      ? quiz.submissions.sort((a, b) => (b.grade || 0) - (a.grade || 0))[0]
      : null;

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${sectionId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
        </div>
      </div>

      {/* Material content */}
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-sm">
              <Calendar className="text-muted-foreground mr-1.5 h-4 w-4" />
              <span>
                Due: {quiz.dueDate ? formatDate(quiz.dueDate) : "None"}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Award className="text-muted-foreground mr-1.5 h-4 w-4" />
              <span>{quiz.points} pts</span>
            </div>
            <div className="flex items-center text-sm">
              <HelpCircle className="text-muted-foreground mr-1.5 h-4 w-4" />
              <span>
                {quiz._count.questions} question
                {quiz._count.questions !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="text-muted-foreground mr-1.5 h-4 w-4" />
              <span>
                {quiz.durationInSeconds
                  ? formatDuration(quiz.durationInSeconds)
                  : "No Limit"}
              </span>
            </div>
            {quiz.maxAttempts && (
              <div className="flex items-center text-sm">
                <GitBranch className="text-muted-foreground mr-1.5 h-4 w-4" />
                <span>max attempts: {quiz.maxAttempts}</span>
              </div>
            )}
          </div>

          {quiz.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {quiz.description.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}
          {canStartQuiz && (
            <Button
              onClick={() => mutate({ id: quizId, sectionId })}
              disabled={isStarting}
              className="mt-4"
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : canResume ? (
                "Resume Quiz"
              ) : canRetry ? (
                "Retry Quiz"
              ) : (
                "Start Quiz"
              )}
            </Button>
          )}
          {quiz.submissions.length > 0 && (
            <p className="text-muted-foreground text-sm">
              You have submitted this quiz {quiz.submissions.length} time
              {quiz.submissions.length > 1 ? "s" : ""} before.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Show Last Submission Results */}
      {bestSubmission && (
        <BestQuizSubmission
          submission={bestSubmission}
          totalPoints={quiz.points}
        />
      )}
    </div>
  );
}
