import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { QuizDetails } from "./_components/quiz-details";
import { QuizDetailsSkeleton } from "./_components/skeleton";

export default async function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = await params;
  const sectionId = parseInt(id);
  void api.student.courses.quizzes.getOne.prefetch({
    sectionId,
    id: quizId,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<QuizDetailsSkeleton />}>
        <QuizDetails sectionId={sectionId} quizId={quizId} />
      </Suspense>
    </HydrateClient>
  );
}
