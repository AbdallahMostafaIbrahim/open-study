import { redirect } from "next/navigation";
import { AddOrganizationDialog } from "~/app/_components/admin/organizations/add";

import { columns } from "~/app/_components/admin/organizations/table/columns";
import { DataTable } from "~/app/_components/admin/organizations/table/data-table";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function OrganizationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return redirect(`/admin/organizations/${id}/students`);
  return <div>Main Page</div>;
}
