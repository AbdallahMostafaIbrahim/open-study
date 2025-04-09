import { redirect } from "next/navigation";
import { AddOrganizationDialog } from "~/app/_components/admin/organizations/add";

import { columns } from "~/app/_components/admin/organizations/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/table/data-table";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Organizations() {
  const organizations = await api.admin.organizations.get();

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <AddOrganizationDialog />
      </div>
      <div className="h-6"></div>
      <DataTable columns={columns} data={organizations} />
    </main>
  );
}
