import { AddCourseForm } from "../_components/add";

export default async function AddCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = parseInt(id);
  // const courses = await api.admin.courses.get(id);

  return (
    <main className="p-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Course Template</h1>
      </div>
      <div className="h-6"></div>
      <AddCourseForm organizationId={orgId} />
    </main>
  );
}
