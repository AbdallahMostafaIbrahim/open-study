import { Check } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FileUploader } from "~/components/file-uploader";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { S3_URL } from "~/lib/constants";
import type { SubmissionFormValues } from "./assignment-submission";

interface FileUploadListProps {
  form: UseFormReturn<SubmissionFormValues>;
  sectionId: number;
}

export function FileUploadList({ form, sectionId }: FileUploadListProps) {
  return (
    <FormField
      control={form.control}
      name="files"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FileUploader
              url="/api/upload/assignment-submission"
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
  );
}
