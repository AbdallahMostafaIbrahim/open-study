import { redirect } from "next/navigation";

import { CourseTabs } from "./_components/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { initials } from "~/lib/utils";

import { api } from "~/trpc/server";

export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const section = await api.student.courses.getOne(parseInt(id));

  if (!section) {
    redirect("/courses");
  }

  return (
    <main className="p-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold">{section.course.name}</h1>
          <p className="text-sm opacity-70">
            {section.course.courseCode} - Section {section.sectionNumber}
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
