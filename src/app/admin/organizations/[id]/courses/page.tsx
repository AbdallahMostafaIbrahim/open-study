import { columns } from "./_components/table/columns";
import { DataTable } from "./_components/table/data-table";
import { AddCourseDialog } from "./_components/add";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import TableSkeleton, {
  type TableSkeletonProps,
} from "~/components/table-skeleton";

export const skeletonColumns: TableSkeletonProps["columns"] = [
  { key: "name", width: "w-[150px]", align: "left" },
  { key: "description", width: "w-[100px]", align: "left" },
  { key: "sections", width: "w-[100px]", align: "left" },
];

export default async function Courses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = parseInt(id);
  void api.admin.courses.get.prefetch(orgId);

  return (
    <HydrateClient>
      <main className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Courses</h1>
          <AddCourseDialog organizationId={orgId} />
        </div>
        <div className="h-2"></div>
        <Suspense fallback={<TableSkeleton columns={skeletonColumns} />}>
          <DataTable columns={columns} id={orgId} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
