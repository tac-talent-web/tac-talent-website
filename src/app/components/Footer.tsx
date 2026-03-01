'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  licorice: "#111111",
  red: "#EC5C3B",
  white: "#FFFFFF",
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

export default function Footer() {
  const width = useWindowWidth();
  const isMobile = width < 768;

  return (
    <div style={{ background: C.licorice }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "48px 20px" : "56px 48px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: F.h, fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1, letterSpacing: "-0.03em", cursor: "pointer" }}>
                tac<span style={{ color: C.red }}>.</span>
              </div>
            </Link>
            <p style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 12, maxWidth: 300, lineHeight: 1.55 }}>
              Specialist in het vinden van technisch personeel. Persoonlijk advies, slimme technologie, en 30 dagen garantie op elke plaatsing.
            </p>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 40 : 64, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Navigatie</div>
              {[
                { label: "Diensten", href: "/diensten" },
                { label: "Expertise", href: "/expertise" },
                { label: "Over ons", href: "/over-ons" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Diensten</div>
              {[
                { label: "Werving & Selectie", href: "/diensten" },
                { label: "Interim & Tijdelijk", href: "/diensten" },
                { label: "Advies & Marktinzicht", href: "/diensten" },
              ].map(({ label, href }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", paddingTop: 28, gap: isMobile ? 12 : 0 }}>
          <div style={{ fontFamily: F.b, fontSize: 13, color: "rgba(255,255,255,0.15)" }}>&copy; 2026 TAC &mdash; Talent Acquisition Company</div>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ fontFamily: F.b, fontSize: 13, color: "rgba(255,255,255,0.15)", cursor: "pointer" }}>Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
