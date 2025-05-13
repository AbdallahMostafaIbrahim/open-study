"use client";

import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Edit,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  Repeat,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { formatDate, formatDuration } from "~/lib/utils";
import { api } from "~/trpc/react";
import { QuestionType } from "@prisma/client";

export function QuizDetails({
  sectionId,
  quizId,
}: {
  sectionId: number;
  quizId: string;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch quiz details
  const [quiz, { isLoading, error, refetch }] =
    api.professor.courses.quizzes.getOne.useSuspenseQuery({
      sectionId,
      id: quizId,
    });

  // Mutations for publish/unpublish and delete
  const publishMutation = api.professor.courses.quizzes.publish.useMutation({
    onSuccess: () => {
      refetch();
      toast.success(
        quiz?.isPublished
          ? "Quiz unpublished successfully"
          : "Quiz published successfully",
      );
      setPublishing(false);
    },
    onError: (error) => {
      toast.error(`Failed to update quiz: ${error.message}`);
      setPublishing(false);
    },
  });

  const deleteMutation = api.professor.courses.quizzes.delete.useMutation({
    onSuccess: () => {
      toast.success("Quiz deleted successfully");
      router.push(`/professor/courses/${sectionId}/quizzes`);
    },
    onError: (error) => {
      toast.error(`Failed to delete quiz: ${error.message}`);
      setDeleting(false);
    },
  });

  // Handlers
  const handlePublishToggle = () => {
    setPublishing(true);
    publishMutation.mutate({
      id: quizId,
      sectionId,
      published: !quiz?.isPublished,
    });
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteMutation.mutate({
      id: quizId,
      sectionId,
    });
  };

  const formatQuestionType = (type: QuestionType) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "Multiple Choice";
      case "TRUE_FALSE":
        return "True/False";
      case "SHORT_ANSWER":
        return "Short Answer";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading quiz details...</div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Quiz not found</p>
      </div>
    );
  }

  const pointsSum = quiz.questions.reduce(
    (sum, question) => sum + (question.points || 0),
    0,
  );

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error loading quiz</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={quiz.isPublished ? "outline" : "default"}
            size="sm"
            onClick={handlePublishToggle}
            disabled={publishing}
            className="gap-1"
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : quiz.isPublished ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {quiz.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/professor/courses/${sectionId}/quizzes/${quizId}/edit`}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete quiz</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this quiz? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Quiz Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge
              variant={quiz.isPublished ? "default" : "outline"}
              className={
                quiz.isPublished
                  ? "bg-green-500 hover:bg-green-500"
                  : "border-amber-500 text-amber-500"
              }
            >
              {quiz.isPublished ? "Published" : "Draft"}
            </Badge>
            <div>
              <Badge variant="secondary">
                <Award className="mr-1 h-4 w-4" /> {quiz.points} points
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quiz metadata */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-muted-foreground text-sm">
                  {quiz.dueDate ? formatDate(quiz.dueDate) : "No due date"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-muted-foreground text-sm">
                  {quiz.durationInSeconds
                    ? formatDuration(quiz.durationInSeconds)
                    : "No time limit"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Repeat className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Attempts Allowed</p>
                <p className="text-muted-foreground text-sm">
                  {quiz.maxAttempts ? quiz.maxAttempts : "Unlimited"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <HelpCircle className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Questions</p>
                <p className="text-muted-foreground text-sm">
                  {quiz.questions.length} questions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <User className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Submissions</p>
                <p className="text-muted-foreground text-sm">
                  {quiz._count.submissions} submissions
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {quiz.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Description</h3>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {quiz.description.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-lg font-medium">Quiz Questions</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((question, index) => (
            <Card key={question.id} className="border-muted/40">
              <CardHeader className="py-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        Question {index + 1}
                      </Badge>
                      <Badge variant="secondary">
                        {formatQuestionType(question.type)}
                      </Badge>
                    </div>
                    <p className="font-medium">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{question.points} pts</Badge>
                    <Badge>
                      {((question.points / pointsSum) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Show options for multiple choice or true/false questions */}
                {(question.type === "MULTIPLE_CHOICE" ||
                  question.type === "TRUE_FALSE") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Options:</p>
                    <div className="space-y-1">
                      {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full border ${
                              question.correctAnswer?.includes(option)
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          ></div>
                          <span
                            className={
                              question.correctAnswer?.includes(option)
                                ? "font-medium"
                                : ""
                            }
                          >
                            {option}
                          </span>
                          {question.correctAnswer?.includes(option) && (
                            <Badge
                              variant="outline"
                              className="ml-1 border-green-200 bg-green-50 text-green-700"
                            >
                              Correct Answer
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show correct answer for short answer questions */}
                {question.type === "SHORT_ANSWER" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Correct Answer:</p>
                    <div className="bg-card rounded-md border p-2">
                      {question.correctAnswer?.[0] || "No answer provided"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {quiz.questions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">
                No questions added to this quiz yet.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-muted-foreground flex text-xs">
            <span className="flex items-center">
              Total: {quiz.points} points
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/professor/courses/${sectionId}/quizzes`)
            }
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to quizzes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
