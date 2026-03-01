'use client';

import { useState, useEffect } from "react";

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

function Logo({ variant = "dark", size = "md" }: { variant?: string; size?: string }) {
  const s: Record<string, number> = { sm: 22, md: 26, lg: 34 };
  return (
    <div style={{ fontFamily: F.h, fontSize: s[size], fontWeight: 800, color: variant === "dark" ? C.licorice : C.white, lineHeight: 1, letterSpacing: "-0.03em", cursor: "pointer" }}>
      tac<span style={{ color: C.red }}>.</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{children}</div>;
}

function Btn({ children, variant = "primary", style: sx = {} }: { children: React.ReactNode; variant?: string; style?: React.CSSProperties }) {
  const base: React.CSSProperties = { fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 8, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.25s ease" };
  const v: Record<string, React.CSSProperties> = {
    primary: { ...base, background: C.red, color: C.white },
    outline_light: { ...base, background: "transparent", color: C.white, border: "1.5px solid rgba(255,255,255,0.2)" },
    outline_dark: { ...base, background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}` },
    ghost: { ...base, background: "transparent", color: C.red, padding: "14px 0", textDecoration: "underline", textUnderlineOffset: 4 } as React.CSSProperties,
  };
  return <button style={{ ...v[variant], ...sx }}>{children}</button>;
}

function Photo({ aspect = "3/2", label = "", dark = true, style: sx = {} }: { aspect?: string; label?: string; dark?: boolean; style?: React.CSSProperties }) {
  const bg = dark
    ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%)"
    : "linear-gradient(145deg, #e8e8e6 0%, #d4d4d2 40%, #e0e0de 100%)";
  return (
    <div style={{ aspectRatio: aspect, background: bg, borderRadius: 12, position: "relative", overflow: "hidden", ...sx }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {label && <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 500, color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", padding: "0 20px" }}>{label}</div>}
      </div>
    </div>
  );
}

export default function TACHomepage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: F.b, color: C.licorice, background: C.white, overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.97)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.gainsboro}` : "none", transition: "all 0.35s ease", padding: scrolled ? "14px 48px" : "28px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo variant={scrolled ? "dark" : "light"} size="sm" />
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Diensten", "Expertise", "Over ons", "Contact"].map(item => (
              <a key={item} style={{ fontFamily: F.b, fontSize: 14, fontWeight: 500, color: scrolled ? C.licorice : "rgba(255,255,255,0.65)", textDecoration: "none", cursor: "pointer" }}>{item}</a>
            ))}
            <Btn variant="primary" style={{ padding: "10px 22px", fontSize: 13 }}>Neem contact op</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: C.licorice, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: `linear-gradient(${C.gainsboro} 1px, transparent 1px), linear-gradient(90deg, ${C.gainsboro} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.red }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "160px 48px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center", minHeight: "65vh" }}>
            <div>
              <Label>Werving &amp; Selectie</Label>
              <h1 style={{ fontFamily: F.h, fontSize: 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 24px" }}>Technisch talent<br />dat bij u past.</h1>
              <p style={{ fontFamily: F.b, fontSize: 18, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 0 36px" }}>TAC is specialist in het vinden van technisch personeel. Wij combineren sectorkennis met slimme technologie om snel de juiste match te maken. Zonder risico — u betaalt alleen bij een succesvolle plaatsing.</p>
              <div style={{ display: "flex", gap: 14 }}>
                <Btn variant="primary">Ontdek onze aanpak</Btn>
                <Btn variant="outline_light">Neem contact op</Btn>
              </div>
            </div>
            <Photo aspect="4/5" label="Consultant in gesprek met opdrachtgever" />
          </div>
          <div style={{ display: "flex", gap: 64, padding: "52px 0 60px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 56 }}>
            {[{ n: "90", l: "dagen garantie" }, { n: "No cure", l: "no pay" }, { n: "< 5", l: "werkdagen tot voordracht" }, { n: "100%", l: "focus op technisch talent" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: F.h, fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CLIENT LOGOS */}
      <div style={{ borderBottom: `1px solid ${C.gainsboro}`, padding: "36px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 500, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: 20 }}>Bedrijven die wij ondersteunen bij hun zoektocht naar technisch talent</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {["Bedrijf A", "Bedrijf B", "Bedrijf C", "Bedrijf D", "Bedrijf E", "Bedrijf F"].map(name => (
              <div key={name} style={{ padding: "12px 28px", fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.gainsboro, letterSpacing: "-0.01em" }}>{name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* DIENSTEN */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}>
          <Label>Onze diensten</Label>
          <h2 style={{ fontFamily: F.h, fontSize: 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>De juiste expertise voor elk wervingsvraagstuk.</h2>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65 }}>Of u nu één positie wilt invullen of structureel zoekt naar technisch personeel — wij bieden de oplossing die past bij uw situatie.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { title: "Werving & Selectie", desc: "Zoekt u een ervaren technisch professional voor een vaste positie? Onze consultants kennen de markt en weten waar het juiste talent te vinden is.", points: ["Persoonlijke intake en vacature-analyse", "Gescreende kandidaten binnen werkdagen", "90 dagen plaatsingsgarantie"], photo: "Kandidaat op de werkvloer" },
            { title: "Interim & Tijdelijke Inzet", desc: "Heeft u op korte termijn extra capaciteit nodig? Wij beschikken over een netwerk van direct beschikbare professionals die snel inzetbaar zijn.", points: ["Direct beschikbare vakmensen", "Flexibele contractvormen", "Persoonlijke begeleiding gedurende de opdracht"], photo: "Professional aan het werk" },
            { title: "Advies & Marktinzicht", desc: "Niet zeker waar te beginnen? Onze consultants adviseren u over de huidige arbeidsmarkt, realistische verwachtingen en de beste aanpak.", points: ["Arbeidsmarktanalyse voor uw regio", "Salarisadvies op basis van actuele data", "Advies over vacaturetekst en positionering"], photo: "Consultant geeft advies" },
          ].map((d, i) => (
            <div key={i} style={{ border: `1px solid ${C.gainsboro}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Photo aspect="16/10" label={d.photo} style={{ borderRadius: 0 }} />
              <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: F.h, fontSize: 22, fontWeight: 700, color: C.licorice, margin: "0 0 10px", lineHeight: 1.2 }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>{d.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 16, borderTop: `1px solid ${C.gainsboro}` }}>
                  {d.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: C.red, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.licorice, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GARANTIE */}
      <div style={{ background: C.teal }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <Label>Onze garantie</Label>
              <h2 style={{ fontFamily: F.h, fontSize: 44, fontWeight: 800, color: C.white, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 20px" }}>90 dagen zekerheid op elke plaatsing.</h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>Wij geloven in de kwaliteit van onze matches. Daarom bieden wij op elke plaatsing een garantie van 90 dagen. Vertrekt de kandidaat? Dan leveren wij kosteloos een vervanger of restitueren wij de volledige fee.</p>
              <Btn variant="primary">Neem contact op</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Volledige proefperiode gedekt", desc: "90 dagen dekt de volledige proeftijd. U loopt geen risico." },
                { title: "Gratis vervanging", desc: "Past het niet? Wij zoeken een nieuwe kandidaat. Zonder extra kosten." },
                { title: "Of volledige restitutie", desc: "Geen geschikte vervanger? Dan krijgt u de fee terug." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "22px 24px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: C.teal, fontSize: 14, fontWeight: 800, lineHeight: 1 }}>✓</span>
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

      {/* CONTACT */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <Label>Neem contact op</Label>
              <h2 style={{ fontFamily: F.h, fontSize: 44, fontWeight: 800, color: C.licorice, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px" }}>Samen kijken wat we voor u kunnen betekenen?</h2>
              <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: "0 0 36px", maxWidth: 420 }}>Of u nu een concrete vacature heeft of gewoon wilt weten wat de mogelijkheden zijn — wij denken graag met u mee. Geheel vrijblijvend.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 14, color: C.muted, width: 60 }}>Email</span><span style={{ fontSize: 15, color: C.licorice, fontWeight: 500 }}>info@tac-talent.nl</span></div>
                <div style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 14, color: C.muted, width: 60 }}>LinkedIn</span><span style={{ fontSize: 15, color: C.red, fontWeight: 500, cursor: "pointer" }}>linkedin.com/company/tac-talent</span></div>
              </div>
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 36, border: `1px solid ${C.gainsboro}` }}>
              <div style={{ fontFamily: F.h, fontSize: 20, fontWeight: 700, color: C.licorice, marginBottom: 28 }}>Laten we kennismaken</div>
              {[{ label: "Naam", ph: "Uw volledige naam" }, { label: "Bedrijf", ph: "Naam van uw organisatie" }, { label: "Email", ph: "u@bedrijf.nl" }, { label: "Telefoon", ph: "+31 (0) 6 ..." }].map((f, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                  <div style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: `1px solid ${C.gainsboro}`, background: C.offwhite, fontFamily: F.b, fontSize: 15, color: C.muted, boxSizing: "border-box" }}>{f.ph}</div>
                </div>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Waar kunnen we u mee helpen?</label>
                <div style={{ width: "100%", padding: "13px 16px", borderRadius: 8, minHeight: 100, border: `1px solid ${C.gainsboro}`, background: C.offwhite, fontFamily: F.b, fontSize: 15, color: C.muted }}> Beschrijf kort uw situatie of vraag...</div>
              </div>
              <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }}>Verstuur bericht</Btn>
              <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 12 }}>Wij reageren binnen één werkdag.</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: C.licorice }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <Logo variant="light" size="md" />
              <p style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.3)", marginTop: 12, maxWidth: 300, lineHeight: 1.55 }}>Specialist in het vinden van technisch personeel. Persoonlijk advies, slimme technologie, en 90 dagen garantie op elke plaatsing.</p>
            </div>
            <div style={{ display: "flex", gap: 64 }}>
              <div>
                <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Navigatie</div>
                {["Diensten", "Expertise", "Over ons", "Contact"].map(item => (
                  <div key={item} style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 10, cursor: "pointer" }}>{item}</div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: F.h, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Diensten</div>
                {["Werving & Selectie", "Interim & Tijdelijk", "Advies & Marktinzicht"].map(item => (
                  <div key={item} style={{ fontFamily: F.b, fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 10, cursor: "pointer" }}>{item}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28 }}>
            <div style={{ fontFamily: F.b, fontSize: 13, color: "rgba(255,255,255,0.15)" }}>© 2026 TAC — Talent Acquisition Company</div>
            <div style={{ display: "flex", gap: 24 }}>
              <span style={{ fontFamily: F.b, fontSize: 13, color: "rgba(255,255,255,0.15)", cursor: "pointer" }}>Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
