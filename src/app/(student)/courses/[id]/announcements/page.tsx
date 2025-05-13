import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { Announcements } from "./_components/announcements";
import { AnnouncementsSkeleton } from "./_components/skeleton";

export default async function AnnouncementsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const sectionId = parseInt(id);
    void api.student.courses.announcements.get.prefetch({ sectionId });

    return (
        <HydrateClient>
            <Suspense fallback={<AnnouncementsSkeleton />}>
                <Announcements sectionId={sectionId} />
            </Suspense>
        </HydrateClient>
    );
}
