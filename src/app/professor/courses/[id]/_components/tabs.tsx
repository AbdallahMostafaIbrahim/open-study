"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TabsLinkTrigger: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <TabsTrigger value={href} asChild>
    <Link href={href}>{children}</Link>
  </TabsTrigger>
);

export const CourseTabs = ({ id }: { id: number }) => {
  const path = usePathname();
  // make the path just the first 4 segments of the pathname
  const pathSegments = path.split("/").slice(0, 5);
  const fixedPath = pathSegments.join("/");

  return (
    <Tabs value={fixedPath}>
      <TabsList>
        <TabsLinkTrigger href={`/professor/courses/${id}`}>
          Home
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/professor/courses/${id}/content`}>
          Content
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/professor/courses/${id}/assignments`}>
          Assignments
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/professor/courses/${id}/announcements`}>
          Announcements
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/professor/courses/${id}/students`}>
          Students
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/professor/courses/${id}/grades`}>
          Grades
        </TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
};
