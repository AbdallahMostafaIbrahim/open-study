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
          </div>

          {quiz.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {quiz.description.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          <Button>Start</Button>
        </CardContent>
      </Card>
    </div>
  );
}
