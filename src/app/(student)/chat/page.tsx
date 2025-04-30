"use client";

import { useChat } from "@ai-sdk/react";
import { ChatInput } from "./_components/input";
import { PreviewMessage, ThinkingMessage } from "./_components/message";
import { Overview } from "./_components/overview";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Fragment } from "react";

export default function Chat() {
  const {
    messages,
    input,
    setMessages,
    setInput,
    handleSubmit,
    append,
    status,
    stop,
  } = useChat({
    maxSteps: 5,
  });

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <ScrollArea className="flex max-h-[calc(100vh-140px)] min-w-0 flex-1 flex-col gap-6 pt-4">
        {messages.length === 0 && <Overview />}

        {messages.map((message, index) => (
          <Fragment key={message.id}>
            <PreviewMessage key={message.id} message={message} />
            <div className="h-2"></div>
          </Fragment>
        ))}

        {status == "streaming" &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && <ThinkingMessage />}

        <div className="min-h-[24px] min-w-[24px] shrink-0" />
      </ScrollArea>

      <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-4xl md:pb-6">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={status === "streaming"}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </form>
    </div>
  );
}
