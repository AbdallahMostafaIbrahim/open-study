"use client";

import type { CreateMessage, Message } from "@ai-sdk/react";
import type { ChatRequestOptions } from "ai";
import { ArrowUp, Paperclip, StopCircle, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Textarea } from "~/components/ui/textarea";
import { S3_URL } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

// Types
type MaterialFile = RouterOutputs["student"]["chat"]["getMaterial"][0];

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: React.Dispatch<React.SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}

// Suggested actions data
const SUGGESTED_ACTIONS = [
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

/**
 * SuggestedActions Component
 */
function SuggestedActions({ append }: { append: ChatInputProps["append"] }) {
  return (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {SUGGESTED_ACTIONS.map((action, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={() => append({ role: "user", content: action.action })}
            className="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
          >
            <span className="font-medium">{action.title}</span>
            <span className="text-muted-foreground">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * AttachmentBadges Component
 */
function AttachmentBadges({
  attachments,
  onRemove,
}: {
  attachments: MaterialFile[];
  onRemove: (id: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <Badge
          key={attachment.link}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1.5 text-sm"
        >
          {attachment.name}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0"
            onClick={() => onRemove(attachment.link)}
          >
            <X size={12} />
          </Button>
        </Badge>
      ))}
    </div>
  );
}

/**
 * MaterialSelector Component
 */
function MaterialSelector({
  isOpen,
  onOpenChange,
  materials,
  onSelect,
  existingAttachments,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  materials: MaterialFile[];
  onSelect: (material: MaterialFile) => void;
  existingAttachments: MaterialFile[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState(materials);

  // Update filtered materials when search query or materials change
  useEffect(() => {
    setFilteredMaterials(
      materials
        .filter((material) =>
          material.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .filter(
          (material) =>
            !existingAttachments.some((a) => a.link === material.link),
        ),
    );
  }, [searchQuery, materials, existingAttachments]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
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
                key={material.link}
                onSelect={() => onSelect(material)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-muted-foreground bg-muted mr-2 rounded px-1.5 py-0.5 text-xs font-semibold uppercase">
                    {material.type === "application/pdf" ? "PDF" : "File"}
                  </span>
                  {material.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

/**
 * Main ChatInput Component
 */
export function ChatInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: ChatInputProps) {
  // Refs and state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachments, setAttachments] = useState<MaterialFile[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "chat-input",
    "",
  );

  // Fetch available materials
  const { data: materials = [] } = api.student.chat.getMaterial.useQuery();

  // Automatically adjust textarea height
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, []);

  // Initialize input from localStorage on mount
  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      setInput(domValue || localStorageInput || "");
      adjustHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update localStorage when input changes
  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  // Handle input changes and adjust height
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  // Material attachment handlers
  const handleAttachMaterial = (material: MaterialFile) => {
    if (!attachments.some((a) => a.link === material.link)) {
      setAttachments((prev) => [...prev, material]);
      toast.success(`Added "${material.name}" to your message`);
    } else {
      toast.info(`"${material.name}" is already attached`);
    }
    setIsCommandOpen(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.link !== id));
  };

  // Submit message with attachments
  const submitMessage = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();

    if (isLoading) {
      toast.error("Please wait for the model to finish its response!");
      return;
    }

    if (input.length === 0) return;

    handleSubmit(event, {
      experimental_attachments: attachments.map((a) => ({
        name: a.name || "",
        url: S3_URL + a.link,
        contentType: "application/pdf",
      })),
    });

    setAttachments([]);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage(event);
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-4">
      {/* Show suggested actions when chat is empty */}
      {messages.length === 0 && <SuggestedActions append={append} />}

      {/* Display attached materials */}
      <AttachmentBadges
        attachments={attachments}
        onRemove={handleRemoveAttachment}
      />

      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl pr-16 !text-base",
            className,
          )}
          rows={3}
          autoFocus
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
            onClick={() => {
              stop();
              setMessages((messages) => messages);
            }}
          >
            <StopCircle size={14} />
          </Button>
        ) : (
          <Button
            className="absolute right-2 bottom-1.5 h-fit rounded-full border p-1.5 dark:border-zinc-600"
            onClick={submitMessage}
            disabled={input.length === 0}
          >
            <ArrowUp size={14} />
          </Button>
        )}
      </div>

      {/* Material selector dialog */}
      <MaterialSelector
        isOpen={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        materials={materials}
        onSelect={handleAttachMaterial}
        existingAttachments={attachments}
      />
    </div>
  );
}
