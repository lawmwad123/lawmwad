"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store";
import { ChatShell } from "@/components/chat/chat-shell";

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session }   = useSessionStore();
  const router        = useRouter();

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

  return <ChatShell session={session} />;
}
