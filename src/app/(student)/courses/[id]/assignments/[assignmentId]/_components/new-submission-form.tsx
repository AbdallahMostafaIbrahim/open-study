import { AlertCircle, AlertTriangle, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { FileUploader } from "~/components/file-uploader";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { S3_URL } from "~/lib/constants";
import { api } from "~/trpc/react";
import type { SubmissionFormValues } from "./assignment-submission";
import { FileUploadList } from "./file-upload-list";

interface NewSubmissionFormProps {
  form: UseFormReturn<SubmissionFormValues>;
  sectionId: number;
  assignmentId: string;
  canSubmit: boolean;
  submissions: any[];
  maxAttempts: number | null | undefined;
  isDueDatePassed: boolean;
  dueDate: Date | null | undefined;
}

export function NewSubmissionForm({
  form,
  sectionId,
  assignmentId,
  canSubmit,
  submissions,
  maxAttempts,
  isDueDatePassed,
  dueDate,
}: NewSubmissionFormProps) {
  const router = useRouter();

  const { mutate, isPending } =
    api.student.courses.assignments.submit.useMutation({
      onSuccess: () => {
        toast.success("Assignment submitted successfully!");
        router.refresh();
        form.reset(); // Clear form after submission
      },
      onError: (error) => {
        toast.error(`Failed to submit: ${error.message || "Please try again"}`);
      },
    });

  const onSubmit = (values: SubmissionFormValues) => {
    // No confirmation needed as deadline check is handled by canSubmit now
    mutate({
      sectionId,
      assignmentId,
      text: values.text,
      files: values.files,
    });
  };

  if (isDueDatePassed && submissions.length === 0) {
    return (
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission deadline passed</AlertTitle>
          <AlertDescription>
            You cannot submit to this assignment as the deadline was{" "}
            {formatDate(dueDate!)}.
          </AlertDescription>
        </Alert>
      </CardContent>
    );
  }

  if (!canSubmit && submissions.length > 0) {
    return (
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Maximum attempts reached</AlertTitle>
          <AlertDescription>
            You've used all {maxAttempts} submission attempts for this
            assignment.
          </AlertDescription>
        </Alert>
      </CardContent>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <label
                  htmlFor="submission-text"
                  className="mb-1 block font-medium"
                >
                  Your Answer
                </label>
                <FormControl>
                  <Textarea
                    id="submission-text"
                    placeholder="Write your answer here..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FileUploadList form={form} sectionId={sectionId} />
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-4">
          <div className="ml-auto">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Assignment"
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

// Add this helper function if it's not already imported
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
