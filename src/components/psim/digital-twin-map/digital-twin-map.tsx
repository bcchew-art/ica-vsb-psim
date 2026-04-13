"use client";

import { useState } from "react";
import { Camera, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { tuasCheckpoint, EQUIPMENT_COLORS } from "@/lib/checkpoint-data";
import { ZoneHotspot } from "./zone-hotspot";
import { EquipmentMarker } from "./equipment-marker";
import { DetailPanel, ZONE_DEFINITIONS } from "./detail-panel";
import { CctvPanel } from "@/components/psim/site-overview/cctv-panel";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BASE_PATH = "/ica-vsb-psim";

// Zone hotspot positions as % of image container
const ZONE_HOTSPOTS: Array<{
  id: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
}> = [
  { id: "A", label: "WEST ENTRY",     top: "30%", left: "8%",  width: "14%", height: "20%" },
  { id: "B", label: "SOUTH APPROACH", top: "55%", left: "25%", width: "15%", height: "22%" },
  { id: "C", label: "EAST GATE",      top: "35%", left: "60%", width: "16%", height: "22%" },
  { id: "D", label: "NORTH RETURN",   top: "20%", left: "45%", width: "14%", height: "18%" },
  { id: "E", label: "INTERNAL",       top: "40%", left: "38%", width: "12%", height: "15%" },
  { id: "F", label: "BRIDGE L3",      top: "60%", left: "10%", width: "18%", height: "22%" },
];

// Zone C equipment: S/N 9, 10, 11, 12 — positioned on zone image as %
const ZONE_C_EQUIPMENT_POSITIONS: Record<number, { top: string; left: string }> = {
  9:  { top: "65%", left: "30%" },
  10: { top: "45%", left: "55%" },
  11: { top: "55%", left: "75%" },
  12: { top: "35%", left: "45%" },
};

const ZONE_C_SNS = [9, 10, 11, 12];

// ─── STATE TYPE ───────────────────────────────────────────────────────────────

type MapView = "overview" | "zone";

interface MapState {
  view: MapView;
  activeZone: string | null;
  selectedEquipment: string | null;
}

// ─── ZONE C EQUIPMENT for zone view ──────────────────────────────────────────

const zoneCLocations = tuasCheckpoint.locations.filter((l) =>
  ZONE_C_SNS.includes(l.sn)
);

// ─── ZONE EQUIPMENT COUNTS ────────────────────────────────────────────────────

function getZoneEquipmentCount(zoneId: string): number {
  const zone = ZONE_DEFINITIONS.find((z) => z.id === zoneId);
  if (!zone) return 0;
  return tuasCheckpoint.locations.filter((l) => zone.snRange.includes(l.sn)).length;
}

// ─── IMAGE WITH FALLBACK ──────────────────────────────────────────────────────

function MapImage({
  src,
  fallbackLabel,
  alt,
}: {
  src: string;
  fallbackLabel: string;
  alt: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "3/2",
          background: "linear-gradient(135deg, #050a15 0%, #0a1828 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {fallbackLabel}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#2a4a6a" }}>
          Zoomed view loading...
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function DigitalTwinMap() {
  const [state, setState] = useState<MapState>({
    view: "overview",
    activeZone: null,
    selectedEquipment: null,
  });
  const [cctvOpen, setCctvOpen] = useState(false);

  function handleZoneClick(zoneId: string) {
    const zone = ZONE_DEFINITIONS.find((z) => z.id === zoneId);
    if (zone?.hasZoomView) {
      setState({ view: "zone", activeZone: zoneId, selectedEquipment: null });
    } else {
      setState((s) => ({ ...s, activeZone: zoneId, selectedEquipment: null }));
    }
  }

  function handleEnterZone() {
    if (state.activeZone) {
      const zone = ZONE_DEFINITIONS.find((z) => z.id === state.activeZone);
      if (zone?.hasZoomView) {
        setState((s) => ({ ...s, view: "zone", selectedEquipment: null }));
      }
    }
  }

  function handleBackToOverview() {
    setState({ view: "overview", activeZone: null, selectedEquipment: null });
  }

  function handleEquipmentClick(sn: number) {
    setState((s) => ({
      ...s,
      selectedEquipment: s.selectedEquipment === String(sn) ? null : String(sn),
    }));
  }

  const activeZoneDef = ZONE_DEFINITIONS.find((z) => z.id === state.activeZone);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {state.view === "zone" && (
            <button
              onClick={handleBackToOverview}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(0,200,255,0.08)",
                border: "1px solid rgba(0,200,255,0.25)",
                color: "#00ccff",
                fontFamily: "monospace",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              <ArrowLeft size={13} />
              Overview
            </button>
          )}
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#e0f0ff",
                margin: 0,
              }}
            >
              {state.view === "zone" && activeZoneDef
                ? `Zone ${activeZoneDef.id} — ${activeZoneDef.label}`
                : "Digital Twin — Tuas Checkpoint"}
            </h1>
            <p
              style={{
                fontSize: "11px",
                color: "#4a6a8a",
                margin: "2px 0 0",
                fontFamily: "monospace",
              }}
            >
              {state.view === "zone"
                ? "Click an equipment marker to inspect"
                : "Click a zone to explore — Zone C has zoomed view"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* CCTV toggle */}
          <button
            onClick={() => setCctvOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: cctvOpen
                ? "1px solid #1a4a7a"
                : "1px solid #1a2a40",
              background: cctvOpen ? "#0d2040" : "transparent",
              color: cctvOpen ? "#e0f0ff" : "#4a6a8a",
              fontFamily: "monospace",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            <Camera size={13} />
            CCTV
            {cctvOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #1a2a40",
              background: "transparent",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#22c55e",
                animation: "pulse 2s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "#4a6a8a",
                letterSpacing: "0.1em",
              }}
            >
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* ── Map + Detail Panel ── */}
      <div
        style={{
          flex: 1,
          minHeight: "500px",
          display: "flex",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #1a2a40",
        }}
      >
        {/* Map view */}
        <div
          style={{
            flex: 1,
            background: "#050a15",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {/* Image container — relative for absolute hotspot positioning */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3/2",
              overflow: "hidden",
              transition: "opacity 500ms",
            }}
          >
            {state.view === "overview" ? (
              <>
                <MapImage
                  src={`${BASE_PATH}/twin-base.png`}
                  fallbackLabel="Tuas Checkpoint Overview"
                  alt="Tuas Checkpoint digital twin overview"
                />

                {/* Zone hotspots */}
                {ZONE_HOTSPOTS.map((zone) => (
                  <ZoneHotspot
                    key={zone.id}
                    id={zone.id}
                    label={zone.label}
                    isDemo={zone.id === "C"}
                    equipmentCount={getZoneEquipmentCount(zone.id)}
                    style={{
                      top: zone.top,
                      left: zone.left,
                      width: zone.width,
                      height: zone.height,
                    }}
                    onClick={() => handleZoneClick(zone.id)}
                  />
                ))}
              </>
            ) : (
              <>
                <MapImage
                  src={`${BASE_PATH}/twin-zone-c.png`}
                  fallbackLabel="Zone C — East Gate"
                  alt="Zone C East Gate zoomed view"
                />

                {/* Equipment markers */}
                {zoneCLocations.map((loc) => {
                  const pos = ZONE_C_EQUIPMENT_POSITIONS[loc.sn];
                  if (!pos) return null;
                  return (
                    <EquipmentMarker
                      key={loc.sn}
                      location={loc}
                      color={EQUIPMENT_COLORS[loc.type] ?? "#888"}
                      style={{ top: pos.top, left: pos.left }}
                      isSelected={state.selectedEquipment === String(loc.sn)}
                      onClick={() => handleEquipmentClick(loc.sn)}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <DetailPanel
          selectedZone={state.activeZone}
          selectedEquipment={state.selectedEquipment}
          onEnterZone={handleEnterZone}
        />
      </div>

      {/* ── CCTV Panel ── */}
      {cctvOpen && (
        <div style={{ flexShrink: 0 }}>
          <CctvPanel />
        </div>
      )}

      {/* ── Global CSS animations ── */}
      <style>{`
        @keyframes zone-pulse {
          0%, 100% {
            border-color: rgba(0, 200, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.05);
          }
          50% {
            border-color: rgba(0, 200, 255, 0.5);
            box-shadow: 0 0 20px rgba(0, 200, 255, 0.15);
          }
        }
        @keyframes zone-pulse-demo {
          0%, 100% {
            border-color: rgba(0, 221, 255, 0.4);
            box-shadow: 0 0 12px rgba(0, 221, 255, 0.1);
          }
          50% {
            border-color: rgba(0, 221, 255, 0.8);
            box-shadow: 0 0 24px rgba(0, 221, 255, 0.25);
          }
        }
        @keyframes marker-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
