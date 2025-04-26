import { api, HydrateClient } from "~/trpc/server";

export default async function Courses() {
  void api.admin.organizations.get.prefetch();

  return (
    <HydrateClient>
      <main className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Courses</h1>
        </div>
        <div className="h-6"></div>
      </main>
    </HydrateClient>
  );
}
