"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileList } from "~/components/files";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { formatDate } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

type RouterSubmission =
  RouterOutputs["professor"]["courses"]["assignments"]["submissions"][0];

const formSchema = z.object({
  grade: z.coerce
    .number()
    .min(0, { message: "Grade cannot be negative" })
    .max(100, { message: "Grade cannot exceed 100" }),
  feedback: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionGradingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: RouterSubmission | null;
  sectionId: number;
  assignmentId: string;
  maxPoints?: number | null;
  onSuccess?: () => void;
}

export function SubmissionGradingModal({
  open,
  onOpenChange,
  submission,
  sectionId,
  assignmentId,
  maxPoints = 100,
  onSuccess,
}: SubmissionGradingModalProps) {
  // Find existing grade for this submission
  const existingGrade = submission?.grade;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: existingGrade?.grade || 0,
      feedback: existingGrade?.feedback || "",
    },
  });

  // Reset form when submission changes
  useEffect(() => {
    if (submission && open) {
      const latestGrade = submission.grade;

      form.reset({
        grade: latestGrade?.grade || 0,
        feedback: latestGrade?.feedback || "",
      });
    }
  }, [submission, form, open]);

  const gradeMutation = api.professor.courses.assignments.grade.useMutation({
    onSuccess: () => {
      toast.success("Submission graded successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to grade submission: ${error.message}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!submission) return;

    gradeMutation.mutate({
      assignmentId,
      sectionId,
      studentId: submission.student.user.id,
      grade: values.grade,
      attempt: submission.attempt,
      feedback: values.feedback,
    });
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {existingGrade ? "Update Grade" : "Grade Submission"}
          </DialogTitle>
          <DialogDescription>
            Submission from {submission.student.user.name} on{" "}
            {formatDate(submission.date)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-1">
            {/* Submission details */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">Latest Submission</h3>

                {/* Grade status indicator */}
                {existingGrade ? (
                  <Badge className="bg-green-600">
                    Current Grade: {existingGrade.grade}/{maxPoints}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-600"
                  >
                    Not graded yet
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4" />
                <span>Submitted on {formatDate(submission.date)}</span>
              </div>

              {/* Submission text */}
              {submission.text ? (
                <ScrollArea className="bg-muted/30 max-h-60 rounded-md border p-3">
                  <div className="whitespace-pre-wrap">{submission.text}</div>
                </ScrollArea>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No text response provided.
                </div>
              )}
            </div>

            {/* Submission files */}
            {submission.files && submission.files.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-medium">Files</h3>
                <FileList files={submission.files} />
              </div>
            )}

            <Separator />

            {/* Grading form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Grade (out of {maxPoints ?? 100} points)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={maxPoints ?? 100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide feedback on this submission"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={gradeMutation.isPending}>
                    {gradeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : existingGrade ? (
                      "Update Grade"
                    ) : (
                      "Save Grade"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
