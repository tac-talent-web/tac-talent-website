'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const C = {
  licorice: "#111111",
  red: "#EC5C3B",
  gainsboro: "#D9DBD9",
  sage: "#B4CA80",
  teal: "#10242F",
  white: "#FFFFFF",
  offwhite: "#F5F5F4",
  muted: "#6B7178",
};

const F = {
  h: "'Bricolage Grotesque', system-ui, sans-serif",
  b: "'Inter', system-ui, sans-serif",
};

function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{children}</div>;
}

function Btn({ children, variant = "primary", style: sx = {}, onClick }: { children: React.ReactNode; variant?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const base: React.CSSProperties = { fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.25s ease" };
  const v: Record<string, React.CSSProperties> = {
    primary: { ...base, background: C.red, color: C.white },
    outline_dark: { ...base, background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}` },
  };
  return <button style={{ ...v[variant], ...sx }} onClick={onClick}>{children}</button>;
}

function ClientLogo({ name, withSymbol = false, symbolType = "hex" }: { name: string; withSymbol?: boolean; symbolType?: "hex" | "circuit" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, cursor: "default", transition: "all 0.2s ease" }}
    >
      {withSymbol && symbolType === "hex" && (
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" style={{ flexShrink: 0, opacity: hovered ? 0.66 : 0.4, transition: "opacity 0.2s ease" }}>
          <path d="M9 1L17 5.5V14.5L9 19L1 14.5V5.5L9 1Z" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" fill="none" />
          <path d="M9 6L13 8.5V13.5L9 16L5 13.5V8.5L9 6Z" fill={hovered ? "#666666" : "#A0A0A0"} opacity="0.3" />
        </svg>
      )}
      {withSymbol && symbolType === "circuit" && (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ flexShrink: 0, opacity: hovered ? 0.66 : 0.4, transition: "opacity 0.2s ease" }}>
          <circle cx="3" cy="8" r="2" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" />
          <circle cx="17" cy="8" r="2" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" />
          <circle cx="10" cy="3" r="2" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" />
          <line x1="5" y1="8" x2="15" y2="8" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" />
          <line x1="10" y1="5" x2="10" y2="8" stroke={hovered ? "#666666" : "#A0A0A0"} strokeWidth="1.5" />
        </svg>
      )}
      <span style={{ fontFamily: F.h, fontSize: 14, fontWeight: 700, color: hovered ? "#666666" : "#A0A0A0", transition: "color 0.2s ease", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {name}
      </span>
    </div>
  );
}

export default function TACHomepage() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const [formData, setFormData] = useState({ naam: "", bedrijf: "", email: "", telefoon: "", bericht: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const secPad = isMobile ? "60px 20px" : isTablet ? "80px 32px" : "100px 48px";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.naam,
          company: formData.bedrijf,
          email: formData.email,
          phone: formData.telefoon,
          message: formData.bericht,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ naam: "", bedrijf: "", email: "", telefoon: "", bericht: "" });
      } else {
        setSubmitStatus("error");
        setErrorMsg(data.error || "Er is een fout opgetreden.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMsg("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 8,
    border: `1px solid ${C.gainsboro}`,
    background: C.offwhite,
    fontFamily: F.b,
    fontSize: 15,
    color: C.licorice,
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ fontFamily: F.b, color: C.licorice, background: C.white, overflowX: "hidden" }}>

      <Nav />

      {/* HERO */}
      <div style={{ background: C.licorice, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: `linear-gradient(${C.gainsboro} 1px, transparent 1px), linear-gradient(90deg, ${C.gainsboro} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.red }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "110px 20px 0" : isTablet ? "140px 32px 0" : "160px 48px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 36 : 72, alignItems: "center", minHeight: isMobile ? "auto" : "65vh" }}>
            <div style={{ order: isMobile ? 1 : 0 }}>
              <Label>Werving &amp; Selectie</Label>
              <h1 style={{ fontFamily: F.h, fontSize: isMobile ? 36 : isTablet ? 50 : 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 24px" }}>Technisch talent<br />dat bij u past.</h1>
              <p style={{ fontFamily: F.b, fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 0 36px" }}>TAC is specialist in het vinden van technisch personeel. Wij combineren sectorkennis met slimme technologie om snel de juiste match te maken. Zonder risico — u betaalt alleen bij een succesvolle plaatsing.</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/diensten" style={{ textDecoration: "none" }}>
                  <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>Ontdek onze aanpak</button>
                </Link>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, cursor: "pointer", background: "transparent", color: C.white, border: "1.5px solid rgba(255,255,255,0.2)" }}>Neem contact op</button>
                </Link>
              </div>
            </div>
            <div style={{ order: isMobile ? 0 : 1 }}>
              <div style={{ aspectRatio: isMobile ? "16/9" : "4/5", background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%)", borderRadius: 12, position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero.webp" alt="Consultant in gesprek met opdrachtgever" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "28px 20px" : 64, padding: "52px 0 60px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 56 }}>
            {[
              { n: "30", l: "dagen garantie" },
              { n: "No cure", l: "no pay" },
              { n: "< 14", l: "werkdagen tot eerste kandidaat" },
              { n: "Persoonlijk", l: "onze aanpak" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: F.h, fontSize: isMobile ? 28 : 38, fontWeight: 800, color: C.white, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CLIENT LOGOS */}
      <div style={{ borderBottom: `1px solid ${C.gainsboro}`, padding: isMobile ? "28px 20px" : "36px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 500, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: 20 }}>Bedrijven die wij ondersteunen bij hun zoektocht naar technisch talent</div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 32, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-vortex.webp" alt="Vortex Industries" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-kroon.webp" alt="Kroon Engineering" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-staalwerk.webp" alt="Staalwerk Group" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-meridian.webp" alt="Meridian Technical" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-nordvik.webp" alt="Nordvik Systems" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-atlas.webp" alt="Atlas Constructie" style={{ height: 36, width: "auto", opacity: 0.6, filter: "grayscale(100%)" }} />
          </div>
        </div>
      </div>

      {/* DIENSTEN */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}>
          <Label>Onze diensten</Label>
          <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>De juiste expertise voor elk wervingsvraagstuk.</h2>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65 }}>Of u nu één positie wilt invullen of structureel zoekt naar technisch personeel — wij bieden de oplossing die past bij uw situatie.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: 24 }}>
          {[
            {
              title: "Werving & Selectie",
              badge: true,
              desc: "Zoekt u een ervaren technisch professional voor een vaste positie? Onze consultants kennen de markt en weten waar het juiste talent te vinden is.",
              points: ["Persoonlijke intake en vacature-analyse", "Gescreende kandidaten binnen werkdagen", "30 dagen plaatsingsgarantie"],
              img: "/service1.webp",
              label: "Kandidaat op de werkvloer",
            },
            {
              title: "Interim & Tijdelijke Inzet",
              badge: false,
              desc: "Heeft u op korte termijn extra capaciteit nodig? Wij beschikken over een netwerk van direct beschikbare professionals die snel inzetbaar zijn.",
              points: ["Direct beschikbare vakmensen", "Flexibele contractvormen", "Persoonlijke begeleiding gedurende de opdracht"],
              img: "/service2.webp",
              label: "Professional aan het werk",
            },
            {
              title: "Advies & Marktinzicht",
              badge: false,
              desc: "Niet zeker waar te beginnen? Onze consultants adviseren u over de huidige arbeidsmarkt, realistische verwachtingen en de beste aanpak.",
              points: ["Arbeidsmarktanalyse voor uw regio", "Salarisadvies op basis van actuele data", "Advies over vacaturetekst en positionering"],
              img: "/team.webp",
              label: "Consultant geeft advies",
            },
          ].map((d, i) => (
            <div key={i} style={{ border: `1px solid ${C.gainsboro}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
              {d.badge && (
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, background: C.red, color: C.white, fontFamily: F.h, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Meest gekozen
                </div>
              )}
              <div style={{ aspectRatio: "16/10", background: "linear-gradient(145deg, #e8e8e6 0%, #d4d4d2 40%, #e0e0de 100%)", position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: F.h, fontSize: 22, fontWeight: 700, color: C.licorice, margin: "0 0 10px", lineHeight: 1.2 }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>{d.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 16, borderTop: `1px solid ${C.gainsboro}`, marginBottom: 20 }}>
                  {d.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: C.red, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.licorice, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <span style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: C.red, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Meer informatie &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOTOBAND */}
      <div style={{ width: "100%", overflow: "hidden", display: "flex", gap: 0 }}>
        {["/service1.webp", "/hero.webp", "/service2.webp"].map((src, i) => (
          <div key={i} style={{ flex: 1, height: isMobile ? 180 : 280, overflow: "hidden", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {/* EXPERTISE */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}>
            <Label>Onze expertise</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: 0 }}>Wij weten waar u naar zoekt.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
            {[
              {
                num: "01",
                title: "Sectorkennis",
                text: "Wij investeren continu in kennis van de technische arbeidsmarkt. Welke functies zijn het moeilijkst in te vullen? Wat verwachten kandidaten? Welke regio's zijn het krapst? Die kennis delen wij actief met onze opdrachtgevers — ook als daar geen directe opdracht achter zit.",
              },
              {
                num: "02",
                title: "Technologie",
                text: "Onze matching-technologie scant de markt continu en koppelt vacatures aan geselecteerde kandidaten. Dit betekent dat wij sneller relevante profielen kunnen presenteren dan traditionele bureaus. De technologie doet het zoekwerk — onze consultants doen het denkwerk.",
              },
              {
                num: "03",
                title: "Resultaatgedreven",
                text: "Wij werken op basis van no cure, no pay. Geen abonnement, geen zoekkosten, geen factuur tenzij er een succesvolle plaatsing is. Met 30 dagen garantie op elke plaatsing. Uw belang is ons belang.",
              },
              {
                num: "04",
                title: "Persoonlijke aanpak",
                text: "Achter elke vacature zit een organisatie met eigen cultuur, uitdagingen en ambities. Onze consultants nemen de tijd om uw situatie te begrijpen en adviseren op basis van feiten, niet aannames. U werkt met één vast aanspreekpunt — van eerste gesprek tot na de plaatsing.",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.gainsboro}`, borderRadius: 12, padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, left: 16, fontFamily: F.h, fontSize: 80, fontWeight: 800, color: C.muted, opacity: 0.12, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{item.num}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{item.num} — {item.title}</div>
                  <p style={{ fontFamily: F.b, fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONSULTANTS */}
      <div style={{ background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <Label>Maak kennis met ons team</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Onze consultants maken het verschil.</h2>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65 }}>Bij TAC werkt u samen met ervaren consultants die de technische arbeidsmarkt van binnen en buiten kennen. Zij zijn uw vaste aanspreekpunt — van intake tot plaatsing en daarna.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28 }}>
            {[
              {
                name: "Sophie van den Berg",
                title: "Manager Werving & Selectie",
                bio: "Sophie heeft 8 jaar ervaring in technische werving. Zij is gespecialiseerd in machinebouw en installatietechniek en staat bekend om haar directe communicatie.",
                img: "/consultant-sophie.webp",
              },
              {
                name: "Daan Hoekstra",
                title: "Manager Interim",
                bio: "Daan werkt dagelijks met opdrachtgevers die snel iemand nodig hebben. Zijn netwerk van direct beschikbare technici maakt hem de aangewezen persoon voor urgente opdrachten.",
                img: "/consultant-daan.webp",
              },
              {
                name: "Lena Martens",
                title: "Manager Advies & Marktinzicht",
                bio: "Lena combineert marktdata met praktijkervaring om opdrachtgevers eerlijk advies te geven. Zij helpt ook bij het schrijven van vacatureteksten die wél de juiste kandidaten trekken.",
                img: "/consultant-lena.webp",
              },
              {
                name: "Lisa Clawton",
                title: "Manager Recruitment",
                bio: "Lisa is gespecialiseerd in het vinden van jong technisch talent voor groeiende organisaties. Met haar scherpe marktkennis en directe aanpak zorgt zij voor snelle en passende matches.",
                img: "/consultant-lisa.webp",
              },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 24px", border: `1px solid ${C.gainsboro}`, borderRadius: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", objectPosition: "center top", borderRadius: 12, marginBottom: 20 }} />
                <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 700, color: C.licorice, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontFamily: F.b, fontSize: 13, color: C.muted, marginBottom: 16 }}>{c.title}</div>
                <p style={{ fontFamily: F.b, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{c.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GARANTIE */}
      <div style={{ background: C.teal }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 80, alignItems: "center" }}>
            <div>
              <Label>Onze garantie</Label>
              <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.white, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 20px" }}>30 dagen zekerheid op elke plaatsing.</h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>Wij geloven in de kwaliteit van onze matches. Daarom bieden wij op elke plaatsing een garantie van 30 dagen. Vertrekt de kandidaat? Dan leveren wij kosteloos een vervanger of restitueren wij de volledige fee.</p>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>Neem contact op</button>
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Volledige garantieperiode gedekt", desc: "30 dagen. U loopt geen risico." },
                { title: "Gratis vervanging", desc: "Past het niet? Wij zoeken een nieuwe kandidaat. Zonder extra kosten." },
                { title: "Of volledige restitutie", desc: "Geen geschikte vervanger? Dan krijgt u de fee terug." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "22px 24px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "#EC5C3B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 800, lineHeight: 1 }}>✓</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OVER TAC */}
      <div style={{ background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Label>Over TAC</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 20px" }}>Werving die werkt, zonder gedoe.</h2>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, margin: "0 0 32px" }}>TAC is opgericht vanuit de overtuiging dat werving in de technische sector beter kan. Sneller, eerlijker en met meer kennis van de markt.</p>
            <Link href="/over-ons" style={{ textDecoration: "none" }}>
              <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>
                Lees meer over ons &rarr;
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 80, alignItems: "start" }}>
            <div>
              <Label>Neem contact op</Label>
              <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Samen kijken wat we voor u kunnen betekenen?</h2>
              <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: 0, maxWidth: 420 }}>Of u nu een concrete vacature heeft of gewoon wilt weten wat de mogelijkheden zijn — wij denken graag met u mee. Geheel vrijblijvend.</p>
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: isMobile ? 20 : 36, border: `1px solid ${C.gainsboro}` }}>
              <div style={{ fontFamily: F.h, fontSize: 20, fontWeight: 700, color: C.licorice, marginBottom: 28 }}>Laten we kennismaken</div>
              {submitStatus === "success" ? (
                <div style={{ padding: "24px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac", fontFamily: F.b, fontSize: 15, color: "#166534", lineHeight: 1.6 }}>
                  Bedankt! Wij nemen binnen één werkdag contact op.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {[
                    { label: "Naam", key: "naam", ph: "Uw volledige naam", type: "text" },
                    { label: "Bedrijf", key: "bedrijf", ph: "Naam van uw organisatie", type: "text" },
                    { label: "Email", key: "email", ph: "u@bedrijf.nl", type: "email" },
                    { label: "Telefoon", key: "telefoon", ph: "+31 (0) 6 ...", type: "tel" },
                  ].map((f) => (
                    <div key={f.key} style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.ph}
                        value={formData[f.key as keyof typeof formData]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={inputStyle}
                        required={f.key === "naam" || f.key === "email"}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bericht</label>
                    <textarea
                      placeholder="Beschrijf kort uw situatie of vraag..."
                      rows={4}
                      value={formData.bericht}
                      onChange={(e) => setFormData(prev => ({ ...prev, bericht: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                      required
                    />
                  </div>
                  {submitStatus === "error" && (
                    <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a5", fontFamily: F.b, fontSize: 14, color: "#dc2626" }}>
                      {errorMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ width: "100%", fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: submitting ? "not-allowed" : "pointer", background: submitting ? "#ccc" : C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s ease" }}
                  >
                    {submitting ? "Versturen..." : "Verstuur bericht"}
                  </button>
                  <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 12 }}>Wij reageren binnen één werkdag.</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
}
