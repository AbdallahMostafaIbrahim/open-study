"use client";

import { motion } from "motion/react";

import { Markdown } from "./markdown";
import { cn } from "~/lib/utils";
import { Sparkles } from "lucide-react";
import type { Message } from "ai";

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

          {/* {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )} */}
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
