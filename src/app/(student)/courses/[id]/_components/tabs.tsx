"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"; // Import ScrollArea and ScrollBar
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils"; // Make sure you have this utility

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
  let currentTabValue = `/courses/${id}`;

  if (pathSegments.length > 3 && pathSegments[3]) {
    const potentialTabSegment = pathSegments[3];
    const validSegments = [
      "assignments",
      "quizzes",
      "announcements",
      "students",
      "grades",
    ];
    if (validSegments.includes(potentialTabSegment)) {
      currentTabValue = `/courses/${id}/${potentialTabSegment}`;
    }
  }

  return (
    <Tabs value={currentTabValue} className="w-full border-b">
      <ScrollArea
        className="w-full whitespace-nowrap"
        aria-orientation="horizontal"
      >
        <TabsList className={cn("inline-flex h-auto min-w-full p-0")}>
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
        </TabsList>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
    </Tabs>
  );
};
