import { Suspense } from "react";
import { AddSemesterDialog } from "./_components/add";
import { columns } from "./_components/columns";
import { SemestersDataTable } from "./_components/data-table";
import TableSkeleton, {
  type TableSkeletonProps,
} from "~/components/table-skeleton";
import { api, HydrateClient } from "~/trpc/server";

export const skeletonColumns: TableSkeletonProps["columns"] = [
  { key: "name", width: "w-[150px]", align: "left" },
  { key: "startsAt", width: "w-[100px]", align: "left" },
  { key: "endsAt", width: "w-[100px]", align: "left" },
  { key: "sections", width: "w-[100px]", align: "right" },
];

export default async function Semesters({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = parseInt(id);
  void api.admin.semesters.get.prefetch(orgId);
  return (
    <HydrateClient>
      <main className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Semesters</h1>
          <AddSemesterDialog organizationId={orgId} />
        </div>
        <div className="h-2"></div>
        <Suspense fallback={<TableSkeleton columns={skeletonColumns} />}>
          <SemestersDataTable columns={columns} id={orgId} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
