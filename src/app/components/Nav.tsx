'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  licorice: "#111111",
  red: "#EC5C3B",
  gainsboro: "#D9DBD9",
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

const NAV_LINKS = [
  { label: "Diensten", href: "/diensten" },
  { label: "Expertise", href: "/expertise" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const navBg = scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "transparent";
  const navBlur = scrolled || menuOpen ? "blur(20px)" : "none";
  const navBorder = scrolled && !menuOpen ? `1px solid ${C.gainsboro}` : "none";
  const navPadding = isMobile
    ? (scrolled ? "14px 20px" : "20px 20px")
    : (scrolled ? "14px 48px" : "28px 48px");
  const navTextDark = scrolled || menuOpen;
  const barColor = navTextDark ? C.licorice : C.white;

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: navBlur, borderBottom: navBorder, transition: "all 0.35s ease", padding: navPadding }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: F.h, fontSize: 22, fontWeight: 800, color: navTextDark ? C.licorice : C.white, lineHeight: 1, letterSpacing: "-0.03em", cursor: "pointer" }}>
            tac<span style={{ color: C.red }}>.</span>
          </div>
        </Link>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: barColor, transition: "transform 0.3s ease, background 0.35s ease", transformOrigin: "center", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: barColor, transition: "opacity 0.3s ease, background 0.35s ease", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: barColor, transition: "transform 0.3s ease, background 0.35s ease", transformOrigin: "center", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        ) : (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} style={{ fontFamily: F.b, fontSize: 14, fontWeight: 500, color: scrolled ? C.licorice : "rgba(255,255,255,0.65)", textDecoration: "none", cursor: "pointer" }}>
                {label}
              </Link>
            ))}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <button style={{ fontFamily: F.b, fontSize: 13, fontWeight: 600, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white, transition: "all 0.25s ease" }}>
                Neem contact op
              </button>
            </Link>
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ padding: "16px 20px 20px", borderTop: `1px solid ${C.gainsboro}`, marginTop: 12 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", fontFamily: F.b, fontSize: 16, fontWeight: 500, color: C.licorice, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${C.gainsboro}` }}
            >
              {label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <Link href="/contact" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
              <button style={{ fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: C.white, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Neem contact op
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
