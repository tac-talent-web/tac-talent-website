import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiting: 5 requests/hour per IP
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return true;
}

const MS_CLIENT_ID = "d3590ed6-52b3-4102-aeff-aad2292ab01c";
const MS_TENANT_ID = "89649f3e-15a6-4479-b24b-878cf33df42a";

async function getGraphToken(): Promise<string> {
  const username = process.env.MS_USERNAME!;
  const password = process.env.MS_PASSWORD!;

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: MS_CLIENT_ID,
    username,
    password,
    scope: "https://graph.microsoft.com/.default",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`,
    { method: "POST", body }
  );
  const data = await res.json();
  if (!data.access_token) throw new Error(`MSAL token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sendEmailViaGraph(
  naam: string,
  email: string,
  telefoon: string,
  bericht: string,
  jobTitle: string
): Promise<void> {
  if (!process.env.MS_USERNAME || !process.env.MS_PASSWORD) {
    console.log("[TAC Apply] No MS_USERNAME/MS_PASSWORD — logging only:", { naam, email, jobTitle });
    return;
  }

  const toEmail = process.env.APPLY_EMAIL || "careers@thetalentacquisitioncompany.nl";

  const html = `
    <h2>Nieuwe sollicitatie: ${jobTitle}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;width:140px"><strong>Naam</strong></td><td style="padding:10px 14px;border:1px solid #ddd">${naam}</td></tr>
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5"><strong>E-mail</strong></td><td style="padding:10px 14px;border:1px solid #ddd"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5"><strong>Telefoon</strong></td><td style="padding:10px 14px;border:1px solid #ddd">${telefoon || "—"}</td></tr>
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5"><strong>Vacature</strong></td><td style="padding:10px 14px;border:1px solid #ddd">${jobTitle}</td></tr>
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5"><strong>Bericht</strong></td><td style="padding:10px 14px;border:1px solid #ddd">${bericht ? bericht.replace(/\n/g, "<br>") : "—"}</td></tr>
      <tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5"><strong>Tijdstip</strong></td><td style="padding:10px 14px;border:1px solid #ddd">${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</td></tr>
    </table>
  `;

  const token = await getGraphToken();

  const mailBody = {
    message: {
      subject: `Nieuwe sollicitatie: ${jobTitle} — ${naam}`,
      body: { contentType: "HTML", content: html },
      toRecipients: [{ emailAddress: { address: toEmail } }],
      replyTo: [{ emailAddress: { address: email } }],
    },
  };

  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailBody),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph sendMail error: ${err}`);
  }
}

export async function POST(request: NextRequest) {
  // CORS: only own domain
  const origin = request.headers.get("origin") ?? "";
  const allowed =
    origin.includes("tac-talent-website.vercel.app") ||
    origin.includes("localhost") ||
    origin === "";

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over een uur opnieuw." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  // Honeypot check
  if (body.website) {
    return NextResponse.json({ success: true, message: "Bedankt voor je sollicitatie!" });
  }

  const naam = (body.naam as string)?.trim();
  const email = (body.email as string)?.trim();
  const telefoon = (body.telefoon as string)?.trim() ?? "";
  const bericht = (body.bericht as string)?.trim() ?? "";
  const privacy = body.privacy;
  const jobTitle = (body.jobTitle as string)?.trim() ?? "Onbekende vacature";

  if (!naam) return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
  if (!email) return NextResponse.json({ error: "E-mailadres is verplicht." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }
  if (!privacy) {
    return NextResponse.json({ error: "Geef akkoord op het privacybeleid." }, { status: 400 });
  }
  if (bericht.length > 500) {
    return NextResponse.json({ error: "Bericht mag maximaal 500 tekens bevatten." }, { status: 400 });
  }

  console.log("[TAC Apply]", { naam, email, jobTitle, timestamp: new Date().toISOString() });

  try {
    await sendEmailViaGraph(naam, email, telefoon, bericht, jobTitle);
  } catch (err) {
    console.error("[TAC Apply] Email error (non-fatal):", err);
    // Non-fatal: we still return success so the user is not left confused
  }

  return NextResponse.json({
    success: true,
    message: "Bedankt! We nemen binnen 2 werkdagen contact op.",
  });
}
