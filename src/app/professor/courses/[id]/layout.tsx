import { redirect } from "next/navigation";

import { Separator } from "~/components/ui/separator";

import { api } from "~/trpc/server";
import { CourseTabs } from "./_components/tabs";

export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const section = await api.professor.courses.getOne(parseInt(id));

  if (!section) {
    redirect("/professor/courses");
  }

  return (
    <main className="p-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold">{section.course.name}</h1>
          <p className="text-sm opacity-70">
            {section.course.courseCode} - Section {section.sectionNumber}
          </p>
          <p className="text-sm opacity-70">
            {section._count.students} Student
            {section._count.students === 1 ? "" : "s"}{" "}
          </p>
        </div>
      </div>
      <Separator className="mt-2 mb-4" />
      <CourseTabs id={section.id} />
      <div className="h-4"></div>
      {children}
    </main>
  );
}
