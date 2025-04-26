import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { CoursesList } from "./_components/courses";
import { CoursesSkeleton } from "./_components/skeleton";

export default async function Courses() {
  void api.professor.courses.get.prefetch();
  const currentSemesters = await api.professor.misc.currentSemesters();

  return (
    <HydrateClient>
      <main className="p-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Courses</h1>
          {currentSemesters.length === 1 && (
            <p className="text-sm font-semibold opacity-70">
              {currentSemesters[0]?.name}
            </p>
          )}
        </div>
        <div className="h-6"></div>
        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesList />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
