import { AddProfessorDialog } from "~/app/_components/admin/organizations/professors/add";

import { columns } from "~/app/_components/admin/organizations/courses/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/courses/table/data-table";

import Link from "next/link";
import { AddCourseDialog } from "~/app/_components/admin/organizations/courses/add";
import { Button } from "~/components/ui/button";
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
