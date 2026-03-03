import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  province: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  category: string;
  description: string;
  requirements: string[];
  applyEmail: string;
  postedAt: string;
  validThrough: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  niveau: string;
  remote: boolean;
}

interface RawVacature {
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string;
  province: string;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: string;
  niveau: string;
  description: string;
  posted_on: string;
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

function rawToJob(v: RawVacature): Job {
  // Map niveau/seniority to category
  const categoryMap: Record<string, string> = {
    'Junior': 'Techniek',
    'Junior/Medior': 'Techniek',
    'Medior': 'Techniek',
    'Medior/Senior': 'Techniek',
    'Senior': 'Techniek',
  };

  // Guess category from title keywords
  const titleLower = v.title.toLowerCase();
  let category = 'Techniek';
  if (titleLower.includes('auto') || titleLower.includes('voertuig') || titleLower.includes('monteur')) category = 'Automotive';
  if (titleLower.includes('warehouse') || titleLower.includes('logistiek') || titleLower.includes('chauffeur')) category = 'Logistiek';
  if (titleLower.includes('productie') || titleLower.includes('operator') || titleLower.includes('cnc') || titleLower.includes('lasser')) category = 'Productie';
  if (titleLower.includes('werkvoorbereider') || titleLower.includes('projectleider') || titleLower.includes('installat')) category = 'Installatie';
  if (titleLower.includes('elektr') || titleLower.includes('elektrisch')) category = 'Elektrotechniek';

  let salary: string | undefined;
  if (v.salary_min && v.salary_max) {
    salary = `€${v.salary_min.toLocaleString('nl-NL')} – €${v.salary_max.toLocaleString('nl-NL')} per maand`;
  } else if (v.salary_min) {
    salary = `Vanaf €${v.salary_min.toLocaleString('nl-NL')} per maand`;
  } else if (v.salary_max) {
    salary = `Tot €${v.salary_max.toLocaleString('nl-NL')} per maand`;
  }

  const empType = v.employment_type?.toUpperCase().replace('-', '_');
  const employmentType: Job['employmentType'] = 
    empType === 'PART_TIME' ? 'PART_TIME' :
    empType === 'CONTRACT' ? 'CONTRACT' : 'FULL_TIME';

  // Valid through = 60 days after posted
  let validThrough = '';
  if (v.posted_on) {
    const d = new Date(v.posted_on);
    d.setDate(d.getDate() + 60);
    validThrough = d.toISOString().split('T')[0];
  }

  return {
    id: v.slug || toSlug(`${v.title}-${v.location}`),
    slug: v.slug || toSlug(`${v.title}-${v.location}`),
    title: v.title,
    location: v.location,
    province: v.province || '',
    employmentType,
    category,
    description: v.description || '',
    requirements: [],
    applyEmail: 'careers@tac-talent.nl',
    postedAt: v.posted_on || new Date().toISOString().split('T')[0],
    validThrough,
    salary,
    salaryMin: v.salary_min ?? undefined,
    salaryMax: v.salary_max ?? undefined,
    niveau: v.niveau || 'Medior',
    remote: false,
  };
}

export function getJobs(): Job[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'vacatures.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: RawVacature[] = JSON.parse(raw);
    return data.map(rawToJob);
  } catch (err) {
    console.warn('[TAC Jobs] Failed to read vacatures.json:', err);
    return [];
  }
}

export function getJobBySlug(slug: string): Job | null {
  const jobs = getJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}
