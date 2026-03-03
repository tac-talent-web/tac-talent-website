import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'vacatures.json');

function readVacatures() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeVacatures(data: unknown[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Locatie mapping: kleine plaatsen → dichtstbijzijnde stad
function anonimiseerLocatie(locatie: string): string {
  if (!locatie) return 'Nederland';
  // Houd stad + provincie maar verwijder straatnamen etc.
  const parts = locatie.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return parts[0];
}

function cleanJobTitle(title: string): string {
  if (!title) return title;
  // Verwijder locatie-suffixes uit titels zoals "PLC engineer - Rotterdam"
  return title.replace(/\s*[-–]\s*[A-Z][a-zA-Z\s]+$/, '').trim();
}

export async function GET() {
  const vacatures = readVacatures();
  return NextResponse.json(vacatures, {
    headers: { 'Cache-Control': 'public, max-age=300' }
  });
}

export async function POST(req: NextRequest) {
  try {
    // Optioneel: webhook secret validatie
    const secret = req.headers.get('x-webhook-secret');
    if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Clay kan zowel een enkele vacature als een array sturen
    const items = Array.isArray(body) ? body : [body];

    const vacatures = readVacatures();
    let added = 0;

    for (const item of items) {
      // Genereer uniek ID op basis van URL of titel+locatie
      const id = item.url
        ? `vac-${Buffer.from(item.url).toString('base64').slice(0, 12)}`
        : `vac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      // Check op duplicaten
      const bestaat = vacatures.some((v: { id: string }) => v.id === id ||
        (v.id && item.url && v.id === `vac-${Buffer.from(item.url).toString('base64').slice(0, 12)}`));
      if (bestaat) continue;

      const vacature = {
        id,
        functietitel: cleanJobTitle(item.job_title || item.functietitel || ''),
        opdrachtgever: 'Onze opdrachtgever', // altijd anoniem
        locatie: anonimiseerLocatie(item.location || item.locatie || ''),
        salaris_min: item.salary_min ? Number(item.salary_min) : null,
        salaris_max: item.salary_max ? Number(item.salary_max) : null,
        dienstverband: item.employment_type || item.dienstverband || 'Full-time',
        seniority: item.seniority || null,
        beschrijving: item.description || item.beschrijving || '',
        geplaatst_op: item.posted_on || item.posted_at || new Date().toISOString().split('T')[0],
        // Nooit opslaan: company_name, job_linkedin_url, application_url, recruiter_url, url
      };

      vacatures.unshift(vacature); // nieuwste bovenaan
      added++;
    }

    writeVacatures(vacatures);

    return NextResponse.json({ success: true, added, total: vacatures.length });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
