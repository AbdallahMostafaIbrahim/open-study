import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { QuizDetailsSkeleton } from "./components/skeleton";
import { QuizDetails } from "./components/quiz-details";

export default async function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = await params;
  const sectionId = parseInt(id);
  void api.professor.courses.quizzes.getOne.prefetch({
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
