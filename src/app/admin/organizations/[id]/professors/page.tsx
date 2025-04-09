import { AddProfessorDialog } from "~/app/_components/admin/organizations/professors/add";

import { columns } from "~/app/_components/admin/organizations/professors/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/professors/table/data-table";

import { api } from "~/trpc/server";

export default async function Professors({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const professors = await api.admin.professors.get(id);

  return (
    <main className="p-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Professors</h1>
        <AddProfessorDialog organizationId={id} />
      </div>
      <div className="h-6"></div>
      <DataTable columns={columns} data={professors} />
    </main>
  );
}
