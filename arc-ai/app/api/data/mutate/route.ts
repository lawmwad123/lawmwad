import { NextRequest, NextResponse } from "next/server";

const DEMO_SERVICE = process.env.DEMO_SERVICE_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;
  const { session_id, ...rest } = body;

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const res = await fetch(`${DEMO_SERVICE}/session/${session_id}/mutate`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(rest),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  return NextResponse.json(data);
}
