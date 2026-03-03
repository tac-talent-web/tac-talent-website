import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobs, getJobBySlug } from "@/lib/jobs";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ApplyForm from "../../components/ApplyForm";
import Link from "next/link";

export const revalidate = 300;

export async function generateStaticParams() {
  const jobs = getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Vacature niet gevonden | TAC" };

  return {
    title: `${job.title} — ${job.location} | TAC`,
    description: `${job.title} in ${job.location}. ${job.description.slice(0, 140)}...`,
    alternates: {
      canonical: `https://tac-talent-website.vercel.app/vacatures/${job.slug}`,
    },
    openGraph: {
      title: `${job.title} | TAC`,
      description: job.description.slice(0, 160),
      url: `https://tac-talent-website.vercel.app/vacatures/${job.slug}`,
    },
  };
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Fulltime",
  PART_TIME: "Parttime",
  CONTRACT: "Contract",
};

function renderDescription(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={key++} />);
      continue;
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <strong
          key={key++}
          style={{ display: "block", marginTop: 20, marginBottom: 8, fontWeight: 700 }}
        >
          {trimmed.slice(2, -2)}
        </strong>
      );
      continue;
    }
    if (trimmed.startsWith("- ")) {
      elements.push(
        <li key={key++} style={{ marginBottom: 6 }}>
          {trimmed.slice(2)}
        </li>
      );
      continue;
    }
    elements.push(<p key={key++} style={{ margin: "0 0 12px" }}>{trimmed}</p>);
  }

  return elements;
}

export default async function VacatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "The Talent Acquisition Company",
      sameAs: "https://tac-talent-website.vercel.app",
      logo: "https://tac-talent-website.vercel.app/logo.svg",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "NL",
      },
    },
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: {
              "@type": "QuantitativeValue",
              description: job.salary,
            },
          },
        }
      : {}),
  };

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

  return (
    <div style={{ fontFamily: F.b, color: C.licorice, background: C.white, overflowX: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      {/* HEADER */}
      <div style={{ background: C.teal, paddingTop: 140 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 64px" }}>
          <Link
            href="/vacatures"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: F.b,
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              marginBottom: 24,
            }}
          >
            ← Alle vacatures
          </Link>

          <div
            style={{
              fontFamily: F.h,
              fontSize: 12,
              fontWeight: 600,
              color: C.red,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            {job.category}
          </div>

          <h1
            style={{
              fontFamily: F.h,
              fontSize: 52,
              fontWeight: 800,
              color: C.white,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 24px",
              maxWidth: 800,
            }}
          >
            {job.title}
          </h1>

          {/* META BADGES */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { label: `📍 ${job.location}` },
              { label: EMPLOYMENT_LABELS[job.employmentType] || job.employmentType },
              ...(job.salary ? [{ label: job.salary }] : []),
              ...(job.remote ? [{ label: "Remote mogelijk" }] : []),
            ].map(({ label }) => (
              <span
                key={label}
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: F.b,
                  fontSize: 13,
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#solliciteer"
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
            Solliciteer direct
          </a>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* LEFT: description + requirements */}
            <div>
              {/* DESCRIPTION */}
              <div
                style={{
                  background: C.white,
                  borderRadius: 16,
                  padding: "36px 40px",
                  border: `1px solid ${C.gainsboro}`,
                  marginBottom: 24,
                }}
              >
                <h2
                  style={{
                    fontFamily: F.h,
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.licorice,
                    margin: "0 0 24px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Over deze functie
                </h2>
                <div
                  style={{
                    fontFamily: F.b,
                    fontSize: 15,
                    color: C.licorice,
                    lineHeight: 1.7,
                  }}
                >
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {renderDescription(job.description)}
                  </ul>
                </div>
              </div>

              {/* REQUIREMENTS */}
              {job.requirements.length > 0 && (
                <div
                  style={{
                    background: C.white,
                    borderRadius: 16,
                    padding: "36px 40px",
                    border: `1px solid ${C.gainsboro}`,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: F.h,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.licorice,
                      margin: "0 0 20px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Wat wij vragen
                  </h2>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {job.requirements.map((req, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: F.b,
                          fontSize: 15,
                          color: C.licorice,
                          lineHeight: 1.6,
                          marginBottom: 10,
                        }}
                      >
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT: sticky info card + apply form */}
            <div>
              {/* INFO CARD */}
              <div
                style={{
                  background: C.white,
                  borderRadius: 16,
                  padding: "28px 28px",
                  border: `1px solid ${C.gainsboro}`,
                  marginBottom: 24,
                  position: "sticky",
                  top: 100,
                }}
              >
                <div
                  style={{
                    fontFamily: F.h,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.licorice,
                    marginBottom: 20,
                  }}
                >
                  Vacaturedetails
                </div>
                {[
                  { label: "Locatie", value: job.location },
                  { label: "Contracttype", value: EMPLOYMENT_LABELS[job.employmentType] || job.employmentType },
                  ...(job.salary ? [{ label: "Salaris", value: job.salary }] : []),
                  { label: "Geplaatst", value: job.postedAt },
                  ...(job.validThrough ? [{ label: "Geldig tot", value: job.validThrough }] : []),
                  { label: "Remote", value: job.remote ? "Ja" : "Nee" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${C.gainsboro}`,
                      fontFamily: F.b,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: C.muted }}>{label}</span>
                    <span style={{ color: C.licorice, fontWeight: 500, textAlign: "right", maxWidth: 160 }}>
                      {value}
                    </span>
                  </div>
                ))}
                <a
                  href="#solliciteer"
                  style={{
                    display: "block",
                    marginTop: 24,
                    padding: "14px 20px",
                    borderRadius: 8,
                    background: C.red,
                    color: C.white,
                    fontFamily: F.b,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Solliciteer direct
                </a>
              </div>
            </div>
          </div>

          {/* APPLY FORM */}
          <div id="solliciteer" style={{ scrollMarginTop: 100, marginTop: 48 }}>
            <ApplyForm jobTitle={job.title} jobSlug={job.slug} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
