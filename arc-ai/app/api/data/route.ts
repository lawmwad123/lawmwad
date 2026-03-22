import { NextRequest, NextResponse } from "next/server";

const DEMO_SERVICE = process.env.DEMO_SERVICE_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  const { session_id, sql, limit } = await req.json();

  if (!session_id || !sql) {
    return NextResponse.json({ error: "Missing session_id or sql" }, { status: 400 });
  }

  const res = await fetch(`${DEMO_SERVICE}/session/${session_id}/rows`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ sql, limit: limit ?? 100 }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });
  return NextResponse.json(data);
}
