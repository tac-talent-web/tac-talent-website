"use client";

import { useState } from "react";

const C = {
  licorice: "#111111",
  red: "#EC5C3B",
  gainsboro: "#D9DBD9",
  white: "#FFFFFF",
  offwhite: "#F5F5F4",
  muted: "#6B7178",
};

const F = {
  h: "'Bricolage Grotesque', system-ui, sans-serif",
  b: "'Inter', system-ui, sans-serif",
};

interface ApplyFormProps {
  jobTitle: string;
  jobSlug: string;
}

export default function ApplyForm({ jobTitle, jobSlug }: ApplyFormProps) {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    bericht: "",
    privacy: false,
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: formData.naam,
          email: formData.email,
          telefoon: formData.telefoon,
          bericht: formData.bericht,
          privacy: formData.privacy,
          website: formData.website,
          jobTitle,
          jobSlug,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData({ naam: "", email: "", telefoon: "", bericht: "", privacy: false, website: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Er is een fout opgetreden.");
      }
    } catch {
      setStatus("error");
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: F.h,
    fontSize: 12,
    fontWeight: 600,
    color: C.licorice,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  if (status === "success") {
    return (
      <div
        style={{
          background: C.white,
          borderRadius: 16,
          padding: "48px 40px",
          border: `1px solid ${C.gainsboro}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
        <div
          style={{
            fontFamily: F.h,
            fontSize: 28,
            fontWeight: 700,
            color: C.licorice,
            marginBottom: 12,
          }}
        >
          Bedankt!
        </div>
        <p style={{ fontFamily: F.b, fontSize: 16, color: C.muted, maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
          We nemen binnen 2 werkdagen contact op.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.white,
        borderRadius: 16,
        padding: "40px",
        border: `1px solid ${C.gainsboro}`,
      }}
    >
      <div
        style={{
          fontFamily: F.h,
          fontSize: 28,
          fontWeight: 700,
          color: C.licorice,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        Solliciteer op {jobTitle}
      </div>
      <p style={{ fontFamily: F.b, fontSize: 15, color: C.muted, margin: "0 0 32px", lineHeight: 1.5 }}>
        Vul het formulier in en wij nemen snel contact met je op.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Honeypot — hidden from users */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website">Website (laat leeg)</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
          />
        </div>

        {/* Hidden job field */}
        <input type="hidden" name="jobTitle" value={jobTitle} />
        <input type="hidden" name="jobSlug" value={jobSlug} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              Naam <span style={{ color: C.red }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw volledige naam"
              required
              value={formData.naam}
              onChange={(e) => setFormData((p) => ({ ...p, naam: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              E-mail <span style={{ color: C.red }}>*</span>
            </label>
            <input
              type="email"
              placeholder="u@email.nl"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Telefoon</label>
          <input
            type="tel"
            placeholder="+31 (0) 6 ..."
            value={formData.telefoon}
            onChange={(e) => setFormData((p) => ({ ...p, telefoon: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Motivatie / bericht</label>
          <textarea
            placeholder="Vertel ons kort waarom u geschikt bent voor deze functie..."
            rows={5}
            maxLength={500}
            value={formData.bericht}
            onChange={(e) => setFormData((p) => ({ ...p, bericht: e.target.value }))}
            style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
          />
          <div style={{ fontFamily: F.b, fontSize: 12, color: C.muted, textAlign: "right", marginTop: 4 }}>
            {formData.bericht.length}/500
          </div>
        </div>

        {/* Privacy checkbox */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              cursor: "pointer",
              fontFamily: F.b,
              fontSize: 13,
              color: C.muted,
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              required
              checked={formData.privacy}
              onChange={(e) => setFormData((p) => ({ ...p, privacy: e.target.checked }))}
              style={{ marginTop: 2, flexShrink: 0, accentColor: C.red, width: 16, height: 16 }}
            />
            <span>
              Ik ga akkoord met de verwerking van mijn gegevens.{" "}
              <span style={{ color: C.red }}>*</span>
              <br />
              <span style={{ fontSize: 12, color: C.muted }}>
                Gegevens worden maximaal 6 maanden bewaard conform ons privacybeleid.
              </span>
            </span>
          </label>
        </div>

        {status === "error" && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              background: "#fef2f2",
              borderRadius: 8,
              border: "1px solid #fca5a5",
              fontFamily: F.b,
              fontSize: 14,
              color: "#dc2626",
            }}
          >
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            fontFamily: F.b,
            fontSize: 15,
            fontWeight: 600,
            padding: "16px 30px",
            borderRadius: 8,
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
            background: submitting ? "#ccc" : C.red,
            color: C.white,
            transition: "background 0.25s ease",
          }}
        >
          {submitting ? "Versturen..." : "Sollicitatie versturen"}
        </button>

        <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 12 }}>
          Wij reageren binnen 2 werkdagen.
        </div>
      </form>
    </div>
  );
}
