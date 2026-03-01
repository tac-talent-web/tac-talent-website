'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

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

const EXPERTISE_ITEMS = [
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
];

export default function ExpertisePage() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const secPad = isMobile ? "60px 20px" : isTablet ? "80px 32px" : "100px 48px";

  return (
    <div style={{ fontFamily: F.b, color: C.licorice, background: C.white, overflowX: "hidden" }}>
      <Nav />

      {/* PAGE HEADER */}
      <div style={{ background: C.teal, paddingTop: isMobile ? 110 : 140 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px 60px" : "0 48px 80px" }}>
          <Label>Onze expertise</Label>
          <h1 style={{ fontFamily: F.h, fontSize: isMobile ? 36 : isTablet ? 50 : 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px" }}>Wij weten waar u naar zoekt.</h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Technische werving vraagt om meer dan een database. Het vraagt om inzicht in sectoren, functies en mensen. Dat is precies wat TAC biedt.
          </p>
        </div>
      </div>

      {/* EXPERTISE BLOCKS */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
            {EXPERTISE_ITEMS.map((item) => (
              <div key={item.num} style={{ background: C.white, border: `1px solid ${C.gainsboro}`, borderRadius: 12, padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, left: 16, fontFamily: F.h, fontSize: 80, fontWeight: 800, color: C.muted, opacity: 0.12, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{item.num}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{item.num} — {item.title}</div>
                  <p style={{ fontFamily: F.b, fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 24 : 32, fontWeight: 800, color: C.licorice, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Klaar om samen te werken?</h2>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 32 }}>Onze consultants staan voor u klaar met eerlijk advies en concrete oplossingen.</p>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>
                Neem contact op met onze consultants &rarr;
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
