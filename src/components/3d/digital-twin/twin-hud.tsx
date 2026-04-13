"use client";

import { useEffect, useState } from "react";
import { ZONE_CONFIGS } from "./twin-zones";

// Equipment type color map (mirrors equipment-dots.tsx — DOM version)
const TYPE_LEGEND = [
  { label: "Blocker",        color: "#ef4444" },
  { label: "K12 DAB",        color: "#eab308" },
  { label: "Auto Bollard",   color: "#3b82f6" },
  { label: "Road Hump",      color: "#06B6D4" },
  { label: "K12 Bollard",    color: "#f97316" },
  { label: "Crash Barrier",  color: "#dc2626" },
  { label: "Traffic Light",  color: "#22c55e" },
];

const PANEL: React.CSSProperties = {
  background: "rgba(5,10,21,0.82)",
  backdropFilter: "blur(8px)",
  border: "1px solid #1a2a40",
  borderRadius: "6px",
  padding: "10px 14px",
  fontFamily: "monospace",
  color: "#8899b0",
  fontSize: "11px",
};

function LiveClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-SG", { hour12: false }));
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString("en-SG", { hour12: false })),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

export function TwinHud({
  selectedZone,
}: {
  selectedZone: string | null;
}) {
  return (
    // Overlay container — sits on top of the Canvas via absolute positioning
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* ── Top-left: Title ──────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 16, left: 16, ...PANEL }}>
        <div style={{ color: "#d1e0f0", fontSize: "13px", fontWeight: "bold", letterSpacing: "0.12em" }}>
          TUAS CHECKPOINT
        </div>
        <div style={{ color: "#2F5FD0", fontSize: "10px", letterSpacing: "0.18em", marginTop: "2px" }}>
          DIGITAL TWIN — PSIM OVERVIEW
        </div>
        <div style={{ color: "#4a6a9a", fontSize: "9px", marginTop: "6px" }}>
          ICA VEHICLE SECURITY BARRIER SYSTEM
        </div>
      </div>

      {/* ── Top-right: Live badge + clock ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          ...PANEL,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px #22c55e",
            animation: "pulse 2s infinite",
            flexShrink: 0,
          }}
        />
        <span style={{ color: "#22c55e", fontWeight: "bold", letterSpacing: "0.1em" }}>LIVE</span>
        <span style={{ color: "#4a6a9a", marginLeft: 4 }}>
          <LiveClock />
        </span>
        <span style={{ color: "#1a2a40", margin: "0 4px" }}>|</span>
        <span style={{ color: "#4a6a9a" }}>SGT UTC+8</span>
      </div>

      {/* ── Bottom-left: Equipment legend ───────────────────────────── */}
      <div style={{ position: "absolute", bottom: 16, left: 16, ...PANEL }}>
        <div style={{ color: "#4a6a9a", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "6px" }}>
          EQUIPMENT TYPES
        </div>
        {TYPE_LEGEND.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 5px ${item.color}`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#8899b0" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom-right: Zone summary ──────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 16, right: 16, ...PANEL, minWidth: 190 }}>
        <div style={{ color: "#4a6a9a", fontSize: "9px", letterSpacing: "0.15em", marginBottom: "6px" }}>
          ZONE SUMMARY — TUAS
        </div>
        {ZONE_CONFIGS.map((zone) => (
          <div
            key={zone.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "4px",
              padding: "2px 6px",
              borderRadius: "3px",
              background: selectedZone === zone.id ? `${zone.color}18` : "transparent",
              border: selectedZone === zone.id ? `1px solid ${zone.color}55` : "1px solid transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: zone.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: zone.isDemo ? zone.color : "#8899b0", fontWeight: zone.isDemo ? "bold" : "normal" }}>
                [{zone.id}] {zone.label}
              </span>
            </div>
            <span style={{ color: zone.color, marginLeft: 12 }}>{zone.equipmentCount}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid #1a2a40",
            marginTop: "6px",
            paddingTop: "6px",
            display: "flex",
            justifyContent: "space-between",
            color: "#4a6a9a",
          }}
        >
          <span>TOTAL</span>
          <span style={{ color: "#d1e0f0" }}>
            {ZONE_CONFIGS.reduce((s, z) => s + z.equipmentCount, 0)}
          </span>
        </div>
      </div>

      {/* ── Selected zone hint ──────────────────────────────────────── */}
      {!selectedZone && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            ...PANEL,
            fontSize: "10px",
            color: "#4a6a9a",
            letterSpacing: "0.1em",
          }}
        >
          Click a zone cylinder or equipment dot to inspect
        </div>
      )}

      {/* Pulse keyframe — injected inline so no global CSS dependency */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
