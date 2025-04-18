import { Suspense } from "react";
import { AddOrganizationDialog } from "~/app/_components/admin/organizations/add";

import { columns } from "~/app/_components/admin/organizations/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/table/data-table";
import TableSkeleton, {
  type TableSkeletonProps,
} from "~/components/table-skeleton";

import { api, HydrateClient } from "~/trpc/server";

export const skeletonColumns: TableSkeletonProps["columns"] = [
  { key: "name", width: "w-[150px]", align: "left" },
  { key: "email", width: "w-[100px]", align: "left" },
  { key: "studentId", width: "w-[100px]", align: "left" },
  { key: "actions", width: "w-[100px]", align: "right" },
];

export default async function Organizations() {
  void api.admin.organizations.get.prefetch();

  return (
    <HydrateClient>
      <main className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <AddOrganizationDialog />
        </div>
        <div className="h-6"></div>
        <Suspense fallback={<TableSkeleton columns={skeletonColumns} />}>
          <DataTable columns={columns} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
