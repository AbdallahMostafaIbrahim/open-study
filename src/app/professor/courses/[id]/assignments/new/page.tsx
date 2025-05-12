"use client";

import { Check, ChevronLeft, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

// UI Components
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploader } from "~/components/file-uploader";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { S3_URL } from "~/lib/constants";
import { DatePicker } from "./_components/date-picker";
import { TextEditor } from "./_components/text-editor";

// Form schema matching your input schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().optional(),
  files: z.array(
    z.object({
      fileKey: z.string(),
      fileType: z.string(),
      fileName: z.string(),
    }),
  ),
  group: z.string().optional(),
  published: z.boolean(),
  points: z.number().min(0, "Points must be a positive number"),
  dueDate: z.date().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function CreateCourseMaterial() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sectionId = parseInt(params.id, 10);

  // Create material mutation
  const createMaterial = api.professor.courses.assignments.create.useMutation({
    onSuccess: () => {
      router.push(`/professor/courses/${sectionId}/content`);
      router.refresh();
    },
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      files: [],
      group: "",
      published: false,
    },
  });

  // Submit handler
  const onSubmit = (values: FormValues) => {
    createMaterial.mutate({
      sectionId,
      ...values,
    });
  };

  return (
    <div className="container max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Assignments
        </Button>
        <h1 className="text-3xl font-bold">Add New Assignment</h1>
        <p className="text-muted-foreground mt-2">
          Create a new assignment for your course. Fill in the details below and
          upload any necessary files.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Basic information about the assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Points field */}
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter points for this assignment"
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : field.value
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Published switch */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <FormDescription>
                        Make this assignment visible to students immediately.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content tabs - Edit and Preview */}
          <TextEditor control={form.control} />
          {/* File uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Upload supplementary files for this material.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        url="/api/upload/assignment"
                        payload={{
                          sectionId,
                        }}
                        onComplete={(file) => {
                          field.onChange([...(field.value || []), file]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload PDFs, images, or Office documents.
                    </FormDescription>
                    <FormMessage />

                    {/* Preview Files */}
                    {field.value && field.value.length > 0 && (
                      <div className="mt-4 flex flex-col space-y-2">
                        {field.value.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md border p-2"
                          >
                            <a
                              href={`${S3_URL}${file.fileKey}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 hover:underline"
                            >
                              <Check className="h-4 w-4" />
                              <span>{file.fileName}</span>
                            </a>
                            <Button
                              variant="link"
                              onClick={() => {
                                field.onChange([
                                  ...field.value.slice(0, index),
                                  ...field.value.slice(index + 1),
                                ]);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMaterial.isPending}>
                {createMaterial.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Material
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
