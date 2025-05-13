"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils"; // Make sure you have this utility

const TabsLinkTrigger: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <TabsTrigger value={href} asChild className="whitespace-nowrap">
    <Link href={href}>{children}</Link>
  </TabsTrigger>
);

export const CourseTabs = ({ id }: { id: number }) => {
  const path = usePathname();
  const pathSegments = path.split("/").slice(0, 4);
  const fixedPath = pathSegments.join("/");

  return (
    <Tabs value={fixedPath} className="w-full">
      <TabsList
        className={cn(
          "flex w-full flex-nowrap overflow-x-auto",
          "no-scrollbar pb-1", // Hide scrollbar but keep functionality
        )}
      >
        <TabsLinkTrigger href={`/courses/${id}`}>Home</TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/assignments`}>
          Assignments
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/quizzes`}>
          Quizzes
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/announcements`}>
          Announcements
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/students`}>
          Students
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/grades`}>Grades</TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
};
