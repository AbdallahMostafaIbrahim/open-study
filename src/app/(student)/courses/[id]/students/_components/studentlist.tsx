"use client";

import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export const StudentList = ({ sectionId }: { sectionId: number }) => {
  const [section, { isLoading, error, refetch }] =
    api.student.courses.getOne.useSuspenseQuery(sectionId);
  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading Students...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Students</CardTitle>
        </CardHeader>
        <CardContent className="-mt-4">
          <div className="space-y-2">
            {section?.students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={student.student.user.image || ""}
                      alt={student.student.user.name || ""}
                    />
                    <AvatarFallback>
                      {getInitials(student.student.user.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{student.student.user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
