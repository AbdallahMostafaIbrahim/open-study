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

export const OrganizationTabs = ({ id }: { id: number }) => {
  const path = usePathname();

  return (
    <Tabs value={path}>
      <TabsList>
        <TabsLinkTrigger href={`/admin/organizations/${id}/students`}>
          Students
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/admin/organizations/${id}/professors`}>
          Professors
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/admin/organizations/${id}/courses`}>
          Courses
        </TabsLinkTrigger>
        <TabsLinkTrigger href={`/admin/organizations/${id}/semesters`}>
          Semesters
        </TabsLinkTrigger>
      </TabsList>
    </Tabs>
  );
};
