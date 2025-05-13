"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { QuizLoadingSkeleton } from "./_components/quiz-loading-skeleton";
import { QuizSession } from "./_components/quiz-session";

export default function QuizSessionPage() {
  return (
    <Suspense fallback={<QuizLoadingSkeleton />}>
      <QuizSessionContent />
    </Suspense>
  );
}

function QuizSessionContent() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  const sectionId = parseInt(id);
  const router = useRouter();

  const {
    data: submission,
    isLoading,
    error,
  } = api.student.courses.quizzes.session.useQuery(
    {
      sectionId,
      id: quizId,
    },
    {
      retry: 1,
    },
  );

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      router.push(`/courses/${sectionId}/quizzes`);
    }
  }, [error]);

  if (isLoading) return <QuizLoadingSkeleton />;
  if (error || !submission) return null;

  return <QuizSession submission={submission} sectionId={sectionId} />;
}
