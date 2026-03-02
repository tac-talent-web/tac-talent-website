"use client";

import { useEffect, useRef, useState } from "react";

interface Coords { lat: number; lon: number }

interface Props {
  center: Coords | null;
  radius: number; // in km
  onMapClick: (coords: Coords) => void;
  onRadiusChange: (km: number) => void;
}

const C = {
  red: "#EC5C3B",
  gainsboro: "#D9DBD9",
  white: "#FFFFFF",
  offwhite: "#F5F5F4",
  muted: "#6B7178",
  licorice: "#111111",
};

const F = { b: "'Inter', system-ui, sans-serif" };

// Default center: Netherlands
const NL_CENTER: Coords = { lat: 52.3, lon: 5.3 };
const NL_ZOOM = 7;
const PIN_ZOOM = 10;

export default function RadiusMap({ center, radius, onMapClick, onRadiusChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const circleRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;
    if (leafletMapRef.current) return; // already initialized

    // Dynamically import Leaflet (SSR-safe)
    import("leaflet").then((L) => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [NL_CENTER.lat, NL_CENTER.lon],
        zoom: NL_ZOOM,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onMapClick({ lat: e.latlng.lat, lon: e.latlng.lng });
      });

      leafletMapRef.current = map;
    });

    return () => {
      if (leafletMapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (leafletMapRef.current as any).remove();
        leafletMapRef.current = null;
        circleRef.current = null;
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update marker + circle when center or radius changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = leafletMapRef.current as any;

      // Remove old
      if (circleRef.current) { (circleRef.current as any).remove(); circleRef.current = null; }
      if (markerRef.current) { (markerRef.current as any).remove(); markerRef.current = null; }

      if (!center) return;

      const latlng: [number, number] = [center.lat, center.lon];

      markerRef.current = L.marker(latlng).addTo(map);
      circleRef.current = L.circle(latlng, {
        radius: radius * 1000, // Leaflet uses meters
        color: C.red,
        fillColor: C.red,
        fillOpacity: 0.08,
        weight: 2,
      }).addTo(map);

      map.flyTo(latlng, PIN_ZOOM, { duration: 0.8 });
    });
  }, [center, radius]);

  if (!mounted) return <div style={{ height: 340, background: C.offwhite, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: C.muted, fontFamily: F.b, fontSize: 14 }}>Kaart laden...</span></div>;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gainsboro}` }}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: 340, width: "100%" }} />
      {/* Radius slider onderaan kaart */}
      <div style={{ background: C.white, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderTop: `1px solid ${C.gainsboro}` }}>
        <span style={{ fontFamily: F.b, fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>Straal:</span>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: C.red, cursor: "pointer" }}
        />
        <span style={{ fontFamily: F.b, fontSize: 14, fontWeight: 600, color: C.licorice, whiteSpace: "nowrap", minWidth: 52 }}>
          {radius} km
        </span>
      </div>
    </div>
  );
}
