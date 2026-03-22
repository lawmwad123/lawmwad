"use client";

/**
 * AiThread — assistant-ui powered chat panel.
 *
 * Uses useExternalStoreRuntime to bridge our existing streaming state into
 * assistant-ui's runtime model, then renders the thread with custom message
 * components that can display tables, charts, action cards, etc.
 */

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  useMessage,
  ThreadPrimitive,
  ComposerPrimitive,
  type ExternalStoreAdapter,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { Bot, User, ArrowDown, Send, StopCircle } from "lucide-react";
import type { Message } from "./chat-shell";
import type { AgentResult, ActionPlan } from "@/lib/types";
import { ResultRenderer } from "@/components/results/result-renderer";
import { ActionCard }     from "@/components/actions/action-card";
import { cn }            from "@/lib/cn";

// ─── Action context (avoids prop-drilling into useMessage components) ─────────

type PendingAction = { thread_id: string; action_plan: ActionPlan | undefined };

const ActionCtx = createContext<{
  pendingAction:  PendingAction | null;
  confirmAction:  (approved: boolean) => void;
}>({ pendingAction: null, confirmAction: () => {} });

// ─── Convert our Message → ThreadMessageLike ──────────────────────────────────

function toThreadMessageLike(msg: Message): ThreadMessageLike {
  return {
    id:        msg.id,
    role:      msg.role,
    content:   msg.text || (msg.pending ? "…" : ""),
    status:    msg.pending
      ? { type: "running" }
      : { type: "complete", reason: "stop" },
    metadata: {
      custom: {
        result:      msg.result ?? null,
        isPending:   msg.pending ?? false,
      },
    },
  };
}

// ─── Typing dots ──────────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex gap-1.5 items-center px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse-dot"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Inline markdown (simple, no extra deps) ─────────────────────────────────

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/`(.*?)`/g,       "<code class=\"bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[11px] font-mono\">$1</code>")
    .replace(/^- (.+)$/gm,     "<li class=\"ml-4 list-disc\">$1</li>")
    .replace(/\n/g,             "<br />");
}

// ─── Custom user message ──────────────────────────────────────────────────────

function UserMessage() {
  const msg = useMessage();
  const text = msg.content
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  return (
    <div className="flex gap-3 flex-row-reverse">
      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <User className="w-3.5 h-3.5" />
      </div>
      <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-brand-600 text-white">
        {text}
      </div>
    </div>
  );
}

// ─── Custom assistant message ─────────────────────────────────────────────────

function AssistantMessage() {
  const msg              = useMessage();
  const { pendingAction, confirmAction } = useContext(ActionCtx);

  const custom   = msg.metadata?.custom as { result: AgentResult | null; isPending: boolean } | undefined;
  const result   = custom?.result;
  const isRunning = msg.status?.type === "running";

  // Extract text from content parts
  const text = msg.content
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  // The action card renders if this message carries an action_plan AND it's still pending
  const showActionCard =
    !!result?.action_plan &&
    !!pendingAction &&
    result.action_plan === pendingAction.action_plan;

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1 max-w-[88%] flex flex-col gap-2 min-w-0">
        {/* Text bubble */}
        {isRunning && !text ? (
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-fit">
            <ThinkingDots />
          </div>
        ) : text ? (
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        ) : null}

        {/* Result card */}
        {result && !isRunning && (
          <div className="w-full">
            <ResultRenderer result={result} />
          </div>
        )}

        {/* Action confirmation card */}
        {showActionCard && (
          <ActionCard
            plan={pendingAction!.action_plan!}
            onApprove={() => confirmAction(true)}
            onReject={() => confirmAction(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Composer area ────────────────────────────────────────────────────────────

function Composer({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      <ComposerPrimitive.Root className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2 focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-all">
        <ComposerPrimitive.Input
          placeholder="Ask anything about your data…"
          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none outline-none min-h-[24px] max-h-[120px] leading-relaxed py-1"
          rows={1}
        />

        {/* Cancel while running */}
        <ComposerPrimitive.Cancel asChild>
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
            <StopCircle className="w-4 h-4" />
          </button>
        </ComposerPrimitive.Cancel>

        {/* Send */}
        <ComposerPrimitive.Send asChild>
          <button className={cn(
            "p-1.5 rounded-lg transition-colors",
            "bg-brand-600 hover:bg-brand-700 text-white",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}>
            <Send className="w-4 h-4" />
          </button>
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>

      {/* Suggestion chips — only show when thread is empty */}
      {suggestions.length > 0 && (
        <ThreadPrimitive.Empty>
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.slice(0, 4).map((s, i) => (
              <ThreadPrimitive.Suggestion key={i} prompt={s} asChild send>
                <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-gray-900">
                  {s}
                </button>
              </ThreadPrimitive.Suggestion>
            ))}
          </div>
        </ThreadPrimitive.Empty>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface AiThreadProps {
  messages:       Message[];
  streaming:      boolean;
  pendingAction:  PendingAction | null;
  suggestions:    string[];
  onSend:         (text: string) => void;
  onConfirm:      (approved: boolean) => void;
}

export function AiThread({
  messages,
  streaming,
  pendingAction,
  suggestions,
  onSend,
  onConfirm,
}: AiThreadProps) {

  const onNew = useCallback(async (msg: { content: ReadonlyArray<{ type: string; text?: string }> }) => {
    const text = msg.content
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
    if (text.trim()) onSend(text.trim());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, [onSend]) as (msg: any) => Promise<void>;

  const adapter = useMemo<ExternalStoreAdapter<Message>>(() => ({
    messages,
    isRunning:      streaming,
    convertMessage: toThreadMessageLike,
    onNew,
  }), [messages, streaming, onNew]);

  const runtime = useExternalStoreRuntime(adapter);

  return (
    <ActionCtx.Provider value={{ pendingAction, confirmAction: onConfirm }}>
      <AssistantRuntimeProvider runtime={runtime}>
        <ThreadPrimitive.Root className="flex flex-col h-full">
          {/* Scrollable message area */}
          <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-6">
            <ThreadPrimitive.Empty>
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-6 py-12">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Ask a question about your data, or try one of the suggestions below.
                </p>
              </div>
            </ThreadPrimitive.Empty>

            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                AssistantMessage,
              }}
            />

            {/* Breathing room at the bottom */}
            <div className="h-4" />
          </ThreadPrimitive.Viewport>

          {/* Scroll-to-bottom button */}
          <ThreadPrimitive.ScrollToBottom asChild>
            <button className="absolute bottom-24 right-6 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-10">
              <ArrowDown className="w-4 h-4" />
            </button>
          </ThreadPrimitive.ScrollToBottom>

          {/* Input area */}
          <ThreadPrimitive.ViewportFooter>
            <Composer suggestions={suggestions} />
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Root>
      </AssistantRuntimeProvider>
    </ActionCtx.Provider>
  );
}
