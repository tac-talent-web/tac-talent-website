"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Job } from "@/lib/jobs";

const RadiusMap = dynamic(() => import("../components/RadiusMap"), { ssr: false });

const C = {
  licorice: "#111111",
  red: "#EC5C3B",
  gainsboro: "#D9DBD9",
  teal: "#10242F",
  white: "#FFFFFF",
  offwhite: "#F5F5F4",
  muted: "#6B7178",
};

const F = {
  h: "'Bricolage Grotesque', system-ui, sans-serif",
  b: "'Inter', system-ui, sans-serif",
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Fulltime",
  PART_TIME: "Parttime",
  CONTRACT: "Contract",
};

interface Coords { lat: number; lon: number }

function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

async function geocode(query: string): Promise<Coords | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=nl`,
      { headers: { "User-Agent": "TAC-Jobboard/1.0" } }
    );
    const data = await res.json();
    if (!data?.[0]) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { return null; }
}

function Badge({ label, color = C.offwhite, textColor = C.muted }: { label: string; color?: string; textColor?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: color, color: textColor, fontFamily: F.b, fontSize: 12, fontWeight: 500, border: `1px solid ${C.gainsboro}` }}>
      {label}
    </span>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/vacatures/${job.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{ background: C.white, border: `1px solid ${C.gainsboro}`, borderRadius: 12, padding: "24px 28px", transition: "box-shadow 0.2s ease, transform 0.2s ease", cursor: "pointer", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
      >
        <div>
          <div style={{ fontFamily: F.b, fontSize: 11, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {job.category}
          </div>
          <h2 style={{ fontFamily: F.h, fontSize: 20, fontWeight: 700, color: C.licorice, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {job.title}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge label={`📍 ${job.location}`} />
          <Badge label={EMPLOYMENT_LABELS[job.employmentType] || job.employmentType} />
          {job.salary && <Badge label={job.salary} color="#FFF7F0" textColor={C.red} />}
          {job.remote && <Badge label="Remote mogelijk" color="#F0FDF4" textColor="#166534" />}
        </div>
        <p style={{ fontFamily: F.b, fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          {job.description.replace(/\*\*/g, "").split("\n")[0]}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${C.gainsboro}` }}>
          <span style={{ fontFamily: F.b, fontSize: 12, color: C.muted }}>Geplaatst: {job.postedAt}</span>
          <span style={{ fontFamily: F.b, fontSize: 13, fontWeight: 600, color: C.red }}>Bekijk vacature →</span>
        </div>
      </div>
    </Link>
  );
}

export default function VacaturesClient({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Radius filter
  const [locationInput, setLocationInput] = useState("");
  const [radius, setRadius] = useState(30);
  const [centerCoords, setCenterCoords] = useState<Coords | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const jobCoordsCache = useRef<Map<string, Coords | null>>(new Map());
  const [jobCoordsReady, setJobCoordsReady] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))).sort(), [jobs]);

  // Debounced geocode van ingetypte locatie
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!locationInput.trim()) { setCenterCoords(null); setIsGeocoding(false); return; }
    setIsGeocoding(true);
    debounceRef.current = setTimeout(async () => {
      const coords = await geocode(locationInput.trim());
      setCenterCoords(coords);
      setIsGeocoding(false);
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [locationInput]);

  // Geocode vacaturelocaties wanneer center bekend is
  useEffect(() => {
    if (!centerCoords) return;
    const missing = jobs.map((j) => j.location).filter((loc) => !jobCoordsCache.current.has(loc));
    if (missing.length === 0) { setJobCoordsReady(true); return; }
    setJobCoordsReady(false);
    Promise.all(missing.map(async (loc) => {
      const coords = await geocode(loc + ", Nederland");
      jobCoordsCache.current.set(loc, coords);
    })).then(() => setJobCoordsReady(true));
  }, [centerCoords, jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.category.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
      const matchCategory = !filterCategory || j.category === filterCategory;
      const matchType = !filterType || j.employmentType === filterType;
      let matchRadius = true;
      if (centerCoords && jobCoordsReady) {
        const jc = jobCoordsCache.current.get(j.location);
        matchRadius = jc ? haversineKm(centerCoords, jc) <= radius : false;
      }
      return matchSearch && matchCategory && matchType && matchRadius;
    });
  }, [jobs, search, filterCategory, filterType, centerCoords, radius, jobCoordsReady]);

  const hasActiveFilters = search || filterCategory || filterType || centerCoords;

  const selectStyle: React.CSSProperties = {
    padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.gainsboro}`, background: C.white, fontFamily: F.b, fontSize: 14, color: C.licorice, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236B7178' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, minWidth: 160,
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ background: C.teal, paddingTop: 140 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px" }}>
          <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            Openstaande vacatures
          </div>
          <h1 style={{ fontFamily: F.h, fontSize: 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px" }}>
            Vacatures
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Ontdek onze openstaande vacatures in Techniek, Automotive, Productie en Logistiek. Jouw volgende stap begint hier.
          </p>
        </div>
      </div>

      {/* FILTERS + RESULTS */}
      <div style={{ background: C.offwhite, minHeight: "60vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px" }}>

          {/* FILTER BAR */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gainsboro}`, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Zoek functie, categorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: "1 1 200px", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.gainsboro}`, background: C.offwhite, fontFamily: F.b, fontSize: 14, color: C.licorice, outline: "none" }}
            />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={selectStyle}>
              <option value="">Alle categorieën</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
              <option value="">Alle contracttypes</option>
              <option value="FULL_TIME">Fulltime</option>
              <option value="PART_TIME">Parttime</option>
              <option value="CONTRACT">Contract</option>
            </select>

            {/* Kaart toggle */}
            <button
              onClick={() => setShowMap((v) => !v)}
              style={{
                padding: "10px 16px", borderRadius: 8, border: `1px solid ${centerCoords ? C.red : C.gainsboro}`,
                background: centerCoords ? "#FFF7F4" : "transparent", fontFamily: F.b, fontSize: 14,
                color: centerCoords ? C.red : C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: centerCoords ? 600 : 400,
              }}
            >
              📍 {centerCoords ? `Binnen ${radius} km` : "Zoek op kaart"}
            </button>

            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(""); setFilterCategory(""); setFilterType(""); setLocationInput(""); setCenterCoords(null); setRadius(30); setShowMap(false); }}
                style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.gainsboro}`, background: "transparent", fontFamily: F.b, fontSize: 14, color: C.muted, cursor: "pointer" }}
              >
                Wissen
              </button>
            )}
          </div>

          {/* KAART PANEL */}
          {showMap && (
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gainsboro}`, padding: 24, marginBottom: 24 }}>
              <div style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: C.licorice, marginBottom: 12 }}>
                Zoek op locatie en reisafstand
              </div>
              {/* Locatie input */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 260px" }}>
                  <input
                    type="text"
                    placeholder="Typ een stad of postcode..."
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.gainsboro}`, background: C.offwhite, fontFamily: F.b, fontSize: 14, color: C.licorice, outline: "none" }}
                  />
                  {isGeocoding && (
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: C.muted }}>⏳</span>
                  )}
                </div>
                <span style={{ fontFamily: F.b, fontSize: 13, color: C.muted, alignSelf: "center" }}>
                  Of klik op de kaart om een punt te kiezen.
                </span>
              </div>

              {/* Kaart */}
              <RadiusMap
                center={centerCoords}
                radius={radius}
                onMapClick={(coords) => { setCenterCoords(coords); setLocationInput(""); }}
                onRadiusChange={setRadius}
              />

              {locationInput && !isGeocoding && !centerCoords && (
                <p style={{ fontFamily: F.b, fontSize: 13, color: C.red, marginTop: 8 }}>Locatie niet gevonden. Probeer een andere plaatsnaam.</p>
              )}
              {centerCoords && (
                <p style={{ fontFamily: F.b, fontSize: 13, color: C.muted, marginTop: 8 }}>
                  ✅ Zoekradius actief — vacatures binnen <strong>{radius} km</strong> worden getoond.
                </p>
              )}
            </div>
          )}

          {/* RESULT COUNT */}
          <div style={{ fontFamily: F.b, fontSize: 14, color: C.muted, marginBottom: 24 }}>
            {centerCoords && !jobCoordsReady
              ? "Locaties berekenen..."
              : filtered.length === 0
              ? "Geen vacatures gevonden"
              : `${filtered.length} vacature${filtered.length !== 1 ? "s" : ""} gevonden${centerCoords ? ` binnen ${radius} km` : ""}`}
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 40px", background: C.white, borderRadius: 16, border: `1px solid ${C.gainsboro}` }}>
              <div style={{ fontFamily: F.h, fontSize: 28, fontWeight: 700, color: C.licorice, marginBottom: 16 }}>Geen vacatures gevonden</div>
              <p style={{ fontFamily: F.b, fontSize: 16, color: C.muted, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Pas je zoekopdracht aan of stuur ons een spontane sollicitatie.
              </p>
              <a href="mailto:careers@thetalentacquisitioncompany.nl" style={{ display: "inline-block", padding: "14px 28px", borderRadius: 8, background: C.red, color: C.white, fontFamily: F.b, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Stuur spontane sollicitatie
              </a>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {filtered.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
