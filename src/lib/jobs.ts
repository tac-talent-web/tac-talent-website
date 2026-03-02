export interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  category: string;
  description: string;
  requirements: string[];
  applyEmail: string;
  postedAt: string;
  validThrough: string;
  salary?: string;
  remote: boolean;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const FALLBACK_JOBS: Job[] = [
  {
    id: 'servicemonteur-automotive-eindhoven',
    slug: 'servicemonteur-automotive-eindhoven',
    title: 'Servicemonteur Automotive',
    location: 'Eindhoven',
    employmentType: 'FULL_TIME',
    category: 'Automotive',
    description: `Ben jij een ervaren Servicemonteur Automotive met passie voor techniek? Voor een toonaangevende automotive dealer in Eindhoven zoeken wij een gemotiveerde monteur.

Als Servicemonteur ben jij verantwoordelijk voor het diagnosticeren en repareren van voertuigen. Je werkt met de nieuwste diagnostische apparatuur en houdt je kennis up-to-date met regelmatige trainingen.

**Wat ga je doen?**
- Uitvoeren van onderhoud en reparaties aan personenwagens
- Diagnosticeren van technische storingen via diagnostische software
- Adviseren van klanten over technische bevindingen
- Bijhouden van werkrapporten en onderhoudshistorie`,
    requirements: ['MBO diploma Autotechniek of vergelijkbaar', 'Minimaal 2 jaar werkervaring als monteur', 'Rijbewijs B', 'Goede communicatieve vaardigheden'],
    applyEmail: 'careers@thetalentacquisitioncompany.nl',
    postedAt: '2026-02-15',
    validThrough: '2026-05-15',
    salary: '€2.800 – €3.600 per maand',
    remote: false,
  },
  {
    id: 'cnc-operator-tilburg',
    slug: 'cnc-operator-tilburg',
    title: 'CNC Operator',
    location: 'Tilburg',
    employmentType: 'FULL_TIME',
    category: 'Productie',
    description: `Voor een moderne metaalverwerkende productiebedrijf in Tilburg zijn wij op zoek naar een CNC Operator die zelfstandig CNC-machines kan bedienen en instellen.

**Wat ga je doen?**
- Instellen en bedienen van CNC freesmachines en draaibanken
- Kwaliteitscontrole uitvoeren op bewerkte producten
- Bewerken van tekeningen en werkopdrachten interpreteren
- Bijdragen aan continue verbetering van productieprocessen`,
    requirements: ['MBO opleiding Werktuigbouwkunde of Verspaning', 'Ervaring met CNC-besturingssystemen (Fanuc, Siemens)', 'Kwaliteitsbewust en nauwkeurig', 'Teamspeler met zelfstandige werkhouding'],
    applyEmail: 'careers@thetalentacquisitioncompany.nl',
    postedAt: '2026-02-20',
    validThrough: '2026-05-20',
    salary: '€2.600 – €3.200 per maand',
    remote: false,
  },
  {
    id: 'technisch-projectleider-amsterdam',
    slug: 'technisch-projectleider-amsterdam',
    title: 'Technisch Projectleider',
    location: 'Amsterdam',
    employmentType: 'FULL_TIME',
    category: 'Techniek',
    description: `Ben jij een ervaren Technisch Projectleider met een achtergrond in engineering? Voor een innovatief technisch bedrijf in Amsterdam zoeken wij een gedreven professional.

**Wat ga je doen?**
- Leiden van technische projecten van initiatiefase tot oplevering
- Aansturing van multidisciplinaire projectteams
- Bewaken van planning, budget en kwaliteit
- Schakelen met opdrachtgevers, onderaannemers en leveranciers
- Technische risico's identificeren en mitigeren`,
    requirements: ['HBO/WO opleiding Techniek of Projectmanagement', 'Minimaal 5 jaar ervaring als technisch projectleider', 'Uitstekende communicatieve vaardigheden in NL en EN', 'Kennis van projectmethodieken (PRINCE2, PMI of agile)'],
    applyEmail: 'careers@thetalentacquisitioncompany.nl',
    postedAt: '2026-02-18',
    validThrough: '2026-05-18',
    salary: '€4.500 – €6.000 per maand',
    remote: false,
  },
  {
    id: 'warehouse-medewerker-rotterdam',
    slug: 'warehouse-medewerker-rotterdam',
    title: 'Warehouse Medewerker',
    location: 'Rotterdam',
    employmentType: 'PART_TIME',
    category: 'Logistiek',
    description: `Voor een groot logistiek centrum in de Rotterdamse haven zijn wij op zoek naar een Warehouse Medewerker voor parttime werkzaamheden.

**Wat ga je doen?**
- Ontvangen, controleren en opslaan van inkomende goederen
- Verzamelen en inpakken van orders (orderpicken)
- Verwerken van retouren
- Werken met een WMS (Warehouse Management Systeem)`,
    requirements: ['Minimaal VMBO werk- en denkniveau', 'Beschikbaar voor 24-32 uur per week', 'Fysiek fit en belastbaar', 'Ervaring in een magazijn is een pre'],
    applyEmail: 'careers@thetalentacquisitioncompany.nl',
    postedAt: '2026-03-01',
    validThrough: '2026-06-01',
    salary: '€13,50 – €15,00 per uur',
    remote: false,
  },
  {
    id: 'installateur-elektrotechniek-utrecht',
    slug: 'installateur-elektrotechniek-utrecht',
    title: 'Installateur Elektrotechniek',
    location: 'Utrecht',
    employmentType: 'FULL_TIME',
    category: 'Techniek',
    description: `Voor een groeiend installatiebedrijf in de regio Utrecht zijn wij op zoek naar een Installateur Elektrotechniek die zelfstandig elektrotechnische installaties kan aanleggen en onderhouden.

**Wat ga je doen?**
- Aanleggen van elektrotechnische installaties in utiliteits- en woningbouw
- Onderhoud en storingsdienst uitvoeren
- Lezen en interpreteren van elektrische schema's
- Rapporteren over uitgevoerde werkzaamheden`,
    requirements: ['MBO diploma Elektrotechniek (niveau 3 of 4)', 'Minimaal 2 jaar werkervaring', 'NEN 3140 certificering is een pré', 'Rijbewijs B verplicht'],
    applyEmail: 'careers@thetalentacquisitioncompany.nl',
    postedAt: '2026-02-25',
    validThrough: '2026-05-25',
    salary: '€2.900 – €3.700 per maand',
    remote: false,
  },
];

// RFC 4180-compliant CSV parser — handles quoted fields, embedded commas, and embedded newlines
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          // Escaped double-quote inside quoted field
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\r' && text[i + 1] === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i += 2;
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Flush last row
  if (row.length > 0 || field !== '') {
    row.push(field);
    if (row.some((f) => f !== '')) rows.push(row);
  }

  return rows;
}

function parseSheetRow(row: string[], index: number): Job | null {
  if (!row[0]?.trim()) return null;

  const title = row[0]?.trim() || '';
  const location = row[1]?.trim() || '';
  const contractRaw = (row[2]?.trim() || 'FULL_TIME').toUpperCase();
  const employmentType = (['FULL_TIME', 'PART_TIME', 'CONTRACT'].includes(contractRaw)
    ? contractRaw
    : 'FULL_TIME') as Job['employmentType'];
  const category = row[3]?.trim() || 'Overig';
  const description = row[4]?.trim() || '';
  const requirementsRaw = row[5]?.trim() || '';
  const requirements = requirementsRaw ? requirementsRaw.split(',').map((r) => r.trim()).filter(Boolean) : [];
  const salary = row[6]?.trim() || undefined;
  const remoteRaw = (row[7]?.trim() || '').toLowerCase();
  const remote = remoteRaw === 'ja' || remoteRaw === 'yes' || remoteRaw === 'true';
  const postedAt = row[8]?.trim() || new Date().toISOString().split('T')[0];
  const validThrough = row[9]?.trim() || '';

  const slug = toSlug(`${title}-${location}`);

  return {
    id: slug || `job-${index}`,
    slug: slug || `job-${index}`,
    title,
    location,
    employmentType,
    category,
    description,
    requirements,
    applyEmail: process.env.APPLY_EMAIL || 'careers@thetalentacquisitioncompany.nl',
    postedAt,
    validThrough,
    salary,
    remote,
  };
}

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxuHOkrjcquUq6o4hyuco_qi8XY6l-_GQ3BV7wnhsZJRO4Pd5IuUkMU8h8usg_5dmCOoweAXO8RYn9/pub?gid=0&single=true&output=csv';

export async function getJobs(): Promise<Job[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const url = sheetId
    ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`
    : SHEET_CSV_URL;

  try {

    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.warn('[TAC Jobs] CSV fetch error, using fallback. Status:', res.status, 'URL:', url);
      return FALLBACK_JOBS;
    }

    const text = await res.text();
    const allRows = parseCSV(text);

    // Skip header row (index 0)
    const dataRows = allRows.slice(1);

    const jobs = dataRows
      .map((row, i) => parseSheetRow(row, i))
      .filter((j): j is Job => j !== null);

    return jobs.length > 0 ? jobs : FALLBACK_JOBS;
  } catch (err) {
    console.warn('[TAC Jobs] Failed to fetch CSV, using fallback:', err);
    return FALLBACK_JOBS;
  }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}
