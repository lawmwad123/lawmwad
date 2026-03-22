import { NextResponse } from "next/server";

const DEMO_SERVICE = process.env.DEMO_SERVICE_URL || "http://localhost:8001";

export async function GET() {
  try {
    const res  = await fetch(`${DEMO_SERVICE}/verticals`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
