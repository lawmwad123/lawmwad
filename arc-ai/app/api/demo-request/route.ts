import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, org, whatsapp, industry } = body;

  if (!name || !email || !org || !whatsapp || !industry) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO applications_v2 (name, email, phone, lab, level, about, source)
      VALUES (
        ${name.trim()},
        ${email.trim().toLowerCase()},
        ${whatsapp.trim()},
        ${industry.trim()},
        ${"demo-request"},
        ${org.trim()},
        ${"arc-ai"}
      )
    `;
    return NextResponse.json({ message: "Demo request submitted successfully" });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
