import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardHeader } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";
import { StudentList } from "./_components/studentlist";

export default async function MaterialDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id);
  void api.student.courses.getOne.prefetch(sectionId);
  return (
    <HydrateClient>
      <StudentList sectionId={sectionId} />
    </HydrateClient>
  );
}
