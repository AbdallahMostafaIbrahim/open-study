"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function CoursesList() {
  const [data] = api.professor.courses.get.useSuspenseQuery();

  return (
    <div className="flex flex-wrap gap-4">
      {data.length === 0 && (
        <p className="text-muted-foreground text-sm">
          You are not teaching any courses this semester.
        </p>
      )}
      {data.map((course) => (
        <Link
          key={course.id}
          href={`/professor/courses/${course.id}`}
          className="focus:ring-primary/50 block w-full rounded-xl outline-none focus:ring focus:ring-offset-0 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.75rem)] xl:w-[calc(25%-0.75rem)]"
          aria-label={`View ${course.course.name} course details`}
        >
          <Card className="group flex h-full cursor-pointer flex-col transition-all duration-200 hover:border-neutral-600 hover:shadow-md">
            <CardHeader>
              <CardTitle>{course.course.name}</CardTitle>
              <CardDescription>
                {course.course.courseCode} - Section {course.sectionNumber}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {course.course.description || "No description available."}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                {course._count.students} students
              </p>
              <div className="transform transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
