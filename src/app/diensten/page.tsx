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

const DIENSTEN = [
  {
    title: "Werving & Selectie",
    img: "/service1.webp",
    text: "Zoekt u een ervaren technisch professional voor een vaste positie? Onze consultants kennen de markt en weten waar het juiste talent te vinden is. Wij presenteren een selectie van zorgvuldig geselecteerde kandidaten die passen bij uw organisatie, zodat u snel en met vertrouwen kunt beslissen.",
    points: [
      "Persoonlijke intake en vacature-analyse",
      "Zorgvuldig geselecteerde kandidaten binnen werkdagen",
      "30 dagen plaatsingsgarantie",
      "Eén vast aanspreekpunt gedurende het hele proces",
    ],
    cta: "Neem contact op over Werving & Selectie",
  },
  {
    title: "Interim & Tijdelijke Inzet",
    img: "/service2.webp",
    text: "Heeft u op korte termijn extra capaciteit nodig? Wij beschikken over een netwerk van direct beschikbare professionals die snel inzetbaar zijn bij uw organisatie. Van een paar weken tot meerdere maanden — wij regelen het.",
    points: [
      "Direct beschikbare vakmensen",
      "Flexibele contractvormen",
      "Persoonlijke begeleiding gedurende de opdracht",
      "Snel schakelen bij piekperiodes",
    ],
    cta: "Neem contact op over Interim",
  },
  {
    title: "Advies & Marktinzicht",
    img: "/team.webp",
    text: "Niet zeker waar te beginnen? Onze consultants adviseren u over de huidige arbeidsmarkt, realistische verwachtingen en de beste aanpak voor uw specifieke situatie. Eerlijk en onafhankelijk — ook als het antwoord niet is wat u verwacht.",
    points: [
      "Arbeidsmarktanalyse voor uw regio",
      "Salarisadvies op basis van actuele data",
      "Advies over vacaturetekst en positionering",
      "Eerlijke feedback over haalbaarheid",
    ],
    cta: "Neem contact op over Advies",
  },
];

export default function DienstenPage() {
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
          <Label>Wat wij bieden</Label>
          <h1 style={{ fontFamily: F.h, fontSize: isMobile ? 36 : isTablet ? 50 : 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px" }}>Onze diensten</h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Of u nu één positie wilt invullen, tijdelijk extra capaciteit nodig heeft, of advies wilt over uw wervingsstrategie — onze consultants staan klaar. Wij bieden drie diensten die we aanpassen aan uw situatie.
          </p>
        </div>
      </div>

      {/* DIENSTEN BLOCKS */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 64 : 100 }}>
          {DIENSTEN.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : (i % 2 === 0 ? "row" : "row-reverse"),
                gap: isMobile ? 32 : 72,
                alignItems: "center",
              }}
            >
              {/* PHOTO */}
              <div style={{ flex: "0 0 auto", width: isMobile ? "100%" : "48%" }}>
                <div style={{ aspectRatio: "16/10", borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(145deg, #e8e8e6 0%, #d4d4d2 40%, #e0e0de 100%)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>

              {/* TEXT */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Dienst {i + 1}</div>
                <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 26 : 36, fontWeight: 800, color: C.licorice, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 16px" }}>{d.title}</h2>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, margin: "0 0 28px" }}>{d.text}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, paddingTop: 24, borderTop: `1px solid ${C.gainsboro}` }}>
                  {d.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.red, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: C.licorice, lineHeight: 1.55 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <button style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>
                    {d.cta} &rarr;
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
