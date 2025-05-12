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
  const pathSegments = path.split("/").slice(0, 4);
  const fixedPath = pathSegments.join("/");

  return (
    <Tabs value={fixedPath}>
      <TabsList>
        <TabsLinkTrigger href={`/courses/${id}`}>Home</TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/assignments`}>
          Assignments
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/students`}>
          Students
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/courses/${id}/grades`}>Grades</TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
};
