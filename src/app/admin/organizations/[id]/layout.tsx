import { redirect } from "next/navigation";

import { OrganizationTabs } from "./_components/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { initials } from "~/lib/utils";

import { api } from "~/trpc/server";

export default async function OrganizationLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const organization = await api.admin.organizations.getOne(parseInt(id));

  if (!organization) {
    redirect("/admin/organizations");
  }

  return (
    <main className="p-6">
      <div className="flex items-center">
        <Avatar className="mr-4 h-16 w-16">
          <AvatarImage src={organization.logo ?? undefined} />
          <AvatarFallback>{initials(organization.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p className="text-sm opacity-70">Country: {organization.country}</p>
          <p className="text-sm opacity-70">
            {organization._count.students} Student
            {organization._count.students === 1 ? "" : "s"}{" "}
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <OrganizationTabs id={organization.id} />
      <div className="h-4"></div>
      {children}
    </main>
  );
}
