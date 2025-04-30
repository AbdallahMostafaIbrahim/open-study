"use client";

import type { CreateMessage, Message } from "@ai-sdk/react";
import { motion } from "motion/react";
import type React from "react";
import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { cn } from "~/lib/utils";
import { ArrowUp, Paperclip, StopCircle, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import type { ChatRequestOptions } from "ai";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";

// Mock material type - replace with your actual type
type Material = {
  id: string;
  title: string;
  type: string; // e.g., "pdf", "image", etc.
  url?: string;
};

const suggestedActions = [
  {
    title: "Can you explain differentiation",
    label: "in simple terms?",
    action: "Can you explain differentiation in simple terms?",
  },
  {
    title: "What is the derivative of x^2?",
    label: "in calculus",
    action: "What is the derivative of x^2?",
  },
];

// Mock materials for search - replace with your API call
const mockMaterials: Material[] = [
  { id: "1", title: "Calculus Basics", type: "pdf" },
  { id: "2", title: "Linear Algebra Notes", type: "pdf" },
  { id: "3", title: "Physics Formulas", type: "image" },
  { id: "4", title: "Chemistry Lab Report", type: "doc" },
  { id: "5", title: "Biology Diagrams", type: "image" },
];

export function ChatInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  handleSubmit,
  className,
  append,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (event?: React.FormEvent) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [attachments, setAttachments] = useState<Material[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaterials, setFilteredMaterials] =
    useState<Material[]>(mockMaterials);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  useEffect(() => {
    // Filter materials based on search query
    setFilteredMaterials(
      mockMaterials.filter((material) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const attachMaterial = (material: Material) => {
    if (!attachments.some((a) => a.id === material.id)) {
      setAttachments((prev) => [...prev, material]);
      toast.success(`Added "${material.title}" to your message`);
    } else {
      toast.info(`"${material.title}" is already attached`);
    }
    setIsCommandOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const submitForm = useCallback(() => {
    // Create enhanced message that includes attachments
    const attachmentsData = attachments.length
      ? `\n\n[Attachments: ${attachments.map((a) => a.title).join(", ")}]`
      : "";

    const messageWithAttachments = {
      role: "user" as const,
      content: input + attachmentsData,
      // In a real implementation, you might include attachment metadata differently
      // depending on how your backend handles it
      attachments: attachments,
    };

    // Use the append function with our enhanced message
    append(messageWithAttachments);

    // Reset attachments after sending
    setAttachments([]);
    setLocalStorageInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width, attachments, input, append]);

  return (
    <div className="relative flex w-full flex-col gap-4">
      {messages.length === 0 && (
        <div className="grid w-full gap-2 sm:grid-cols-2">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={`suggested-action-${suggestedAction.title}-${index}`}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <Button
                variant="ghost"
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedAction.action,
                  });
                }}
                className="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Display attached materials */}
      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <Badge
              key={attachment.id}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm"
            >
              {attachment.title}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInput}
          className={cn(
            "bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl pr-16 !text-base",
            className,
          )}
          rows={3}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error(
                  "Please wait for the model to finish its response!",
                );
              } else {
                submitForm();
              }
            }
          }}
        />

        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-14 bottom-1.5 h-fit rounded-full border p-1.5 dark:border-zinc-600"
          onClick={() => setIsCommandOpen(true)}
          disabled={isLoading}
          type="button"
        >
          <Paperclip size={14} />
        </Button>

        {/* Send/Stop button */}
        {isLoading ? (
          <Button
            className="absolute right-2 bottom-1.5 h-fit rounded-full border p-1.5 dark:border-zinc-600"
            onClick={(event) => {
              event.preventDefault();
              stop();
              setMessages((messages) => messages);
            }}
          >
            <StopCircle size={14} />
          </Button>
        ) : (
          <Button
            className="absolute right-2 bottom-1.5 h-fit rounded-full border p-1.5 dark:border-zinc-600"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0}
          >
            <ArrowUp size={14} />
          </Button>
        )}
      </div>

      {/* Command dialog for searching materials */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search for materials..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No materials found.</CommandEmpty>
            <CommandGroup heading="Materials">
              {filteredMaterials.map((material) => (
                <CommandItem
                  key={material.id}
                  onSelect={() => attachMaterial(material)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-muted-foreground bg-muted mr-2 rounded px-1.5 py-0.5 text-xs font-semibold uppercase">
                      {material.type}
                    </span>
                    {material.title}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
