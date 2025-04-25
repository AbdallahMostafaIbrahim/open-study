"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import {
  courseFormSchema,
  type CourseFormValues,
  type SectionFormValues,
} from "./schema";
import { SectionDialog } from "./section-dialog";
import { SectionTable } from "./section-table";

export const AddCourseForm = ({
  organizationId,
}: {
  organizationId: number;
}) => {
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      courseCode: "",
      sections: [],
    },
  });

  const { isPending, mutate } = api.admin.courses.create.useMutation({
    onSuccess: () => {
      form.reset();
      router.replace(`/admin/organizations/${organizationId}/courses`);
    },
  });

  function handleAddSection(section: SectionFormValues) {
    const currentSections = form.getValues().sections || [];
    console.log("currentSections", currentSections, section);
    form.setValue("sections", [...currentSections, section]);
  }

  function handleRemoveSection(index: number) {
    const currentSections = form.getValues().sections;
    form.setValue(
      "sections",
      currentSections.filter((_, i) => i !== index),
    );
  }

  function onSubmit(values: CourseFormValues) {
    mutate({ ...values, organizationId });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course Code
                    <span className="text-xs text-gray-700"> (optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="CSCE 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="This course covers the fundamentals of software engineering"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sections"
            render={({ field }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Course Sections</h3>
                  <SectionDialog
                    organizationId={organizationId}
                    onSectionAdded={handleAddSection}
                  />
                </div>

                <SectionTable
                  sections={field.value}
                  organizationId={organizationId}
                  onRemoveSection={handleRemoveSection}
                />
              </div>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.replace(`/admin/organizations/${organizationId}/courses`)
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              Create Course
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
