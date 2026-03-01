'use client';

import { useState, useEffect } from "react";
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

export default function ContactPage() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const secPad = isMobile ? "60px 20px" : isTablet ? "80px 32px" : "100px 48px";

  const [formData, setFormData] = useState({ naam: "", bedrijf: "", email: "", telefoon: "", bericht: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

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

      {/* PAGE HEADER */}
      <div style={{ background: C.teal, paddingTop: isMobile ? 110 : 140 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px 60px" : "0 48px 80px" }}>
          <Label>Neem contact op</Label>
          <h1 style={{ fontFamily: F.h, fontSize: isMobile ? 36 : isTablet ? 50 : 64, fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px" }}>Neem contact op</h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Of u nu een concrete vacature heeft of gewoon wilt weten wat de mogelijkheden zijn — wij denken graag met u mee. Geheel vrijblijvend.
          </p>
        </div>
      </div>

      {/* CONTACT CONTENT */}
      <div style={{ background: C.offwhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: secPad }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? 40 : 80, alignItems: "start" }}>

            {/* LEFT: INFO */}
            <div>
              <Label>Onze gegevens</Label>
              <h2 style={{ fontFamily: F.h, fontSize: isMobile ? 24 : 32, fontWeight: 800, color: C.licorice, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 24px" }}>Wij zijn er voor u.</h2>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, margin: "0 0 36px" }}>
                Of u nu een concrete vacature heeft of gewoon wilt weten wat de mogelijkheden zijn — wij denken graag met u mee. Geheel vrijblijvend.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.white, border: `1px solid ${C.gainsboro}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 3h12v10H2V3z" stroke={C.red} strokeWidth="1.5" fill="none" />
                      <path d="M2 3l6 5 6-5" stroke={C.red} strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Email</div>
                    <a href="mailto:info@tac-talent.nl" style={{ fontSize: 15, color: C.licorice, fontWeight: 500, textDecoration: "none" }}>info@tac-talent.nl</a>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.white, border: `1px solid ${C.gainsboro}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="2" width="14" height="12" rx="2" stroke={C.red} strokeWidth="1.5" />
                      <path d="M5 6h6M5 9h4" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>LinkedIn</div>
                    <a href="https://linkedin.com/company/tac-talent" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: C.red, fontWeight: 500, textDecoration: "none" }}>linkedin.com/company/tac-talent</a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div style={{ background: C.white, borderRadius: 16, padding: isMobile ? 24 : 40, border: `1px solid ${C.gainsboro}` }}>
              <div style={{ fontFamily: F.h, fontSize: 22, fontWeight: 700, color: C.licorice, marginBottom: 32 }}>Laten we kennismaken</div>

              {submitStatus === "success" ? (
                <div style={{ padding: "28px 24px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #86efac", fontFamily: F.b, fontSize: 16, color: "#166534", lineHeight: 1.6, textAlign: "center" }}>
                  <div style={{ fontFamily: F.h, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Bedankt!</div>
                  Wij nemen binnen één werkdag contact op.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 20px" }}>
                    {[
                      { label: "Naam", key: "naam", ph: "Uw volledige naam", type: "text", required: true },
                      { label: "Bedrijf", key: "bedrijf", ph: "Naam van uw organisatie", type: "text", required: false },
                    ].map((f) => (
                      <div key={f.key} style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={f.ph}
                          value={formData[f.key as keyof typeof formData]}
                          onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                          style={inputStyle}
                          required={f.required}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 20px" }}>
                    {[
                      { label: "Email", key: "email", ph: "u@bedrijf.nl", type: "email", required: true },
                      { label: "Telefoon", key: "telefoon", ph: "+31 (0) 6 ...", type: "tel", required: false },
                    ].map((f) => (
                      <div key={f.key} style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={f.ph}
                          value={formData[f.key as keyof typeof formData]}
                          onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                          style={inputStyle}
                          required={f.required}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontFamily: F.h, fontSize: 12, fontWeight: 600, color: C.licorice, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bericht</label>
                    <textarea
                      placeholder="Beschrijf kort uw situatie of vraag..."
                      rows={5}
                      value={formData.bericht}
                      onChange={(e) => setFormData(prev => ({ ...prev, bericht: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
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
                    style={{ width: "100%", fontFamily: F.b, fontSize: 15, fontWeight: 600, padding: "16px 30px", borderRadius: 8, border: "none", cursor: submitting ? "not-allowed" : "pointer", background: submitting ? "#ccc" : C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s ease" }}
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
