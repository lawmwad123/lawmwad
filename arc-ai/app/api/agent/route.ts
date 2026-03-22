import { NextRequest } from "next/server";

const DEMO_SERVICE = process.env.DEMO_SERVICE_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id, query, user_role, thread_id } = body;

  const upstream = await fetch(`${DEMO_SERVICE}/query/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, query, user_role, thread_id }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "Upstream error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Pass through the SSE stream directly
  return new Response(upstream.body, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
