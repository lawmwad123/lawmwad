"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import type { Message } from "./chat-shell";
import type { AgentResult } from "@/lib/types";
import { ResultRenderer } from "../results/result-renderer";
import { ActionCard }     from "../actions/action-card";
import { cn }             from "@/lib/cn";

interface Props {
  messages:      Message[];
  streaming:     boolean;
  pendingAction: { thread_id: string; action_plan: AgentResult["action_plan"] } | null;
  onConfirmAction: (approved: boolean) => void;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/`(.*?)`/g,      "<code class=\"bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono\">$1</code>")
    .replace(/^- (.+)$/gm,    "<li class=\"ml-4 list-disc\">$1</li>")
    .replace(/\n/g,            "<br />");
}

export function MessageList({ messages, streaming, pendingAction, onConfirmAction }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          pendingAction={pendingAction}
          onConfirmAction={onConfirmAction}
        />
      ))}
      {streaming && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.pending && !messages[messages.length - 1]?.text && (
        <ThinkingDots />
      )}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  msg,
  pendingAction,
  onConfirmAction,
}: {
  msg:             Message;
  pendingAction:   Props["pendingAction"];
  onConfirmAction: Props["onConfirmAction"];
}) {
  const isUser = msg.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser
          ? "bg-brand-100 dark:bg-brand-950 text-brand-600"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={cn("max-w-[85%] flex flex-col gap-2", isUser && "items-end")}>
        {/* Text bubble */}
        {msg.text && (
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              isUser
                ? "bg-brand-600 text-white rounded-tr-sm"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
            )}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
          />
        )}

        {/* Pending dots */}
        {msg.pending && !msg.text && <ThinkingDots inline />}

        {/* Result card */}
        {msg.result && !msg.pending && (
          <div className="w-full max-w-3xl">
            <ResultRenderer result={msg.result} />
          </div>
        )}

        {/* Action confirmation card */}
        {msg.result?.template_type === "summary" && pendingAction && msg.result.action_plan && (
          <ActionCard
            plan={msg.result.action_plan}
            onApprove={() => onConfirmAction(true)}
            onReject={() => onConfirmAction(false)}
          />
        )}
      </div>
    </div>
  );
}

function ThinkingDots({ inline = false }: { inline?: boolean }) {
  return (
    <div className={cn(
      "flex gap-1.5 items-center",
      !inline && "px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm w-fit"
    )}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse-dot"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}
