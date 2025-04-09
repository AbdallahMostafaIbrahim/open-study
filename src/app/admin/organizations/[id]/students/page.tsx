import { redirect } from "next/navigation";
import { AddStudentDialog } from "~/app/_components/admin/organizations/students/add";
import { columns } from "~/app/_components/admin/organizations/students/columns";
import { StudentsDataTable } from "~/app/_components/admin/organizations/students/data-table";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function OrganizationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const students = await api.students.get(id);
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <AddStudentDialog organizationId={id} />
      </div>
      <div className="h-6"></div>
      <StudentsDataTable columns={columns} data={students} />
    </main>
  );
}
