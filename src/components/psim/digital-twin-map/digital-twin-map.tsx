"use client";

import { useState } from "react";
import { Camera, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { tuasCheckpoint, EQUIPMENT_COLORS } from "@/lib/checkpoint-data";
import { ZoneHotspot } from "./zone-hotspot";
import { EquipmentMarker } from "./equipment-marker";
import { BarrierMarker } from "./barrier-marker";
import { DetailPanel, ZONE_DEFINITIONS } from "./detail-panel";
import { CctvPanel } from "@/components/psim/site-overview/cctv-panel";
import {
  BARRIER_COLORS,
  tuasBarriers,
  woodlandsBarriers,
  type BarrierType,
} from "@/lib/barrier-locations";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const BASE_PATH = "/ica-vsb-psim";

// Zone hotspot positions as % of image container — matched to DALL-E isometric overview
interface ZoneHotspotDef {
  id: string;
  label: string;
  top: string;
  left: string;
  size: string;
}

const TUAS_ZONE_HOTSPOTS: ZoneHotspotDef[] = [
  { id: "4B", label: "Zone 4B", top: "25%", left: "18%", size: "11%" },
  { id: "5",  label: "Zone 5",  top: "35%", left: "35%", size: "11%" },
  { id: "5B", label: "Zone 5B", top: "22%", left: "42%", size: "10%" },
  { id: "6A", label: "Zone 6A", top: "45%", left: "52%", size: "11%" },
  { id: "7",  label: "Zone 7",  top: "30%", left: "62%", size: "10%" },
  { id: "8",  label: "Zone 8",  top: "42%", left: "75%", size: "12%" },
  { id: "9A", label: "Zone 9A", top: "60%", left: "48%", size: "11%" },
];

// Woodlands hotspots — eyeballed along the diagonal inspection-lane cluster
// Complex runs lower-left to upper-right; Causeway is at top-left.
// Generic names W1-W8 pending confirmation from Jackie on real zone naming.
const WOODLANDS_ZONE_HOTSPOTS: ZoneHotspotDef[] = [
  { id: "W1", label: "Zone W1", top: "72%", left: "22%", size: "9%" },
  { id: "W2", label: "Zone W2", top: "63%", left: "33%", size: "9%" },
  { id: "W3", label: "Zone W3", top: "56%", left: "42%", size: "9%" },
  { id: "W4", label: "Zone W4", top: "50%", left: "52%", size: "9%" },
  { id: "W5", label: "Zone W5", top: "45%", left: "62%", size: "9%" },
  { id: "W6", label: "Zone W6", top: "38%", left: "72%", size: "9%" },
  { id: "W7", label: "Zone W7", top: "32%", left: "82%", size: "9%" },
  { id: "W8", label: "Zone W8", top: "28%", left: "92%", size: "9%" },
];

// Zone 8 equipment positions on the zone image — matched to DALL-E close-up
const ZONE_8_EQUIPMENT_POSITIONS: Record<string, { top: string; left: string }> = {
  "blocker-9a":     { top: "41%", left: "25%" },    // left barrier bar (orange-lit)
  "blocker-9b":     { top: "46%", left: "50%" },    // center barrier bar
  "blocker-9c":     { top: "50%", left: "76%" },    // right barrier bar
};

// S/N 8 and 9 equipment (Zone 8 BOQ data)
const ZONE_8_EQUIPMENT = [
  { id: "blocker-9a",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane A",  width: "3.5m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
  { id: "blocker-9b",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane B",  width: "3.7m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
  { id: "blocker-9c",  sn: 9,  mapRef: "9E", label: "Blocker 3M",     lane: "Lane C",  width: "3.4m",  vehicleType: "Lorry", cctv: true,  remarks: "SG→CP" },
];

// ─── STATE TYPE ───────────────────────────────────────────────────────────────

type MapView = "overview" | "zone";
type Checkpoint = "tuas" | "woodlands";

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
            fontFamily: "var(--font-mono), monospace",
            fontSize: "13px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {fallbackLabel}
        </div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#2a4a6a" }}>
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "fill",
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
        fontFamily: "var(--font-mono), monospace",
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

// ─── BARRIER LEGEND (always-visible) ──────────────────────────────────────────

function BarrierLegend() {
  const types: BarrierType[] = [
    "Blocker",
    "Road Hump",
    "K12 Drop Arm",
    "Auto Bollard",
    "Sliding Bollard",
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 40,
        width: "180px",
        padding: "10px 12px",
        borderRadius: "6px",
        background: "rgba(5,10,21,0.88)",
        border: "1px solid #1a2a40",
        backdropFilter: "blur(6px)",
        fontFamily: "var(--font-mono), monospace",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: "9px",
          color: "#4a6a8a",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        VSB Equipment
      </div>
      {types.map((t) => (
        <div
          key={t}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 0",
          }}
        >
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: BARRIER_COLORS[t],
              boxShadow: `0 0 5px ${BARRIER_COLORS[t]}CC`,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "10px", color: "#c0d4e8" }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function DigitalTwinMap() {
  const [checkpoint, setCheckpoint] = useState<Checkpoint>("tuas");
  const [state, setState] = useState<MapState>({
    view: "overview",
    activeZone: null,
    selectedEquipment: null,
  });
  const [cctvOpen, setCctvOpen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  function handleCheckpointChange(next: Checkpoint) {
    if (next === checkpoint) return;
    setCheckpoint(next);
    setState({ view: "overview", activeZone: null, selectedEquipment: null });
    setTooltip(null);
  }

  function handleZoneClick(zoneId: string) {
    if (checkpoint === "woodlands") {
      setTooltip(`Zone ${zoneId} — Coming soon — drill-down available in v2`);
      setState((s) => ({ ...s, activeZone: zoneId, selectedEquipment: null }));
      setTimeout(() => setTooltip(null), 2500);
      return;
    }
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
                fontFamily: "var(--font-mono), monospace",
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
                color: "#1a2a40",
                margin: 0,
              }}
            >
              {state.view === "zone"
                ? "Zone 8 — Lower Entry"
                : checkpoint === "woodlands"
                  ? "Digital Twin — Woodlands Checkpoint"
                  : "Digital Twin — Tuas Checkpoint"}
            </h1>
            <p
              style={{
                fontSize: "11px",
                color: "#4a6a8a",
                margin: "2px 0 0",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              {state.view === "zone"
                ? "Click an equipment marker to inspect"
                : checkpoint === "woodlands"
                  ? "Woodlands drill-down coming in v2"
                  : "Click Zone 8 to explore — live demo zone"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Checkpoint switcher — two-pill toggle */}
          {state.view === "overview" && (
            <div
              style={{
                display: "inline-flex",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid #1a2a40",
                background: "#070e1c",
                gap: "2px",
              }}
            >
              {(["tuas", "woodlands"] as const).map((cp) => {
                const active = checkpoint === cp;
                return (
                  <button
                    key={cp}
                    onClick={() => handleCheckpointChange(cp)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "5px",
                      border: "none",
                      background: active ? "#0d2040" : "transparent",
                      color: active ? "#00ccff" : "#4a6a8a",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 150ms",
                      boxShadow: active ? "0 0 0 1px rgba(0,200,255,0.25)" : "none",
                    }}
                  >
                    {cp === "tuas" ? "Tuas" : "Woodlands"}
                  </button>
                );
              })}
            </div>
          )}
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
              fontFamily: "var(--font-mono), monospace",
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
                fontFamily: "var(--font-mono), monospace",
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
          flexDirection: "row",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #1a2a40",
          background: "#050a15",
        }}
      >
        {/* Map view */}
        <div
          style={{
            flex: "1 1 0%",
            minWidth: 0,
            background: "#050a15",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Equipment legend — pinned to outer map cell so it stays visible regardless of letterbox */}
          {state.view === "overview" && <BarrierLegend />}

          {/* Aspect-ratio-locked image wrapper — 3:2 matches native image (1536x1024).
              All markers (%) are positioned inside this wrapper so they track image pixels
              1:1 at every viewport width. */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxHeight: "100%",
              aspectRatio: "3 / 2",
              // When the container is wider-than-3:2, this wrapper is height-bound; cap by max-width via the aspect ratio.
              // The flex centering on the parent keeps it visually centered.
              margin: "auto",
              overflow: "hidden",
            }}
          >
            {state.view === "overview" ? (
              <>
                {/* DALL-E digital twin overview */}
                <MapImage
                  src={
                    checkpoint === "woodlands"
                      ? `${BASE_PATH}/woodlands-overview.png`
                      : `${BASE_PATH}/tuas-overview2.png`
                  }
                  fallbackLabel={
                    checkpoint === "woodlands"
                      ? "Woodlands Checkpoint — Digital Twin Overview"
                      : "Tuas Checkpoint — Digital Twin Overview"
                  }
                  alt={
                    checkpoint === "woodlands"
                      ? "Woodlands Checkpoint — digital twin overview"
                      : "Tuas Checkpoint — digital twin overview"
                  }
                  filtered={false}
                />

                {/* Zone hotspots — circular, matched to drawing zones */}
                {(checkpoint === "woodlands" ? WOODLANDS_ZONE_HOTSPOTS : TUAS_ZONE_HOTSPOTS).map((zone) => (
                  <ZoneHotspot
                    key={zone.id}
                    id={zone.id}
                    label={zone.label}
                    isDemo={checkpoint === "tuas" && zone.id === "8"}
                    equipmentCount={checkpoint === "tuas" ? getZoneEquipmentCount(zone.id) : 0}
                    top={zone.top}
                    left={zone.left}
                    size={zone.size}
                    onClick={() => handleZoneClick(zone.id)}
                  />
                ))}

                {/* Barrier location dots — always visible on overview */}
                {(checkpoint === "woodlands" ? woodlandsBarriers : tuasBarriers).map((b) => (
                  <BarrierMarker key={b.id} barrier={b} />
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
          checkpoint={checkpoint}
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
            border-color: rgba(0, 221, 255, 0.5);
            box-shadow:
              0 0 12px rgba(0, 221, 255, 0.3),
              0 0 30px rgba(0, 221, 255, 0.15),
              inset 0 0 10px rgba(0, 221, 255, 0.08);
          }
          50% {
            border-color: rgba(0, 221, 255, 1);
            box-shadow:
              0 0 20px rgba(0, 221, 255, 0.7),
              0 0 50px rgba(0, 221, 255, 0.4),
              0 0 80px rgba(0, 221, 255, 0.15),
              inset 0 0 20px rgba(0, 221, 255, 0.15);
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
