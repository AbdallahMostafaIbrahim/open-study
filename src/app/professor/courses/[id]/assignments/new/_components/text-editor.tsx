// UI Components
import { useState } from "react";
import type { Control } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import type { FormValues } from "../page";

export function TextEditor({ control }: { control: Control<FormValues> }) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assignment Description</CardTitle>
          <Tabs defaultValue="edit" className="w-[200px]">
            <TabsList>
              <TabsTrigger value="edit" onClick={() => setIsPreviewing(false)}>
                Edit
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                onClick={() => setIsPreviewing(true)}
              >
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>Add the content for this material.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {isPreviewing ? (
                  <div className="prose min-h-[400px] max-w-none overflow-auto rounded-md border p-4">
                    <pre className="whitespace-pre-wrap">
                      {field.value || "No content to preview"}
                    </pre>
                  </div>
                ) : (
                  <Textarea
                    {...field}
                    placeholder="Write your content here..."
                    className="min-h-[400px] font-mono"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
