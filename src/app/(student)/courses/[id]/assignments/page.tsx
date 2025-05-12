import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { Assignments } from "./_components/assignments";
import { AssignmentsSkeleton } from "./_components/skeleton";

export default async function AssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id);
  void api.student.courses.assignments.get.prefetch({ sectionId });

  return (
    <HydrateClient>
      <Suspense fallback={<AssignmentsSkeleton />}>
        <Assignments sectionId={sectionId} />
      </Suspense>
    </HydrateClient>
  );
}
