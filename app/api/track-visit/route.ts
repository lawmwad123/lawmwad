import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

function getClientIp(request: Request): string {
  const forwarded = (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") || "unknown";

  try {
    const to = process.env.SMTP_USER || "";
    const host = request.headers.get("host") || "";
    await sendEmail({
      to,
      subject: `Visit on ${host}`,
      text: `A visitor just accessed ${host}.\nIP: ${ip}\nUA: ${ua}`,
    });
  } catch (err) {
    // swallow to not block page
  }

  return NextResponse.json({ ok: true });
}


