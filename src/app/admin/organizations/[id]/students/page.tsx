import { Suspense } from "react";
import { AddStudentDialog } from "~/app/_components/admin/organizations/students/add";
import { columns } from "~/app/_components/admin/organizations/students/columns";
import { StudentsDataTable } from "~/app/_components/admin/organizations/students/data-table";
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

export default async function OrganizationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = parseInt(id);
  void api.students.get.prefetch(orgId);
  return (
    <HydrateClient>
      <main className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Students</h1>
          <AddStudentDialog organizationId={orgId} />
        </div>
        <div className="h-2"></div>
        <Suspense fallback={<TableSkeleton columns={skeletonColumns} />}>
          <StudentsDataTable columns={columns} id={orgId} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
