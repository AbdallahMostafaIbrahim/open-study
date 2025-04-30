"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { SignedUrlResponse } from "~/lib/types";
import { Progress } from "~/components/ui/progress";
import { Upload, File, X, Check } from "lucide-react";

export function FileUploader({
  payload,
  url,
  onComplete,
}: {
  payload: Object;
  url: string;
  onComplete?: (opts: {
    fileKey: string;
    fileType: string;
    fileName: string;
  }) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      setUploading(true);
      setProgress(0);
      setError(null);
      setSuccess(false);

      for (let file of files) {
        try {
          // 1) Get signed URL
          const signRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!signRes.ok) throw new Error("Failed to get signed URL");

          const { uploadUrl, fileKey } =
            (await signRes.json()) as SignedUrlResponse;

          setProgress(30);

          // 2) Upload to S3
          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          setProgress(90);

          if (!uploadRes.ok) throw new Error("Failed to upload file");

          // 3) Complete upload
          setProgress(100);
          setSuccess(true);
          onComplete?.({ fileKey, fileType: file.type, fileName: file.name });
        } catch (err) {
          console.error("Upload error:", err);
          setError(err instanceof Error ? err.message : "Upload failed");
        }
      }

      setTimeout(() => {
        if (!error) setProgress(0);
        setUploading(false);
      }, 1000);
    },
    [payload, url, onComplete],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div
            className={`rounded-full p-3 ${isDragActive ? "bg-primary/10" : "bg-muted"}`}
          >
            <Upload
              className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? "Drop files here" : "Upload files"}
            </p>
            <p className="text-muted-foreground text-xs">
              Drag and drop or click to upload
            </p>
          </div>
        </div>
      </div>

      {(uploading || success || error) && (
        <div className="mt-4 space-y-3">
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {success && !uploading && (
            <div className="flex items-center rounded-md border bg-neutral-800 px-3 py-2 text-sm text-green-100">
              <Check className="mr-2 h-4 w-4" />
              <span>Upload complete</span>
            </div>
          )}

          {error && (
            <div className="flex items-center rounded-md border bg-neutral-800 px-3 py-2 text-sm text-red-100">
              <X className="mr-2 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
