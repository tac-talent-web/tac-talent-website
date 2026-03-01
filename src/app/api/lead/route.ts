import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "tac-salt-2026").digest("hex").substring(0, 16);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

async function getGraphToken(): Promise<string> {
  const tenantId = process.env.GRAPH_TENANT_ID!;
  const clientId = process.env.GRAPH_CLIENT_ID!;
  const username = process.env.GRAPH_USERNAME!;
  const password = process.env.GRAPH_PASSWORD!;

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    username,
    password,
    scope: "https://graph.microsoft.com/.default",
  });

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    body,
  });
  const data = await res.json();
  return data.access_token;
}

async function sendEmailNotification(lead: Record<string, string>, token: string): Promise<void> {
  const html = `
    <h2>Nieuwe lead via TAC website</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Naam</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.full_name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Telefoon</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.phone || "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Bedrijf</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.company || "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Interesse</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.interest || "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Bericht</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.message}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f5f5f5"><strong>Tijdstip</strong></td><td style="padding:8px;border:1px solid #ddd">${lead.receivedAt}</td></tr>
    </table>
  `;

  const emailBody = {
    message: {
      subject: `Nieuwe lead: ${lead.full_name} – TAC website`,
      body: { contentType: "HTML", content: html },
      toRecipients: [
        { emailAddress: { address: "anouar.aoulad@pro-rpo.nl" } },
        { emailAddress: { address: "lisa.clawton@pro-rpo.nl" } },
      ],
    },
  };

  await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailBody),
  });
}

async function appendToSheet(lead: Record<string, string>): Promise<void> {
  const sheetId = process.env.LEADS_SHEET_ID;
  if (!sheetId) return;

  // Append via Zapier MCP is async — voor nu loggen we naar console
  // Google Sheets direct schrijven vereist service account setup
  // Dit wordt via de Zapier webhook gedaan (zie env ZAPIER_LEADS_WEBHOOK)
  const webhookUrl = process.env.ZAPIER_LEADS_WEBHOOK;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  }
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

  // Honeypot
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const { full_name, email, message, company, phone, interest } = body as Record<string, string>;

  if (!full_name?.trim()) return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
  if (!email?.trim()) return NextResponse.json({ error: "E-mailadres is verplicht." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  if (!message?.trim()) return NextResponse.json({ error: "Bericht is verplicht." }, { status: 400 });

  const lead = {
    timestamp: new Date().toISOString(),
    source: "tac-talent.vercel.app",
    full_name: full_name.trim(),
    email: email.trim(),
    phone: phone?.trim() || "",
    company: company?.trim() || "",
    interest: interest?.trim() || "",
    message: message.trim(),
    ip_hash: hashIp(ip),
    receivedAt: new Date().toISOString(),
  };

  console.log("[TAC Lead]", JSON.stringify(lead));

  // Email notificatie via Graph API
  try {
    const token = await getGraphToken();
    await sendEmailNotification(lead, token);
    await appendToSheet(lead);
  } catch (err) {
    console.error("[TAC Lead] Email error:", err);
    // Niet falen — lead is ontvangen, email is best-effort
  }

  return NextResponse.json({ success: true });
}
