import { redirect } from "next/navigation";

export default async function OrganizationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return redirect(`/admin/organizations/${id}/students`);
  return <div>Main Page</div>;
}
