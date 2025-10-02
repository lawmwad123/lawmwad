import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpTls = (process.env.SMTP_TLS || "true").toLowerCase() === "true";

if (!smtpHost || !smtpUser || !smtpPassword) {
  // Avoid throwing at import time in serverless; we'll throw when sending
  // console.warn("SMTP configuration is incomplete.");
}

export async function sendEmail(options: { to: string; subject: string; text?: string; html?: string; from?: string; }) {
  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // TLS on port 465
    auth: { user: smtpUser, pass: smtpPassword },
    tls: smtpTls ? { ciphers: "SSLv3" } : undefined,
  } as any);

  const from = options.from || `${smtpUser}`;

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}


