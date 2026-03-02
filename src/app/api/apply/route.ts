import { NextRequest, NextResponse } from "next/server";

const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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

async function sendEmailViaZapierMCP(
  naam: string,
  email: string,
  telefoon: string,
  bericht: string,
  jobTitle: string
): Promise<void> {
  const zapierToken = process.env.ZAPIER_MCP_TOKEN;
  if (!zapierToken) {
    console.log("[TAC Apply] No ZAPIER_MCP_TOKEN — logging only:", { naam, email, jobTitle });
    return;
  }

  const toEmail = process.env.APPLY_EMAIL || "anouar.aoulad@pro-rpo.nl";
  const tijdstip = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" });

  const emailBody = `Nieuwe sollicitatie via TAC jobboard.\n\nVacature: ${jobTitle}\nNaam: ${naam}\nE-mail: ${email}\nTelefoon: ${telefoon || "niet opgegeven"}\nMotivatie: ${bericht || "niet opgegeven"}\nTijdstip: ${tijdstip}`;
  const subject = `Nieuwe sollicitatie: ${jobTitle} van ${naam}`;
  const instruction = `Send an email to ${toEmail} with subject "${subject}" and body: ${emailBody}`;

  const res = await fetch(
    `https://mcp.zapier.com/api/mcp/s/${zapierToken}/mcp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "tools/call",
        params: {
          name: "email_by_zapier_send_outbound_email",
          arguments: { instructions: instruction, output_hint: "email sent confirmation" }
        }
      }),
    }
  );

  if (!res.ok) throw new Error(`Zapier MCP HTTP error: ${res.status}`);

  // Zapier MCP returns SSE — extract the data line
  const rawText = await res.text();
  const dataLine = rawText.split("\n").find((l) => l.startsWith("data: {"));
  if (!dataLine) throw new Error(`Zapier MCP: no data line in response`);

  const parsed = JSON.parse(dataLine.replace(/^data: /, ""));
  const status = parsed?.result?.content?.[0]?.text
    ? JSON.parse(parsed.result.content[0].text)?.execution?.status
    : "UNKNOWN";

  console.log("[TAC Apply] Zapier email status:", status);
  if (status !== "SUCCESS") throw new Error(`Zapier email not sent, status: ${status}`);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const allowed =
    origin.includes("tac-talent-website.vercel.app") ||
    origin.includes("thetalentacquisitioncompany") ||
    origin.includes("localhost") ||
    origin === "";
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ip = getClientIp(request);
  if (!checkRateLimit(ip))
    return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een uur opnieuw." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 }); }

  if (body.website) return NextResponse.json({ success: true });

  const naam = (body.naam as string)?.trim();
  const email = (body.email as string)?.trim();
  const telefoon = (body.telefoon as string)?.trim() ?? "";
  const bericht = (body.bericht as string)?.trim() ?? "";
  const privacy = body.privacy;
  const jobTitle = (body.jobTitle as string)?.trim() ?? "Onbekende vacature";

  if (!naam) return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
  if (!email) return NextResponse.json({ error: "E-mailadres is verplicht." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  if (!privacy)
    return NextResponse.json({ error: "Geef akkoord op het privacybeleid." }, { status: 400 });
  if (bericht.length > 500)
    return NextResponse.json({ error: "Bericht mag maximaal 500 tekens bevatten." }, { status: 400 });

  console.log("[TAC Apply]", { naam, email, jobTitle, timestamp: new Date().toISOString() });

  try { await sendEmailViaZapierMCP(naam, email, telefoon, bericht, jobTitle); }
  catch (err) { console.error("[TAC Apply] Email error (non-fatal):", err); }

  return NextResponse.json({ success: true, message: "Bedankt! We nemen binnen 2 werkdagen contact op." });
}
