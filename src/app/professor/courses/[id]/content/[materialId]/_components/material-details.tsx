"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toast } from "sonner";
import { S3_URL } from "~/lib/constants";

export function CourseMaterialDetails({
  sectionId,
  materialId,
}: {
  sectionId: number;
  materialId: string;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch material details
  const [material, { isLoading, error, refetch }] =
    api.professor.courses.material.getOne.useSuspenseQuery({
      sectionId,
      id: materialId,
    });

  // Mutations for publish/unpublish and delete
  const publishMutation = api.professor.courses.material.publish.useMutation({
    onSuccess: () => {
      refetch();
      toast.success(
        material?.isPublished
          ? "Material unpublished successfully"
          : "Material published successfully",
      );
      setPublishing(false);
    },
    onError: (error) => {
      toast.error(`Failed to update material: ${error.message}`);
      setPublishing(false);
    },
  });

  const deleteMutation = api.professor.courses.material.delete.useMutation({
    onSuccess: () => {
      toast.success("Material deleted successfully");
      router.push(`/professor/courses/${sectionId}/content`);
    },
    onError: (error) => {
      toast.error(`Failed to delete material: ${error.message}`);
      setDeleting(false);
    },
  });

  // Handlers
  const handlePublishToggle = () => {
    setPublishing(true);
    publishMutation.mutate({
      id: materialId,
      sectionId,
      published: !material?.isPublished,
    });
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteMutation.mutate({
      id: materialId,
      sectionId,
    });
  };

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

  // Get user initials for avatar
  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  if (isLoading || !material) {
    return (
      <div className="flex justify-center py-8">
        Loading material details...
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
          <h1 className="text-2xl font-bold">{material.title}</h1>{" "}
          {material.group && (
            <Badge variant="outline" className="bg-muted/40">
              {material.group}
            </Badge>
          )}
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
              href={`/professor/courses/${sectionId}/content/${materialId}/edit`}
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
                <AlertDialogTitle>Delete material</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this material? This action
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
                  {getInitials(material.author.user.name || "")}
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
          {material.files && material.files.length > 0 && (
            <div className="pt-4">
              <h3 className="mb-3 text-lg font-semibold">Files</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {material.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <File className="h-10 w-10 text-blue-500" />
                        <div>
                          <p className="max-w-[180px] truncate font-medium">
                            {file.name || "Unnamed File"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {file.type || "Unknown type"}
                          </p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={`${S3_URL}${file.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download file</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!material.text &&
            (!material.files || material.files.length === 0) && (
              <div className="text-muted-foreground py-8 text-center">
                <p>This material has no content or files.</p>
              </div>
            )}
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-4">
          <div className="text-muted-foreground flex text-xs">
            <span className="mr-4 flex items-center">
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
              router.push(`/professor/courses/${sectionId}/content`)
            }
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to materials
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
