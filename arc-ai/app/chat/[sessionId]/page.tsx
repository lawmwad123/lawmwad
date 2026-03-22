"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store";
import { ChatShell }   from "@/components/chat/chat-shell";
import { SystemPanel, type SystemPanelHandle } from "@/components/system/system-panel";
import { getViews }    from "@/lib/vertical-views";

export default function ChatPage() {
  const { sessionId }  = useParams<{ sessionId: string }>();
  const { session }    = useSessionStore();
  const router         = useRouter();
  const systemRef      = useRef<SystemPanelHandle>(null);

  useEffect(() => {
    if (!session || session.session_id !== sessionId) {
      router.replace("/demo");
    }
  }, [session, sessionId, router]);

  if (!session || session.session_id !== sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Redirecting…
      </div>
    );
  }

  const hasSystemViews = getViews(session.vertical).length > 0;

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-950">
      {/* Left: live data panel — takes all remaining space */}
      {hasSystemViews && (
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <SystemPanel ref={systemRef} session={session} />
        </div>
      )}

      {/* Right: AI assistant panel — fixed width, Supabase-style */}
      <div className={
        hasSystemViews
          ? "w-[440px] flex-shrink-0 flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-800"
          : "flex-1 flex flex-col overflow-hidden"
      }>
        <ChatShell
          session={session}
          onActionCompleted={(actionType) => {
            systemRef.current?.refresh(actionType);
          }}
        />
      </div>
    </div>
  );
}
