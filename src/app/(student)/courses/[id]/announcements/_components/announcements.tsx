"use client";

import {
  Award,
  Calendar,
  FolderOpen,
  OctagonAlert,
  Plus,
  Speaker,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { formatDate, initials } from "~/lib/utils";
import { api } from "~/trpc/react";

export const Announcements = ({ sectionId }: { sectionId: number }) => {
  // Get all announcements for this section
  const [announcements, { isLoading, error }] =
    api.student.courses.announcements.get.useSuspenseQuery({
      sectionId,
    });

  // Track the selected announcement
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(
    announcements.length > 0 ? announcements[0] : null,
  );



  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <div className="rounded-full bg-neutral-700 p-6">
        <OctagonAlert className="h-12 w-12 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold">No announcement yet</h2>
      <p className="text-muted-foreground max-w-md">
        No announcements have been made for this course yet. Check back later or
        contact your instructor for more information.
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading announcements...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading announcements</div>;
  }

  if (announcements.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Announcements</h1>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Announcements</h1>
      </div>

      {/* Side by side layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left side: Announcement list */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[60vh] px-4">
              <div className="space-y-1">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`cursor-pointer rounded-md px-4 py-3 transition-colors ${selectedAnnouncement?.id === announcement.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                      }`}
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <div className="flex justify-between">
                      <h3 className="line-clamp-1 font-medium">
                        {announcement.title}
                      </h3>
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{formatDate(announcement.date)}</span>
                    </div>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {announcement.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side: Selected announcement details */}
        <Card className="lg:col-span-2">
          {selectedAnnouncement ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl">
                  {selectedAnnouncement.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Author info */}
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={selectedAnnouncement.author.user.image || ""}
                      alt={selectedAnnouncement.author.user.name || ""}
                    />
                    <AvatarFallback>
                      {initials(selectedAnnouncement.author.user.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {selectedAnnouncement.author.user.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Posted on {formatDate(selectedAnnouncement.date)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Announcement content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {selectedAnnouncement.content
                    .split("\n")
                    .map((paragraph, idx) => (
                      <p key={idx} className="my-2">
                        {paragraph}
                      </p>
                    ))}
                </div>

                {/* Files if available */}
                {/* {selectedAnnouncement.files &&
                  selectedAnnouncement.files.length > 0 && (
                    <div className="pt-4">
                      <h3 className="mb-3 text-lg font-semibold">
                        Attachments
                      </h3>
                      <Separator className="mb-4" />
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {selectedAnnouncement.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:bg-accent flex items-center gap-2 rounded-md border p-3 transition-colors"
                          >
                            <FolderOpen className="h-4 w-4" />
                            <span className="flex-1 truncate text-sm">
                              {file.name || "File"}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )} */}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-[60vh] items-center justify-center">
              <p className="text-muted-foreground">
                Select an announcement to view details
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
