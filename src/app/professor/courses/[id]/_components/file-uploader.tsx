"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface SignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

export function FileUploader({ sectionId: sectionId }: { sectionId: number }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const onDrop = useCallback(
    async (files: File[]) => {
      setUploading(true);
      setProgress(0);

      for (let file of files) {
        try {
          // 1) Get signed URL
          const signRes = await fetch("/api/upload/material", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              fileType: file.type,
              sectionId: sectionId,
            }),
          });
          if (!signRes.ok) throw new Error("Failed to get signed URL");

          const { uploadUrl, fileKey } =
            (await signRes.json()) as SignedUrlResponse;
          console.log("Upload URL:", uploadUrl);
          // 2) Upload to S3
          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          // 3) Notify your API that upload is complete
          // const completeRes = await fetch("/api/files/complete", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ fileKey, entityId }),
          // });
          // if (!completeRes.ok) throw new Error("Failed to complete upload");
        } catch (err) {
          console.error("Upload error:", err);
        }
      }

      setUploading(false);
    },
    [sectionId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #888",
        padding: "2rem",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here …</p>
      ) : (
        <p>Drag & drop some files, or click to select</p>
      )}
      {uploading && <p>Uploading… please wait</p>}
    </div>
  );
}
