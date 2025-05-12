import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { AssignmentDetails } from "./_components/assignment-details";
import { CourseMaterialDetailsSkeleton } from "./_components/skeleton";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = await params;
  const sectionId = parseInt(id);
  void api.professor.courses.assignments.getOne.prefetch({
    sectionId,
    id: assignmentId,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<CourseMaterialDetailsSkeleton />}>
        <AssignmentDetails sectionId={sectionId} assignmentId={assignmentId} />
      </Suspense>
    </HydrateClient>
  );
}
