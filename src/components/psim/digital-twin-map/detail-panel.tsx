"use client";

import {
  EquipmentLocation,
  EQUIPMENT_COLORS,
  EQUIPMENT_LABELS,
  tuasCheckpoint,
} from "@/lib/checkpoint-data";

// ─── ZONE DEFINITIONS ─────────────────────────────────────────────────────────

interface ZoneDef {
  id: string;
  label: string;
  description: string;
  snRange: number[];
  hasZoomView: boolean;
}

export const ZONE_DEFINITIONS: ZoneDef[] = [
  { id: "A", label: "WEST ENTRY", description: "JB-side vehicle entry lanes — lorry & car approach from Tuas Second Link", snRange: [14, 15, 16, 17], hasZoomView: false },
  { id: "B", label: "SOUTH APPROACH", description: "Southern perimeter approach — mixed vehicle flow", snRange: [18, 19, 20], hasZoomView: false },
  { id: "C", label: "EAST GATE", description: "East gate complex — SG-side egress with blocker arrays and K12 barriers", snRange: [9, 10, 11, 12], hasZoomView: true },
  { id: "D", label: "NORTH RETURN", description: "Northern return road — CP to SG heavy vehicle exit", snRange: [1, 2, 3, 4], hasZoomView: false },
  { id: "E", label: "INTERNAL", description: "Internal compound — within-building equipment and office gates", snRange: [5, 6, 7, 8], hasZoomView: false },
  { id: "F", label: "BRIDGE L3", description: "Level 3 bridge approaches — elevated VSB equipment mounted above gantries", snRange: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], hasZoomView: false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: 0,
        boxShadow: `0 0 4px ${color}80`,
      }}
    />
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "flex-start", padding: "4px 0", borderBottom: "1px solid #0d1e30" }}>
      <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#a0b8d0", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState() {
  const locs = tuasCheckpoint.locations;
  const totalCctv = locs.reduce((s, l) => s + l.cctvPink + l.cctvGreen, 0);

  // Equipment type breakdown
  const typeCounts: Record<string, number> = {};
  for (const loc of locs) {
    typeCounts[loc.type] = (typeCounts[loc.type] ?? 0) + 1;
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
          Checkpoint
        </div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0f0ff" }}>
          Tuas Checkpoint
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#4a6a8a", marginTop: "2px" }}>
          VSB Equipment Deployment
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flex: 1, background: "#0a1828", border: "1px solid #1a2a40", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "monospace" }}>32</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Locations</div>
        </div>
        <div style={{ flex: 1, background: "#0a1828", border: "1px solid #1a2a40", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "monospace" }}>{totalCctv}</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>CCTV Cams</div>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
          Equipment Types
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Dot color={EQUIPMENT_COLORS[type as keyof typeof EQUIPMENT_COLORS] ?? "#888"} />
                <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#8899b0" }}>
                  {EQUIPMENT_LABELS[type as keyof typeof EQUIPMENT_LABELS] ?? type}
                </span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#a0b8d0", fontWeight: 600 }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px", background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.1)", borderRadius: "6px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
          Tip
        </div>
        <div style={{ fontSize: "10px", color: "#6a8aaa", lineHeight: 1.5 }}>
          Click a zone on the map to view details. Zone C (East Gate) has a zoomed view.
        </div>
      </div>
    </div>
  );
}

// ─── ZONE PANEL ───────────────────────────────────────────────────────────────

function ZonePanel({ zoneId, onEnterZone }: { zoneId: string; onEnterZone: () => void }) {
  const zone = ZONE_DEFINITIONS.find((z) => z.id === zoneId);
  if (!zone) return null;

  const zoneLocs = tuasCheckpoint.locations.filter((l) => zone.snRange.includes(l.sn));
  const totalPink = zoneLocs.reduce((s, l) => s + l.cctvPink, 0);
  const totalGreen = zoneLocs.reduce((s, l) => s + l.cctvGreen, 0);

  // Count by type
  const typeCounts: Record<string, number> = {};
  for (const loc of zoneLocs) {
    typeCounts[loc.type] = (typeCounts[loc.type] ?? 0) + 1;
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{
            fontFamily: "monospace", fontSize: "9px", color: "#00ccff",
            textTransform: "uppercase", letterSpacing: "0.1em",
            background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.25)",
            borderRadius: "3px", padding: "1px 6px",
          }}>
            Zone {zone.id}
          </div>
          {zone.hasZoomView && (
            <div style={{
              fontFamily: "monospace", fontSize: "9px", color: "#00ddff",
              textTransform: "uppercase", letterSpacing: "0.08em",
              background: "rgba(0,221,255,0.08)", border: "1px solid rgba(0,221,255,0.3)",
              borderRadius: "3px", padding: "1px 6px",
            }}>
              DEMO
            </div>
          )}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e0f0ff" }}>{zone.label}</div>
        <div style={{ fontSize: "10px", color: "#5a7a9a", marginTop: "4px", lineHeight: 1.4 }}>
          {zone.description}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flex: 1, background: "#0a1828", border: "1px solid #1a2a40", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#00ccff", fontFamily: "monospace" }}>{zoneLocs.length}</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Locations</div>
        </div>
        <div style={{ flex: 1, background: "#0a1828", border: "1px solid #1a2a40", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#ec4899", fontFamily: "monospace" }}>{totalPink}</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>At-Sys</div>
        </div>
        <div style={{ flex: 1, background: "#0a1828", border: "1px solid #1a2a40", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>{totalGreen}</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Away</div>
        </div>
      </div>

      {/* Equipment breakdown */}
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
          Equipment
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Dot color={EQUIPMENT_COLORS[type as keyof typeof EQUIPMENT_COLORS] ?? "#888"} />
                <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#8899b0" }}>
                  {EQUIPMENT_LABELS[type as keyof typeof EQUIPMENT_LABELS] ?? type}
                </span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#a0b8d0", fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enter Zone button */}
      <button
        onClick={zone.hasZoomView ? onEnterZone : undefined}
        disabled={!zone.hasZoomView}
        style={{
          width: "100%",
          padding: "9px",
          borderRadius: "6px",
          fontFamily: "monospace",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
          cursor: zone.hasZoomView ? "pointer" : "not-allowed",
          transition: "all 200ms",
          background: zone.hasZoomView ? "rgba(0,200,255,0.12)" : "rgba(255,255,255,0.03)",
          border: zone.hasZoomView ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
          color: zone.hasZoomView ? "#00ccff" : "#3a5a7a",
        }}
      >
        {zone.hasZoomView ? "Enter Zone →" : "Zoom View Unavailable"}
      </button>
    </div>
  );
}

// ─── EQUIPMENT PANEL ──────────────────────────────────────────────────────────

function EquipmentPanel({ location }: { location: EquipmentLocation }) {
  const color = EQUIPMENT_COLORS[location.type] ?? "#888";

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Dot color={color} size={12} />
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: color, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {EQUIPMENT_LABELS[location.type]}
          </span>
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e0f0ff" }}>
          Map {location.mapRef}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#5a7a9a", marginTop: "2px" }}>
          S/N {location.sn}
        </div>
      </div>

      <div>
        <Row label="Direction" value={location.direction} />
        <Row label="Install" value={location.installLocation} />
        <Row label="Vehicle" value={location.vehicleType} />
        <Row label="Lanes" value={location.lanes.join(", ")} />
        <Row label="Lane Width" value={`${location.laneWidth}m`} />
      </div>

      {/* CCTV */}
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
          CCTV
        </div>
        {location.cctv === "N" ? (
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#3a5a7a" }}>No cameras at this location</div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Dot color="#ec4899" />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#8899b0" }}>
                {location.cctvPink} At-System
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Dot color="#22c55e" />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#8899b0" }}>
                {location.cctvGreen} Away
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Remarks */}
      {location.remarks && (
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
            Remarks
          </div>
          <div style={{ fontSize: "10px", color: "#5a7a9a", lineHeight: 1.5 }}>
            {location.remarks}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN DETAIL PANEL ────────────────────────────────────────────────────────

interface DetailPanelProps {
  selectedZone: string | null;
  selectedEquipment: string | null;
  onEnterZone: () => void;
}

export function DetailPanel({ selectedZone, selectedEquipment, onEnterZone }: DetailPanelProps) {
  const equipment = selectedEquipment
    ? tuasCheckpoint.locations.find((l) => String(l.sn) === selectedEquipment)
    : null;

  return (
    <div
      style={{
        width: "280px",
        flexShrink: 0,
        background: "#0a1020",
        borderLeft: "1px solid #1a2a40",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #1a2a40",
          background: "#070e1c",
          flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Detail Panel
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {equipment ? (
          <EquipmentPanel location={equipment} />
        ) : selectedZone ? (
          <ZonePanel zoneId={selectedZone} onEnterZone={onEnterZone} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
