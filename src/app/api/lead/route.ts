import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over 10 minuten opnieuw." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  // Honeypot check: if 'website' field is filled, silently ignore
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  // Validate required fields
  const { full_name, email, message } = body as {
    full_name?: string;
    email?: string;
    message?: string;
  };

  if (!full_name || typeof full_name !== "string" || !full_name.trim()) {
    return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "E-mailadres is verplicht." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Bericht is verplicht." }, { status: 400 });
  }

  const lead = {
    full_name: full_name.trim(),
    email: email.trim(),
    message: message.trim(),
    company: typeof body.company === "string" ? body.company.trim() : "",
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    receivedAt: new Date().toISOString(),
    ip,
  };

  // Log lead (Google Sheets integration later)
  console.log("[TAC Lead]", JSON.stringify(lead));

  return NextResponse.json({ success: true });
}
