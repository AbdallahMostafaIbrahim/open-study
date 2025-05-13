"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

const TabsLinkTrigger: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <TabsTrigger value={href} asChild className="px-3 py-1.5 whitespace-nowrap">
    <Link href={href}>{children}</Link>
  </TabsTrigger>
);

export const CourseTabs = ({ id }: { id: number }) => {
  const path = usePathname();

  const pathSegments = path.split("/");
  let currentTabValue = `/professor/courses/${id}`;

  if (pathSegments.length > 4 && pathSegments[4]) {
    const potentialTabSegment = pathSegments[4];
    const validSegments = [
      "content",
      "assignments",
      "announcements",
      "quizzes",
      "students",
    ];
    if (validSegments.includes(potentialTabSegment)) {
      currentTabValue = `/professor/courses/${id}/${potentialTabSegment}`;
    }
  }

  return (
    <Tabs value={currentTabValue} className="w-full border-b">
      <ScrollArea
        className="w-full whitespace-nowrap"
        aria-orientation="horizontal"
      >
        <TabsList className={cn("inline-flex h-auto min-w-full p-0")}>
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
          <TabsLinkTrigger href={`/professor/courses/${id}/quizzes`}>
            Quizzes
          </TabsLinkTrigger>
          <TabsLinkTrigger href={`/professor/courses/${id}/students`}>
            Students
          </TabsLinkTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
    </Tabs>
  );
};
