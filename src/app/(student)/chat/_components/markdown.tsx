"use client";
import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components: Partial<Components> = {
    // @ts-expect-error
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        // @ts-expect-error
        <SyntaxHighlighter
          {...props}
          style={nightOwl}
          language={match[1]}
          PreTag="div"
          className="mt-2 w-full overflow-x-auto rounded-xl text-sm"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`${className} rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }) => {
      return (
        <ol className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }) => {
      return (
        <ul className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }) => {
      return (
        <a
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    h1: ({ node, children, ...props }) => {
      return (
        <h1 className="mt-6 mb-2 text-3xl font-semibold" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      return (
        <h2 className="mt-6 mb-2 text-2xl font-semibold" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      return (
        <h3 className="mt-6 mb-2 text-xl font-semibold" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      return (
        <h4 className="mt-6 mb-2 text-lg font-semibold" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }) => {
      return (
        <h5 className="mt-6 mb-2 text-base font-semibold" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }) => {
      return (
        <h6 className="mt-6 mb-2 text-sm font-semibold" {...props}>
          {children}
        </h6>
      );
    },
    table: ({ node, children, ...props }) => {
      return (
        <div className="pointer-events-none relative left-[50%]! flex w-[1000px] translate-x-[-50%] justify-center *:pointer-events-auto">
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="min-w-full border-collapse text-sm" {...props}>
              {children}
            </table>
          </div>
        </div>
      );
    },
    th: ({ node, children, ...props }) => {
      return (
        <th
          className="border-b bg-transparent p-3 text-left font-medium dark:border-neutral-700"
          {...props}
        >
          {children}
        </th>
      );
    },
    td: ({ node, children, ...props }) => {
      return (
        <td className="border-b p-3 dark:border-neutral-800" {...props}>
          {children}
        </td>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
