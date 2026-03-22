import { NextRequest, NextResponse } from "next/server";

const DEMO_SERVICE = process.env.DEMO_SERVICE_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vertical, connection_string } = body;

    let url: string;
    let payload: Record<string, unknown>;

    if (vertical) {
      url     = `${DEMO_SERVICE}/session/sandbox/${vertical}`;
      payload = { vertical };  // demo-service requires vertical in body too
    } else if (connection_string) {
      url     = `${DEMO_SERVICE}/session/connect`;
      payload = { connection_string };
    } else {
      return NextResponse.json({ error: "Must provide vertical or connection_string" }, { status: 400 });
    }

    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    await fetch(`${DEMO_SERVICE}/session/${session_id}`, { method: "DELETE" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
