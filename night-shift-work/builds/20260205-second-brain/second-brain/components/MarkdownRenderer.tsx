"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="relative group">
                <div className="absolute right-2 top-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {match[1]}
                </div>
                <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          a({ href, children, ...props }: any) {
            return (
              <a 
                href={href} 
                className="text-indigo-400 hover:text-indigo-300 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-700">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }: any) {
            return (
              <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return (
              <td className="border border-gray-700 px-4 py-2">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
