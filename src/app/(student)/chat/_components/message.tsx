"use client";

import { File, FileImage, FileText, Loader2, Paperclip, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import type { Message } from "ai";
import { Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";
import { Markdown } from "./markdown";

interface AttachmentProps {
  attachment: {
    name?: string;
    url: string;
    type?: string;
  };
}

export const PreviewAttachment = ({ attachment }: AttachmentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine the attachment type
  const fileType =
    attachment.type || attachment.url.split(".").pop()?.toLowerCase();
  const isImage =
    fileType && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileType);
  const isPdf = fileType === "pdf";
  const isText = fileType && ["txt", "md", "json", "csv"].includes(fileType);

  // Format file name for display
  const fileName = attachment.name || attachment.url.split("/").pop() || "File";

  // Handle image loading events
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="group bg-card relative flex flex-col rounded-md border shadow-sm">
      {/* Image preview */}
      {isImage && (
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-t-md bg-black/5">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          )}

          <Image
            src={attachment.url}
            alt={fileName}
            className={cn(
              "h-full w-full object-cover transition-opacity",
              isLoading ? "opacity-0" : "opacity-100",
            )}
            width={128}
            height={128}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {error && (
            <div className="bg-muted absolute inset-0 flex items-center justify-center">
              <FileImage className="text-muted-foreground h-8 w-8" />
            </div>
          )}
        </div>
      )}

      {/* PDF or document preview */}
      {!isImage && (
        <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-t-md">
          {isPdf ? (
            <FileText className="text-muted-foreground h-10 w-10" />
          ) : isText ? (
            <FileText className="text-muted-foreground h-10 w-10" />
          ) : (
            <File className="text-muted-foreground h-10 w-10" />
          )}
        </div>
      )}

      {/* File info */}
      <div className="flex w-full items-center justify-between gap-1 p-2">
        <div className="truncate text-xs">{fileName}</div>

        {/* Download button */}
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          download={fileName}
          className="ml-auto"
        >
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Paperclip className="h-3 w-3" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export const PreviewMessage = ({ message }: { message: Message }) => {
  return (
    <motion.div
      className="group/message mx-auto w-full max-w-4xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
        )}
      >
        {message.role === "assistant" && (
          <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
            <Sparkles size={14} />
          </div>
        )}

        <div className="flex w-full flex-col gap-2">
          {message.parts && message.parts.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div className="flex flex-col gap-4" key={i}>
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  case "tool-invocation":
                    const { toolName, toolCallId, state, args } =
                      part.toolInvocation;
                    if (state === "result") {
                      const { result, args } = part.toolInvocation;
                      let res: any;
                      try {
                        res = JSON.parse(result);
                      } catch {
                        res = result;
                      }
                      let argsRes: any;
                      try {
                        argsRes = JSON.parse(args);
                      } catch {
                        argsRes = args;
                      }
                      part.toolInvocation.result = res;
                      part.toolInvocation.args = argsRes;

                      return (
                        <div key={toolCallId} className="overflow-auto">
                          <details>
                            <summary className="text-muted-foreground cursor-pointer">
                              View {toolName} Result
                            </summary>
                            <pre className="mt-2">
                              {JSON.stringify(part.toolInvocation, null, 2)}
                            </pre>
                          </details>
                        </div>
                      );
                    } else {
                      return (
                        <div key={toolCallId}>
                          <p className="text-muted-foreground animate-pulse">
                            Executing {toolName}...
                          </p>
                          <details>
                            <summary className="text-muted-foreground cursor-pointer">
                              View Tool Invocation Details
                            </summary>
                            <pre className="mt-2">
                              {JSON.stringify(part.toolInvocation, null, 2)}
                            </pre>
                          </details>
                        </div>
                      );
                    }
                }
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = "ai";

  return (
    <motion.div
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
          <Sparkles size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
