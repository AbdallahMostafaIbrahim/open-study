import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { Quizzes } from "./_components/quizzes";
import { QuizzesSkeleton } from "./_components/skeleton";

export default async function QuizzesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id);
  void api.student.courses.quizzes.get.prefetch({ sectionId });

  return (
    <HydrateClient>
      <Suspense fallback={<QuizzesSkeleton />}>
        <Quizzes sectionId={sectionId} />
      </Suspense>
    </HydrateClient>
  );
}
