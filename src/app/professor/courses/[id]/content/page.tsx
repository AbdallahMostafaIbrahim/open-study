import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { CourseMaterial } from "./_components/material";
import { CourseMaterialSkeleton } from "./_components/skeleton";

export default async function CourseContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id);
  void api.professor.courses.material.get.prefetch({ sectionId });

  return (
    <HydrateClient>
      <Suspense fallback={<CourseMaterialSkeleton />}>
        <CourseMaterial sectionId={sectionId} />
      </Suspense>
    </HydrateClient>
  );
}
