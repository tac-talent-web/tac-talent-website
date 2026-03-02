"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Job } from "@/lib/jobs";

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

function Badge({ label, color = C.offwhite, textColor = C.muted }: { label: string; color?: string; textColor?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        background: color,
        color: textColor,
        fontFamily: F.b,
        fontSize: 12,
        fontWeight: 500,
        border: `1px solid ${C.gainsboro}`,
      }}
    >
      {label}
    </span>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/vacatures/${job.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.gainsboro}`,
          borderRadius: 12,
          padding: "24px 28px",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          cursor: "pointer",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "none";
        }}
      >
        <div>
          <div
            style={{
              fontFamily: F.b,
              fontSize: 11,
              fontWeight: 600,
              color: C.red,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {job.category}
          </div>
          <h2
            style={{
              fontFamily: F.h,
              fontSize: 20,
              fontWeight: 700,
              color: C.licorice,
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {job.title}
          </h2>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge label={`📍 ${job.location}`} />
          <Badge label={EMPLOYMENT_LABELS[job.employmentType] || job.employmentType} />
          {job.salary && <Badge label={job.salary} color="#FFF7F0" textColor={C.red} />}
          {job.remote && <Badge label="Remote mogelijk" color="#F0FDF4" textColor="#166534" />}
        </div>

        <p
          style={{
            fontFamily: F.b,
            fontSize: 14,
            color: C.muted,
            lineHeight: 1.6,
            margin: 0,
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.description.replace(/\*\*/g, "").split("\n")[0]}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
            borderTop: `1px solid ${C.gainsboro}`,
          }}
        >
          <span style={{ fontFamily: F.b, fontSize: 12, color: C.muted }}>
            Geplaatst: {job.postedAt}
          </span>
          <span
            style={{
              fontFamily: F.b,
              fontSize: 13,
              fontWeight: 600,
              color: C.red,
            }}
          >
            Bekijk vacature →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function VacaturesClient({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.category))).sort(),
    [jobs]
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      const matchCategory = !filterCategory || j.category === filterCategory;
      const matchLocation = !filterLocation || j.location === filterLocation;
      const matchType = !filterType || j.employmentType === filterType;
      return matchSearch && matchCategory && matchLocation && matchType;
    });
  }, [jobs, search, filterCategory, filterLocation, filterType]);

  const selectStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${C.gainsboro}`,
    background: C.white,
    fontFamily: F.b,
    fontSize: 14,
    color: C.licorice,
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236B7178' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    minWidth: 160,
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ background: C.teal, paddingTop: 140 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px 80px",
          }}
        >
          <div
            style={{
              fontFamily: F.h,
              fontSize: 12,
              fontWeight: 600,
              color: C.red,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 14,
            }}
          >
            Openstaande vacatures
          </div>
          <h1
            style={{
              fontFamily: F.h,
              fontSize: 64,
              fontWeight: 800,
              color: C.white,
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              margin: "0 0 20px",
            }}
          >
            Vacatures
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: 0,
            }}
          >
            Ontdek onze openstaande vacatures in Techniek, Automotive, Productie en Logistiek. Jouw volgende stap begint hier.
          </p>
        </div>
      </div>

      {/* FILTERS + RESULTS */}
      <div style={{ background: C.offwhite, minHeight: "60vh" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "48px 48px",
          }}
        >
          {/* FILTER BAR */}
          <div
            style={{
              background: C.white,
              borderRadius: 12,
              border: `1px solid ${C.gainsboro}`,
              padding: "20px 24px",
              marginBottom: 36,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Zoek vacature, locatie, categorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: "1 1 240px",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${C.gainsboro}`,
                background: C.offwhite,
                fontFamily: F.b,
                fontSize: 14,
                color: C.licorice,
                outline: "none",
              }}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={selectStyle}
            >
              <option value="">Alle categorieën</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={selectStyle}
            >
              <option value="">Alle locaties</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={selectStyle}
            >
              <option value="">Alle contracttypes</option>
              <option value="FULL_TIME">Fulltime</option>
              <option value="PART_TIME">Parttime</option>
              <option value="CONTRACT">Contract</option>
            </select>
            {(search || filterCategory || filterLocation || filterType) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterCategory("");
                  setFilterLocation("");
                  setFilterType("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: `1px solid ${C.gainsboro}`,
                  background: "transparent",
                  fontFamily: F.b,
                  fontSize: 14,
                  color: C.muted,
                  cursor: "pointer",
                }}
              >
                Wissen
              </button>
            )}
          </div>

          {/* RESULT COUNT */}
          <div
            style={{
              fontFamily: F.b,
              fontSize: 14,
              color: C.muted,
              marginBottom: 24,
            }}
          >
            {filtered.length === 0
              ? "Geen vacatures gevonden"
              : `${filtered.length} vacature${filtered.length !== 1 ? "s" : ""} gevonden`}
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                background: C.white,
                borderRadius: 16,
                border: `1px solid ${C.gainsboro}`,
              }}
            >
              <div
                style={{
                  fontFamily: F.h,
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.licorice,
                  marginBottom: 16,
                }}
              >
                Momenteel geen vacatures beschikbaar
              </div>
              <p
                style={{
                  fontFamily: F.b,
                  fontSize: 16,
                  color: C.muted,
                  maxWidth: 480,
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Stuur ons je spontane sollicitatie — wij denken graag met je mee over je volgende stap.
              </p>
              <a
                href="mailto:careers@thetalentacquisitioncompany.nl"
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  borderRadius: 8,
                  background: C.red,
                  color: C.white,
                  fontFamily: F.b,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Stuur spontane sollicitatie
              </a>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 24,
              }}
            >
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
