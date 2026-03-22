"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Session, AgentResult, ProgressStep } from "@/lib/types";
import { useSessionStore, useUIStore } from "@/lib/store";
import { ChatHeader }  from "./chat-header";
import { ChatSidebar } from "./chat-sidebar";
import { AiThread }    from "./ai-thread";
import { ProgressBar } from "./progress-bar";

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
  const { userRole }   = useSessionStore();
  const { sidebarOpen } = useUIStore();

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [progress,      setProgress]      = useState<ProgressStep[]>([]);
  const [streaming,     setStreaming]      = useState(false);
  const [pendingAction, setPendingAction]  = useState<PendingAction | null>(null);

  const threadId         = useRef<string | null>(null);
  const abortRef         = useRef<AbortController | null>(null);
  const sendMessageRef   = useRef<(text: string) => void>(() => {});

  // Welcome message on mount
  useEffect(() => {
    const welcomeQueries = session.sample_queries.slice(0, 3);
    setMessages([{
      id:   "welcome",
      role: "assistant",
      text: `Hello! I'm your AI analyst for **${session.org_name}**. I can answer questions about your data, spot trends, and ${session.actions_enabled ? "take actions on your behalf" : "provide insights"}.\n\nTry asking me something like:\n${welcomeQueries.map((q: string) => `- *${q}*`).join("\n")}`,
    }]);
  }, [session]);

  // Stable event listener for suggested followups (uses ref to avoid ordering issues)
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
      let buffer    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer      = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const evt = JSON.parse(raw) as Record<string, unknown>;
            handleEvent(evt, asstMsg.id);
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
        prev.map((m) => (m.id === asstMsg.id ? { ...m, pending: false } : m))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, session, userRole]);

  // Keep ref up-to-date so the event listener always calls the latest version
  sendMessageRef.current = sendMessage;

  function handleEvent(evt: Record<string, unknown>, asstId: string) {
    const type = evt.type as string;

    if (type === "thread") {
      threadId.current = evt.thread_id as string;
    }

    if (type === "progress") {
      const step = evt.step as ProgressStep;
      setProgress((prev: ProgressStep[]) => {
        const idx = prev.findIndex((p) => p.step === step.step);
        if (idx >= 0) { const next = [...prev]; next[idx] = step; return next; }
        return [...prev, step];
      });
    }

    if (type === "result") {
      const result = evt.result as AgentResult;
      threadId.current = result.thread_id ?? threadId.current;
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text: result.text, result, pending: false } : m)
      );
      setProgress([]);
    }

    if (type === "confirmation_required") {
      const result = evt.result as AgentResult;
      threadId.current = result.thread_id ?? threadId.current;
      if (result.thread_id && result.action_plan) {
        setPendingAction({ thread_id: result.thread_id, action_plan: result.action_plan });
      }
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text: result.text, result, pending: false } : m)
      );
      setProgress([]);
    }

    if (type === "action_result") {
      const result = evt.result as AgentResult;
      setMessages((prev: Message[]) =>
        prev.map((m) => m.id === asstId ? { ...m, text: result.text, result, pending: false } : m)
      );
      setPendingAction(null);
      setProgress([]);
      onActionCompleted?.((result as AgentResult & { action_type?: string }).action_type);
    }

    if (type === "error") {
      setMessages((prev: Message[]) =>
        prev.map((m) =>
          m.id === asstId ? { ...m, text: (evt.message as string) ?? "Error", pending: false } : m
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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <ChatHeader session={session} />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <ChatSidebar session={session} onQueryClick={sendMessage} />
        )}

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {progress.some((p: ProgressStep) => p.visible) && (
            <ProgressBar steps={progress} />
          )}
          <AiThread
            messages={messages}
            streaming={streaming}
            pendingAction={pendingAction}
            suggestions={session.sample_queries}
            onSend={sendMessage}
            onConfirm={confirmAction}
          />
        </main>
      </div>
    </div>
  );
}
