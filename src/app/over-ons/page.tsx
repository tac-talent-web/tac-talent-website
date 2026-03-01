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

const CONSULTANTS = [
  {
    name: "Sophie van den Berg",
    title: "Senior Consultant W&S",
    bio: "Sophie heeft 8 jaar ervaring in technische werving. Zij is gespecialiseerd in machinebouw en installatietechniek en staat bekend om haar directe communicatie.",
    img: "/consultant-sophie.webp",
  },
  {
    name: "Daan Hoekstra",
    title: "Consultant Interim",
    bio: "Daan werkt dagelijks met opdrachtgevers die snel iemand nodig hebben. Zijn netwerk van direct beschikbare technici maakt hem de aangewezen persoon voor urgente opdrachten.",
    img: "/consultant-daan.webp",
  },
  {
    name: "Lena Martens",
    title: "Consultant Advies",
    bio: "Lena combineert marktdata met praktijkervaring om opdrachtgevers eerlijk advies te geven. Zij helpt ook bij het schrijven van vacatureteksten die wél de juiste kandidaten trekken.",
    img: "/consultant-lena.webp",
  },
];

const KERNWAARDEN = [
  { title: "Technologie als voorsprong", desc: "Slimme tools waarmee wij sneller en beter matchen dan traditionele bureaus." },
  { title: "Resultaat als verdienmodel", desc: "No cure, no pay. Wij verdienen alleen als u succesvol plaatst." },
  { title: "Partnerschap als werkwijze", desc: "Eén aanspreekpunt, eerlijk advies, langdurige samenwerking." },
];

export default function OverOnsPage() {
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
          <Label>Over TAC</Label>
          <h1 style={{ fontFamily: F.h, fontSize: isMobile ? 36 : isTablet ? 50 : 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px" }}>Over TAC</h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Talent Acquisition Company — opgericht vanuit de overtuiging dat werving in de technische sector beter kan.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT — 2 col */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 40 : 80, alignItems: "start" }}>
          <div>
            <Label>Ons verhaal</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : 38, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 24px" }}>Werving die werkt, voor de technische sector.</h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, margin: "0 0 20px" }}>
              TAC is opgericht vanuit de overtuiging dat werving in de technische sector beter kan. Sneller, eerlijker en met meer kennis van de markt. Wij combineren de persoonlijke aanpak van een gespecialiseerd bureau met de snelheid van moderne technologie. Het resultaat: relevante kandidaten, eerlijk advies en een partner die meedenkt met uw organisatie.
            </p>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, margin: 0 }}>
              Wij geloven niet in eindeloze CV-rondjes of vage beloftes. Wij geloven in zorgvuldige selectie, eerlijke communicatie en een werkwijze waar u op kunt bouwen.
            </p>
          </div>
          <div>
            <div style={{ aspectRatio: "4/5", borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero.webp" alt="TAC team" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </div>

      {/* KERNWAARDEN */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>Onze kernwaarden</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : 38, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: 0 }}>Waar wij voor staan.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 24 }}>
            {KERNWAARDEN.map((k, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 12, padding: "28px 28px 28px", borderTop: `3px solid ${C.red}` }}>
                <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 700, color: C.licorice, marginBottom: 12 }}>{k.title}</div>
                <p style={{ fontFamily: F.b, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONSULTANTS */}
      <div style={{ background: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
            <Label>Ons team</Label>
            <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : 38, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Onze consultants maken het verschil.</h2>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65 }}>Bij TAC werkt u samen met ervaren consultants die de technische arbeidsmarkt van binnen en buiten kennen. Zij zijn uw vaste aanspreekpunt — van intake tot plaatsing en daarna.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 28 }}>
            {CONSULTANTS.map((c, i) => (
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

      {/* CTA */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad, textAlign: "center" }}>
          <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 28 : 38, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Klaar om samen te werken?</h2>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 32 }}>Wij denken graag met u mee. Geheel vrijblijvend.</p>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white }}>
              Neem contact op &rarr;
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
