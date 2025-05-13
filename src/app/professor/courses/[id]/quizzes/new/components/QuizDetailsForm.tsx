"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import DurationInput from "~/components/ui/duration-input";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../page";

interface QuizDetailsFormProps {
  form: UseFormReturn<FormValues>;
}

export default function QuizDetailsForm({ form }: QuizDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Details</CardTitle>
        <CardDescription>Basic information about the quiz.</CardDescription>
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
                <Input placeholder="Enter a descriptive title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter quiz instructions or description"
                  className="min-h-32"
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
              <FormLabel>Total Points</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter points for this quiz"
                  value={field.value || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? 0 : Number(val));
                  }}
                />
              </FormControl>
              <FormDescription>
                Total points for the entire quiz.
              </FormDescription>
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
              <FormLabel>Due Date (Optional)</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  label="Select due date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Attempts */}
        <FormField
          control={form.control}
          name="maxAttempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Attempts (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave blank for unlimited attempts"
                  value={field.value || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? undefined : Number(val));
                  }}
                />
              </FormControl>
              <FormDescription>
                Maximum number of times a student can take this quiz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="durationInSeconds"
          render={({ field }) => (
            <FormItem>
              <DurationInput
                label="Duration (Optional)"
                value={field.value}
                onChange={field.onChange}
                description="Time limit for completing the quiz. Leave blank for no time limit."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published switch */}
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this quiz visible to students immediately.
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
  );
}
