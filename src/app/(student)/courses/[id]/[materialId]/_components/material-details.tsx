"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  Eye,
  EyeOff,
  File,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FileList } from "~/components/files";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { S3_URL } from "~/lib/constants";
import { initials } from "~/lib/utils";
import { api } from "~/trpc/react";

export function CourseMaterialDetails({
  sectionId,
  materialId,
}: {
  sectionId: number;
  materialId: string;
}) {
  const router = useRouter();

  // Fetch material details
  const [material, { isLoading, error, refetch }] =
    api.student.courses.material.getOne.useSuspenseQuery({
      sectionId,
      id: materialId,
    });

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        Loading material details...
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex justify-center py-8">
        <p>Material not found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error loading material</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${sectionId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{material.title}</h1>{" "}
          {material.group && (
            <Badge variant="outline" className="bg-muted/40">
              {material.group}
            </Badge>
          )}
        </div>
      </div>

      {/* Material content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={material.author.user.image || ""}
                  alt={material.author.user.name || ""}
                />
                <AvatarFallback>
                  {initials(material.author.user.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {material.author.user.name}
                </p>
                <div className="text-muted-foreground flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Posted on {formatDate(material.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Text content */}
          {material.text && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {material.text.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Files section */}
          <FileList files={material.files} />

          {!material.text &&
            (!material.files || material.files.length === 0) && (
              <div className="text-muted-foreground py-8 text-center">
                <p>This material has no content or files.</p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
