"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Session, AgentResult, ProgressStep } from "@/lib/types";
import { useSessionStore } from "@/lib/store";
import { ChatHeader }  from "./chat-header";
import { AiThread }    from "./ai-thread";
import { ProgressBar } from "./progress-bar";
import { cn } from "@/lib/cn";

export type Message = {
  id:       string;
  role:     "user" | "assistant";
  text:     string;
  result?:  AgentResult;
  pending?: boolean;
};

type PendingAction = {
  thread_id:   string;
  action_plan: AgentResult["action_plan"];
};

export function ChatShell({
  session,
  onActionCompleted,
}: {
  session: Session;
  onActionCompleted?: (actionType?: string) => void;
}) {
  const { userRole } = useSessionStore();

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [progress,      setProgress]      = useState<ProgressStep[]>([]);
  const [streaming,     setStreaming]      = useState(false);
  const [pendingAction, setPendingAction]  = useState<PendingAction | null>(null);

  const threadId         = useRef<string | null>(null);
  const abortRef         = useRef<AbortController | null>(null);
  const sendMessageRef   = useRef<(text: string) => void>(() => {});
  // Accumulates rows from demo-service "data" events (sent before "result")
  const pendingDataRef   = useRef<{ rows: Record<string, unknown>[]; rowCount: number } | null>(null);

  useEffect(() => {
    setMessages([{
      id:   "welcome",
      role: "assistant",
      text: `Hello! I'm your AI analyst for **${session.org_name}**. I can answer questions about your data, spot trends, and ${session.actions_enabled ? "take actions on your behalf" : "provide insights"}.`,
    }]);
  }, [session]);

  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      if (q) sendMessageRef.current(q);
    };
    window.addEventListener("demo:followup", handler);
    return () => window.removeEventListener("demo:followup", handler);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    const asstMsg: Message = { id: crypto.randomUUID(), role: "assistant", text: "", pending: true };
    setMessages((prev: Message[]) => [...prev, userMsg, asstMsg]);
    setProgress([]);
    setStreaming(true);
    setPendingAction(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/agent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          session_id: session.session_id,
          query:      text,
          user_role:  userRole,
          thread_id:  threadId.current,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.body) throw new Error("No stream");
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer          = "";
      let currentEvtType  = "";   // persists across chunk boundaries

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer      = lines.pop() ?? "";

        for (const line of lines) {
          // SSE event name line — store for the upcoming data line
          if (line.startsWith("event: ")) {
            currentEvtType = line.slice(7).trim();
            continue;
          }
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const payload = JSON.parse(raw) as Record<string, unknown>;
            // Merge event name into payload as "type" (demo-service uses SSE event field;
            // main agent-service puts "type" inside the JSON — support both)
            const evt = { type: currentEvtType || payload.type, ...payload };
            handleEvent(evt as Record<string, unknown>, asstMsg.id);
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        setMessages((prev: Message[]) =>
          prev.map((m) =>
            m.id === asstMsg.id
              ? { ...m, text: "Something went wrong. Please try again.", pending: false }
              : m
          )
        );
      }
    } finally {
      setStreaming(false);
      setMessages((prev: Message[]) =>
        prev.map((m) => {
          if (m.id !== asstMsg.id) return m;
          // If stream ended with no text and no result, show a fallback error
          if (!m.text && !m.result) {
            return { ...m, text: "The connection was interrupted. Please try again.", pending: false };
          }
          return { ...m, pending: false };
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, session, userRole]);

  sendMessageRef.current = sendMessage;

  function handleEvent(evt: Record<string, unknown>, asstId: string) {
    const type = evt.type as string;

    if (type === "thread") {
      threadId.current = (evt.thread_id as string) ?? threadId.current;
    }

    if (type === "progress") {
      const step = evt.step as ProgressStep;
      setProgress((prev: ProgressStep[]) => {
        const idx = prev.findIndex((p) => p.step === step.step);
        if (idx >= 0) { const next = [...prev]; next[idx] = step; return next; }
        return [...prev, step];
      });
    }

    // demo-service sends SQL rows in a separate "data" event before "result"
    if (type === "data") {
      pendingDataRef.current = {
        rows:     (evt.rows     as Record<string, unknown>[]) ?? [],
        rowCount: (evt.row_count as number) ?? 0,
      };
    }

    if (type === "result") {
      // Support both formats:
      //   • main agent-service: { result: AgentResult }  (nested)
      //   • demo-service:       { text, template_type, … } (top-level)
      const nested  = evt.result as AgentResult | undefined;
      const pending = pendingDataRef.current;
      pendingDataRef.current = null;

      const result: AgentResult = nested ?? {
        thread_id:        (evt.thread_id        as string)                      ?? threadId.current ?? "",
        text:             (evt.text              as string)                      ?? "",
        template_type:    (evt.template_type     as AgentResult["template_type"]) ?? "text",
        data:             pending?.rows           ?? (evt.data as Record<string, unknown>[]),
        row_count:        pending?.rowCount       ?? (evt.row_count as number),
        chart_type:       evt.chart_type          as AgentResult["chart_type"],
        display_metadata: evt.display_metadata    as AgentResult["display_metadata"],
        suggested_followups: evt.suggested_followups as string[],
        suggested_title:  evt.suggested_title     as string,
      };

      threadId.current = result.thread_id ?? threadId.current;
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text: result.text, result, pending: false } : m)
      );
      setProgress([]);
    }

    if (type === "confirmation_required") {
      const nested     = evt.result as AgentResult | undefined;
      const threadIdV  = (nested?.thread_id  ?? evt.thread_id)  as string;
      const actionPlan = (nested?.action_plan ?? evt.action_plan) as AgentResult["action_plan"];
      const text       = (nested?.text        ?? evt.text        ?? "") as string;

      threadId.current = threadIdV ?? threadId.current;
      if (threadIdV && actionPlan) {
        setPendingAction({ thread_id: threadIdV, action_plan: actionPlan });
      }
      const result: AgentResult = nested ?? {
        thread_id: threadIdV, text, template_type: "text", action_plan: actionPlan,
      };
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text, result, pending: false } : m)
      );
      setProgress([]);
    }

    if (type === "action_result") {
      const nested = evt.result as AgentResult | undefined;
      const result: AgentResult = nested ?? {
        thread_id:     threadId.current ?? "",
        text:          (evt.text ?? "Action completed.") as string,
        template_type: (evt.template_type as AgentResult["template_type"]) ?? "text",
      };
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text: result.text, result, pending: false } : m)
      );
      setPendingAction(null);
      setProgress([]);
      onActionCompleted?.(
        (evt.action_type ?? (result as AgentResult & { action_type?: string }).action_type) as string
      );
    }

    if (type === "error") {
      setMessages((prev: Message[]) =>
        prev.map((m) =>
          m.id === asstId
            ? { ...m, text: (evt.error ?? evt.message ?? "Error") as string, pending: false }
            : m
        )
      );
      setProgress([]);
    }
  }

  async function confirmAction(approved: boolean) {
    if (!pendingAction) return;
    try {
      const res  = await fetch("/api/action/confirm", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          session_id: session.session_id,
          thread_id:  pendingAction.thread_id,
          approved,
        }),
      });
      const data = await res.json() as AgentResult;
      const resultMsg: Message = {
        id:     crypto.randomUUID(),
        role:   "assistant",
        text:   data.text ?? (approved ? "Action completed." : "Action cancelled."),
        result: data,
      };
      setMessages((prev: Message[]) => [...prev, resultMsg]);
      if (approved) onActionCompleted?.();
    } catch { /* ignore */ }
    finally { setPendingAction(null); }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <ChatHeader session={session} />

      {/* Dataset context strip */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex-shrink-0">
        <span className="text-[11px] font-mono font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          {session.schema_name}
        </span>
        <span className="text-[11px] text-gray-400">
          {session.entity_count} entities
        </span>
        <span className={cn(
          "text-[11px] font-medium ml-auto",
          session.actions_enabled ? "text-green-600 dark:text-green-400" : "text-gray-400"
        )}>
          {session.actions_enabled
            ? `${session.available_actions.length} actions enabled`
            : "read-only"}
        </span>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {progress.some((p: ProgressStep) => p.visible) && (
          <ProgressBar steps={progress} />
        )}
        <AiThread
          messages={messages}
          streaming={streaming}
          pendingAction={pendingAction}
          suggestions={session.sample_queries}
          actions={session.available_actions}
          actionsEnabled={session.actions_enabled}
          onSend={sendMessage}
          onConfirm={confirmAction}
        />
      </main>
    </div>
  );
}
