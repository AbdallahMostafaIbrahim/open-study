import { Suspense } from "react";
import { AddProfessorDialog } from "~/app/_components/admin/organizations/professors/add";

import { columns } from "~/app/_components/admin/organizations/professors/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/professors/table/data-table";
import TableSkeleton, {
  type TableSkeletonProps,
} from "~/components/table-skeleton";

import { api, HydrateClient } from "~/trpc/server";

export const skeletonColumns: TableSkeletonProps["columns"] = [
  { key: "name", width: "w-[150px]", align: "left" },
  { key: "email", width: "w-[100px]", align: "left" },
  { key: "professorId", width: "w-[100px]", align: "left" },
  { key: "actions", width: "w-[100px]", align: "right" },
];

export default async function Professors({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = parseInt(id);
  void api.admin.professors.get.prefetch(orgId);

  return (
    <HydrateClient>
      <main className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Professors</h1>
          <AddProfessorDialog organizationId={orgId} />
        </div>
        <div className="h-2"></div>
        <Suspense fallback={<TableSkeleton columns={skeletonColumns} />}>
          <DataTable columns={columns} id={orgId} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
