import { AddProfessorDialog } from "~/app/_components/admin/organizations/professors/add";

import { columns } from "~/app/_components/admin/organizations/courses/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/courses/table/data-table";

import Link from "next/link";
import { AddCourseDialog } from "~/app/_components/admin/organizations/courses/add";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function Courses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courses = await api.admin.courses.get(id);

  return (
    <main className="p-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Courses</h1>
        <AddCourseDialog organizationId={id} />
      </div>
      <div className="h-6"></div>
      <DataTable columns={columns} data={courses} />
    </main>
  );
}
