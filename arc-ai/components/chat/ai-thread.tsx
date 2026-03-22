"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect, useRef } from "react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  useMessage,
  ThreadPrimitive,
  ComposerPrimitive,
  type ExternalStoreAdapter,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { Bot, User, ArrowDown, Send, StopCircle, MessageSquare, Zap } from "lucide-react";
import type { Message } from "./chat-shell";
import type { AgentResult, ActionPlan, ProgressStep } from "@/lib/types";
import { ResultRenderer } from "@/components/results/result-renderer";
import { ActionCard }     from "@/components/actions/action-card";
import { RISK_COLORS }    from "@/lib/vertical-config";
import { cn }            from "@/lib/cn";

// ─── Action context ───────────────────────────────────────────────────────────

type PendingAction = { thread_id: string; action_plan: ActionPlan | undefined };

const ActionCtx = createContext<{
  pendingAction:  PendingAction | null;
  confirmAction:  (approved: boolean) => void;
}>({ pendingAction: null, confirmAction: () => {} });

// ─── Progress context (latest visible step status text) ───────────────────────

const StepCtx = createContext<string>("");

// ─── Convert our Message → ThreadMessageLike ──────────────────────────────────

function toThreadMessageLike(msg: Message): ThreadMessageLike {
  const base = {
    id:      msg.id,
    role:    msg.role as "user" | "assistant",
    content: msg.text || "",
    metadata: {
      custom: {
        result:    msg.result ?? null,
        isPending: msg.pending ?? false,
      },
    },
  };

  if (msg.role === "assistant") {
    return {
      ...base,
      status: msg.pending
        ? { type: "running" }
        : { type: "complete", reason: "stop" },
    };
  }

  return base;
}

// ─── Thinking indicator: pulsing dot + step text + blinking cursor ────────────

function ThinkingIndicator() {
  const step = useContext(StepCtx);
  return (
    <div className="flex items-center gap-2 py-1" aria-label="Thinking…">
      <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-dot flex-shrink-0" />
      {step ? (
        <span className="text-[12px] text-gray-400 dark:text-gray-500 leading-none">
          {step}
          <span className="ml-0.5 text-brand-400 dark:text-brand-500 animate-cursor-blink">▋</span>
        </span>
      ) : (
        <span className="text-brand-400 dark:text-brand-500 text-[13px] leading-none animate-cursor-blink">▋</span>
      )}
    </div>
  );
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(fullText: string, isRunning: boolean): string {
  // Initialise: if message already complete (e.g. history), show immediately
  const [displayed, setDisplayed] = useState(() => isRunning ? "" : fullText);
  const frameRef    = useRef<number>(0);
  const posRef      = useRef(isRunning ? 0 : fullText.length);
  const prevText    = useRef(isRunning ? "" : fullText);

  useEffect(() => {
    if (isRunning) {
      // Reset for the next incoming text
      cancelAnimationFrame(frameRef.current);
      setDisplayed("");
      posRef.current  = 0;
      prevText.current = "";
      return;
    }
    if (!fullText || fullText === prevText.current) return;
    prevText.current = fullText;
    posRef.current   = 0;

    const tick = () => {
      posRef.current = Math.min(posRef.current + 5, fullText.length);
      setDisplayed(fullText.slice(0, posRef.current));
      if (posRef.current < fullText.length) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [fullText, isRunning]);

  return displayed;
}

// ─── Inline markdown ──────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/`(.*?)`/g,       "<code class=\"bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[11px] font-mono\">$1</code>")
    .replace(/^- (.+)$/gm,     "<li class=\"ml-4 list-disc\">$1</li>")
    .replace(/\n/g,             "<br />");
}

// ─── User message ─────────────────────────────────────────────────────────────

function UserMessage() {
  const msg = useMessage();
  const text = msg.content
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  return (
    <div className="flex gap-2.5 flex-row-reverse">
      <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <User className="w-3 h-3" />
      </div>
      <div className="max-w-[82%] px-3.5 py-2 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-brand-600 text-white">
        {text}
      </div>
    </div>
  );
}

// ─── Assistant message ────────────────────────────────────────────────────────

function AssistantMessage() {
  const msg              = useMessage();
  const { pendingAction, confirmAction } = useContext(ActionCtx);

  const custom    = msg.metadata?.custom as { result: AgentResult | null; isPending: boolean } | undefined;
  const result    = custom?.result;
  const isRunning = msg.status?.type === "running";

  const fullText = msg.content
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  // Typewriter: animates text character-by-character when a response arrives
  const displayText = useTypewriter(fullText, isRunning);

  const showActionCard =
    !!result?.action_plan &&
    !!pendingAction &&
    result.action_plan === pendingAction.action_plan;

  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-3 h-3" />
      </div>

      <div className="flex-1 max-w-[88%] flex flex-col gap-2 min-w-0">
        {/* Thinking indicator while waiting for first token */}
        {isRunning && !fullText && (
          <div className="px-3.5 py-2 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-fit">
            <ThinkingIndicator />
          </div>
        )}

        {/* Typewriter text bubble */}
        {displayText && (
          <div
            className="px-3.5 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(displayText) }}
          />
        )}

        {result && !isRunning && (
          <div className="w-full">
            <ResultRenderer result={result} />
          </div>
        )}

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

// ─── Empty state (Supabase-style context panel) ────────────────────────────────

type ActionDef = {
  action_type:    string;
  display_name:   string;
  description:    string;
  risk_level:     string;
  example_prompts?: string[];
};

function EmptyState({
  suggestions,
  actions,
  actionsEnabled,
}: {
  suggestions:    string[];
  actions:        ActionDef[];
  actionsEnabled: boolean;
}) {
  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-2 overflow-y-auto">
      {/* Welcome heading */}
      <div className="mb-5">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-1">
          How can I assist you?
        </h2>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">
          Ask about your data or trigger one of the available actions.
        </p>
      </div>

      {/* Sample questions */}
      {suggestions.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
            Sample Questions
          </div>
          <div className="space-y-0.5">
            {suggestions.map((s, i) => (
              <ThreadPrimitive.Suggestion key={i} prompt={s} asChild send>
                <button className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-300 transition-colors group">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                  {s}
                </button>
              </ThreadPrimitive.Suggestion>
            ))}
          </div>
        </div>
      )}

      {/* Available actions */}
      {actionsEnabled && actions.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
            Available Actions
          </div>
          <div className="space-y-1.5">
            {actions.map((action) => (
              <ThreadPrimitive.Suggestion
                key={action.action_type}
                prompt={action.example_prompts?.[0] ?? action.display_name}
                asChild
              >
                <button className="w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-colors group">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-gray-800 dark:text-gray-200">
                      {action.display_name}
                    </div>
                    <div className="text-[11px] text-gray-400 leading-snug mt-0.5">
                      {action.description}
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5",
                    RISK_COLORS[action.risk_level]
                  )}>
                    {action.risk_level}
                  </span>
                </button>
              </ThreadPrimitive.Suggestion>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Composer ─────────────────────────────────────────────────────────────────

function Composer() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2.5">
      <ComposerPrimitive.Root className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-all">
        <ComposerPrimitive.Input
          placeholder="Ask anything about your data…"
          className="flex-1 bg-transparent text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none outline-none min-h-[22px] max-h-[120px] leading-relaxed py-0.5"
          rows={1}
        />

        <ComposerPrimitive.Cancel asChild>
          <button className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex-shrink-0">
            <StopCircle className="w-4 h-4" />
          </button>
        </ComposerPrimitive.Cancel>

        <ComposerPrimitive.Send asChild>
          <button className={cn(
            "p-1.5 rounded-lg transition-colors flex-shrink-0",
            "bg-brand-600 hover:bg-brand-700 text-white",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}>
            <Send className="w-3.5 h-3.5" />
          </button>
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface AiThreadProps {
  messages:       Message[];
  streaming:      boolean;
  pendingAction:  PendingAction | null;
  progress:       ProgressStep[];
  suggestions:    string[];
  actions:        ActionDef[];
  actionsEnabled: boolean;
  onSend:         (text: string) => void;
  onConfirm:      (approved: boolean) => void;
}

export function AiThread({
  messages,
  streaming,
  pendingAction,
  progress,
  suggestions,
  actions,
  actionsEnabled,
  onSend,
  onConfirm,
}: AiThreadProps) {
  const latestStep = progress.filter((p) => p.visible).at(-1)?.status ?? "";

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
    <StepCtx.Provider value={latestStep}>
    <ActionCtx.Provider value={{ pendingAction, confirmAction: onConfirm }}>
      <AssistantRuntimeProvider runtime={runtime}>
        <ThreadPrimitive.Root className="flex flex-col h-full">
          {/* Scrollable message area */}
          <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <ThreadPrimitive.Empty>
              <EmptyState
                suggestions={suggestions}
                actions={actions}
                actionsEnabled={actionsEnabled}
              />
            </ThreadPrimitive.Empty>

            <ThreadPrimitive.Messages
              components={{ UserMessage, AssistantMessage }}
            />

            <div className="h-2" />
          </ThreadPrimitive.Viewport>

          {/* Scroll-to-bottom */}
          <ThreadPrimitive.ScrollToBottom asChild>
            <button className="absolute bottom-20 right-4 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-10">
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </ThreadPrimitive.ScrollToBottom>

          {/* Input */}
          <ThreadPrimitive.ViewportFooter>
            <Composer />
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Root>
      </AssistantRuntimeProvider>
    </ActionCtx.Provider>
    </StepCtx.Provider>
  );
}
