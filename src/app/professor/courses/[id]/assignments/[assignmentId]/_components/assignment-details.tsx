"use client";

import {
  AlarmClock,
  ArrowLeft,
  Award,
  Calendar,
  ClipboardList,
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
import { formatDate, initials } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Submissions } from "./submissions";

export function AssignmentDetails({
  sectionId,
  assignmentId,
}: {
  sectionId: number;
  assignmentId: string;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch assignment details
  const [material, { isLoading, error, refetch }] =
    api.professor.courses.assignments.getOne.useSuspenseQuery({
      sectionId,
      id: assignmentId,
    });

  // Mutations for publish/unpublish and delete
  const publishMutation = api.professor.courses.assignments.publish.useMutation(
    {
      onSuccess: () => {
        refetch();
        toast.success(
          material?.isPublished
            ? "Assignment unpublished successfully"
            : "Assignment published successfully",
        );
        setPublishing(false);
      },
      onError: (error) => {
        toast.error(`Failed to update assignment: ${error.message}`);
        setPublishing(false);
      },
    },
  );

  const deleteMutation = api.professor.courses.assignments.delete.useMutation({
    onSuccess: () => {
      toast.success("Assignment deleted successfully");
      router.push(`/professor/courses/${sectionId}/assignments`);
    },
    onError: (error) => {
      toast.error(`Failed to delete assignment: ${error.message}`);
      setDeleting(false);
    },
  });

  // Handlers
  const handlePublishToggle = () => {
    setPublishing(true);
    publishMutation.mutate({
      id: assignmentId,
      sectionId,
      published: !material?.isPublished,
    });
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteMutation.mutate({
      id: assignmentId,
      sectionId,
    });
  };

  if (isLoading || !material) {
    return (
      <div className="flex justify-center py-8">
        Loading assignment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error loading assignment</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{material.title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={material.isPublished ? "outline" : "default"}
            size="sm"
            onClick={handlePublishToggle}
            disabled={publishing}
            className="gap-1"
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : material.isPublished ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {material.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/professor/courses/${sectionId}/assignments/${assignmentId}/edit`}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete assignment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this assignment? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Assignment content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
            <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
              <div className="text-muted-foreground flex items-center text-xs">
                <AlarmClock className="mr-1 h-4 w-4" />
                <span>
                  Due: {material.dueDate ? formatDate(material.dueDate) : "—"}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center text-xs">
                <Award className="mr-1 h-4 w-4" />
                <span>{material.points ?? "—"} pts</span>
              </div>
              <Badge
                variant={material.isPublished ? "default" : "outline"}
                className={
                  material.isPublished
                    ? "bg-green-500 hover:bg-green-500"
                    : "border-amber-500 text-amber-500"
                }
              >
                {material.isPublished ? "Published" : "Draft"}
              </Badge>
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
                <p>This assignment has no content or files.</p>
              </div>
            )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t pt-4 md:flex-row md:justify-between">
          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span className="flex items-center">
              <Clock className="mr-1 inline h-3.5 w-3.5" />
              {formatDate(material.date)}
            </span>
            <span className="flex items-center">
              <User className="mr-1 inline h-3.5 w-3.5" />
              {material.author.user.name}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/professor/courses/${sectionId}/assignments`)
            }
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to assignments
          </Button>
        </CardFooter>
      </Card>
      <Submissions assignmentId={assignmentId} sectionId={sectionId} />
    </div>
  );
}
