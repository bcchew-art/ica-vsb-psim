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

// Zone hotspot positions as % of image container — matched to engineering drawing
const ZONE_HOTSPOTS: Array<{
  id: string;
  label: string;
  top: string;
  left: string;
  size: string;
}> = [
  { id: "1",  label: "Zone 1",  top: "38%", left: "38%", size: "10%" },
  { id: "2",  label: "Zone 2",  top: "30%", left: "70%", size: "12%" },
  { id: "3",  label: "Zone 3",  top: "42%", left: "28%", size: "9%"  },
  { id: "4",  label: "Zone 4",  top: "45%", left: "45%", size: "8%"  },
  { id: "5",  label: "Zone 5",  top: "15%", left: "35%", size: "14%" },
  { id: "6",  label: "Zone 6",  top: "28%", left: "22%", size: "10%" },
  { id: "7",  label: "Zone 7",  top: "35%", left: "48%", size: "9%"  },
  { id: "8",  label: "Zone 8",  top: "62%", left: "65%", size: "12%" },
  { id: "9",  label: "Zone 9",  top: "38%", left: "62%", size: "10%" },
  { id: "10", label: "Zone 10", top: "55%", left: "18%", size: "10%" },
  { id: "11", label: "Zone 11", top: "40%", left: "8%",  size: "12%" },
  { id: "12", label: "Zone 12", top: "62%", left: "12%", size: "10%" },
  { id: "13", label: "Zone 13", top: "72%", left: "30%", size: "14%" },
];

// Zone 8 equipment positions on the zone image
const ZONE_8_EQUIPMENT_POSITIONS: Record<string, { top: string; left: string }> = {
  "road-hump-8":    { top: "25%", left: "30%" },
  "blocker-9a":     { top: "35%", left: "55%" },
  "blocker-9b":     { top: "50%", left: "55%" },
  "blocker-9c":     { top: "65%", left: "55%" },
};

// S/N 8 and 9 equipment (Zone 8 BOQ data)
const ZONE_8_EQUIPMENT = [
  { id: "road-hump-8", sn: 8,  mapRef: "8",  label: "Road Hump",      lane: "A",       width: "8.0m",  vehicleType: "Bus",   cctv: false, remarks: "Suggest Road Blocker" },
  { id: "blocker-9a",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane A",  width: "3.5m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
  { id: "blocker-9b",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane B",  width: "3.7m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
  { id: "blocker-9c",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane C",  width: "3.4m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
];

// ─── STATE TYPE ───────────────────────────────────────────────────────────────

type MapView = "overview" | "zone";

interface MapState {
  view: MapView;
  activeZone: string | null;
  selectedEquipment: string | null;
}

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
  filtered = false,
}: {
  src: string;
  fallbackLabel: string;
  alt: string;
  filtered?: boolean;
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
          Awaiting image...
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        filter: filtered
          ? "invert(1) hue-rotate(180deg) brightness(0.65) contrast(1.4) saturate(0.7)"
          : undefined,
      }}
    />
  );
}

// ─── "COMING SOON" TOOLTIP ZONE ──────────────────────────────────────────────

function TooltipZone({ message }: { message: string }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(5,10,21,0.95)",
        border: "1px solid #1a2a40",
        borderRadius: "6px",
        padding: "8px 16px",
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#4a6a8a",
        pointerEvents: "none",
        zIndex: 100,
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
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
  const [tooltip, setTooltip] = useState<string | null>(null);

  function handleZoneClick(zoneId: string) {
    if (zoneId === "8") {
      setState({ view: "zone", activeZone: "8", selectedEquipment: null });
    } else {
      setTooltip(`Zone ${zoneId} — Coming soon`);
      setState((s) => ({ ...s, activeZone: zoneId, selectedEquipment: null }));
      setTimeout(() => setTooltip(null), 2000);
    }
  }

  function handleBackToOverview() {
    setState({ view: "overview", activeZone: null, selectedEquipment: null });
    setTooltip(null);
  }

  function handleEquipmentClick(equipId: string) {
    setState((s) => ({
      ...s,
      selectedEquipment: s.selectedEquipment === equipId ? null : equipId,
    }));
  }

  const selectedZone8Equip = ZONE_8_EQUIPMENT.find((e) => e.id === state.selectedEquipment) ?? null;

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
              {state.view === "zone"
                ? "Zone 8 — Lower Entry"
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
                : "Click Zone 8 to explore — live demo zone"}
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
              border: cctvOpen ? "1px solid #1a4a7a" : "1px solid #1a2a40",
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
              overflow: "hidden",
              transition: "opacity 400ms",
              opacity: 1,
            }}
          >
            {state.view === "overview" ? (
              <>
                {/* Engineering drawing with CSS digital-twin filter */}
                <MapImage
                  src={`${BASE_PATH}/tuas-site-plan.png`}
                  fallbackLabel="Tuas Checkpoint — Engineering Drawing"
                  alt="Tuas Checkpoint 3rd Storey Plan — digital twin view"
                  filtered={true}
                />

                {/* Zone hotspots — circular, matched to drawing zones */}
                {ZONE_HOTSPOTS.map((zone) => (
                  <ZoneHotspot
                    key={zone.id}
                    id={zone.id}
                    label={zone.label}
                    isDemo={zone.id === "8"}
                    equipmentCount={getZoneEquipmentCount(zone.id)}
                    top={zone.top}
                    left={zone.left}
                    size={zone.size}
                    onClick={() => handleZoneClick(zone.id)}
                  />
                ))}
              </>
            ) : (
              <>
                {/* Zone 8 DALL-E image — with fallback placeholder */}
                <MapImage
                  src={`${BASE_PATH}/twin-zone-8.png`}
                  fallbackLabel="Zone 8 — Awaiting image"
                  alt="Zone 8 Lower Entry — zoomed view"
                  filtered={false}
                />

                {/* Equipment markers on zone 8 */}
                {ZONE_8_EQUIPMENT.map((equip) => {
                  const pos = ZONE_8_EQUIPMENT_POSITIONS[equip.id];
                  if (!pos) return null;
                  const color = equip.label.includes("Blocker") ? "#00ddff" : "#f59e0b";
                  return (
                    <EquipmentMarker
                      key={equip.id}
                      location={{
                        sn: equip.sn,
                        mapRef: equip.mapRef,
                        lanes: [equip.lane],
                        type: equip.label.includes("Blocker") ? "blocker" : "road-hump",
                        direction: equip.remarks,
                        laneWidth: parseFloat(equip.width),
                        cctv: equip.cctv ? "Y" : "N",
                        cctvPink: equip.cctv ? 1 : 0,
                        cctvGreen: 0,
                        installLocation: "Ground",
                        vehicleType: equip.vehicleType,
                        remarks: equip.remarks,
                        x: 0,
                        y: 0,
                      }}
                      color={color}
                      style={{ top: pos.top, left: pos.left }}
                      isSelected={state.selectedEquipment === equip.id}
                      onClick={() => handleEquipmentClick(equip.id)}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <DetailPanel
          view={state.view}
          selectedZone={state.activeZone}
          selectedEquipment={selectedZone8Equip}
          onEnterZone={() => {
            if (state.activeZone === "8") {
              setState((s) => ({ ...s, view: "zone" }));
            }
          }}
        />
      </div>

      {/* ── CCTV Panel ── */}
      {cctvOpen && (
        <div style={{ flexShrink: 0 }}>
          <CctvPanel />
        </div>
      )}

      {/* ── Tooltip ── */}
      {tooltip && <TooltipZone message={tooltip} />}

      {/* ── Global CSS animations ── */}
      <style>{`
        @keyframes zone-pulse {
          0%, 100% { border-color: rgba(42, 90, 138, 0.3); }
          50% { border-color: rgba(42, 90, 138, 0.6); }
        }
        @keyframes zone-pulse-demo {
          0%, 100% {
            border-color: rgba(0, 221, 255, 0.4);
            box-shadow: 0 0 15px rgba(0, 221, 255, 0.1);
          }
          50% {
            border-color: rgba(0, 221, 255, 0.8);
            box-shadow: 0 0 30px rgba(0, 221, 255, 0.25);
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
