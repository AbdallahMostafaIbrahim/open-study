import { Suspense } from "react";
import TableSkeleton, {
  type TableSkeletonProps,
} from "~/components/table-skeleton";
import { AddOrganizationDialog } from "./_components/add";
import { columns } from "./_components/table/columns";
import { DataTable } from "./_components/table/data-table";

import { api, HydrateClient } from "~/trpc/server";

const skeletonColumns: TableSkeletonProps["columns"] = [
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
