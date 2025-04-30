import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { CourseMaterialDetails } from "./_components/material-details";
import { CourseMaterialDetailsSkeleton } from "./_components/skeleton";

export default async function MaterialDetailsPage({
  params,
}: {
  params: Promise<{ id: string; materialId: string }>;
}) {
  const { id, materialId } = await params;
  const sectionId = parseInt(id);
  void api.student.courses.material.getOne.prefetch({
    sectionId,
    id: materialId,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<CourseMaterialDetailsSkeleton />}>
        <CourseMaterialDetails sectionId={sectionId} materialId={materialId} />
      </Suspense>
    </HydrateClient>
  );
}
