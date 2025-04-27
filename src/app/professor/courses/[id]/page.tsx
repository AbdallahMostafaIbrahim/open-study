import { Book, Terminal } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import CourseAlerts from "./_components/alerts";

export default async function CourseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id);

  return (
    <HydrateClient>
      <CourseAlerts id={sectionId} />
    </HydrateClient>
  );
}
