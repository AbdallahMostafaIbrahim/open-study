import { Book, Pen, Terminal, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export default async function CourseAlerts({ id }: { id: number }) {
  const section = await api.professor.courses.getOne(id);
  if (!section) return null;
  // section.professors = [...section.professors, ...section.professors];
  return (
    <div className="flex flex-col gap-4">
      {/* Instructor Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Instructors</CardTitle>
        </CardHeader>
        <CardContent className="-mt-4">
          <div className="space-y-2">
            {section.professors.map((professor) => (
              <div
                key={professor.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{professor.professor.user.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {professor.professor.user.email}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      professor.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {professor.type === "PROFESSOR" ? "Professor" : "TA"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {section._count.materials === 0 && (
        <Alert>
          <Book className="h-4 w-4" />
          <AlertTitle>No Course Content Yet!</AlertTitle>
          <AlertDescription>
            <p>
              This course does not have any materials added yet. Start by adding
              them from the{" "}
              <Link
                href={`/professor/courses/${id}/content`}
                className="font-semibold text-purple-400 transition-all hover:text-purple-500 hover:underline"
              >
                materials section
              </Link>
            </p>
          </AlertDescription>
        </Alert>
      )}
      {section._count.assignments === 0 && (
        <Alert>
          <Pen className="h-4 w-4" />
          <AlertTitle>No Assignments Yet!</AlertTitle>
          <AlertDescription>
            <p>
              This course does not have any assignments added yet. Start by
              adding them from the{" "}
              <Link
                href={`/professor/courses/${id}/assignments`}
                className="font-semibold text-purple-400 transition-all hover:text-purple-500 hover:underline"
              >
                assignments section
              </Link>
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link
          href={`/professor/courses/${id}/content`}
          className="focus:ring-primary/50 block rounded-xl outline-none focus:ring focus:ring-offset-0"
        >
          <Card className="h-full cursor-pointer text-center transition-all duration-200 hover:border-neutral-600 hover:shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-muted-foreground font-medium">
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-3xl font-bold">{section._count.materials}</p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href={`/professor/courses/${id}/assignments`}
          className="focus:ring-primary/50 block rounded-xl outline-none focus:ring focus:ring-offset-0"
        >
          <Card className="h-full cursor-pointer text-center transition-all duration-200 hover:border-neutral-600 hover:shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-muted-foreground font-medium">
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-3xl font-bold">{section._count.assignments}</p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href={`/professor/courses/${id}/students`}
          className="focus:ring-primary/50 block rounded-xl outline-none focus:ring focus:ring-offset-0"
        >
          <Card className="h-full cursor-pointer text-center transition-all duration-200 hover:border-neutral-600 hover:shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-muted-foreground font-medium">
                Students
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-3xl font-bold">{section._count.students}</p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href={`/professor/courses/${id}/quizzes`}
          className="focus:ring-primary/50 block rounded-xl outline-none focus:ring focus:ring-offset-0"
        >
          <Card className="h-full cursor-pointer text-center transition-all duration-200 hover:border-neutral-600 hover:shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-muted-foreground font-medium">
                Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-3xl font-bold">{section._count.quizes}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
