"use client";

import {
  Award,
  Calendar,
  Clock,
  HelpCircle,
  PenTool,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CardTitle } from "~/components/ui/card";
import { formatDate, formatDuration } from "~/lib/utils";
import { api } from "~/trpc/react";

export const Quizzes = ({ sectionId }: { sectionId: number }) => {
  // Get all quizzes for this section
  const [quizzes, { isLoading, error }] =
    api.student.courses.quizzes.get.useSuspenseQuery({
      sectionId,
    });

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="rounded-full bg-neutral-700 p-6">
        <PenTool className="h-12 w-12 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold">No quizzes yet</h2>
      <p className="text-muted-foreground max-w-md">
        No quizzes have been created for this course yet. Check back later or
        contact your instructor for more information.
      </p>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading quizzes</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quizzes</h1>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
      </div>

      <div className="flex flex-col space-y-4">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/courses/${sectionId}/quizzes/${quiz.id}`}>
            <div className="hover:border-primary bg-card w-full cursor-pointer rounded-md border transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between p-6">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>{" "}
                  <div className="flex flex-wrap gap-4 pt-2">
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
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
