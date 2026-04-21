"use client";

import {
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
  { id: "4B", label: "Zone 4B", description: "Upper-left approach — JB-side entry lanes, mixed vehicle types",           snRange: [3, 4, 5, 6],     hasZoomView: false },
  { id: "5",  label: "Zone 5",  description: "Central compound — primary equipment cluster near main building",           snRange: [7, 13, 14],      hasZoomView: false },
  { id: "5B", label: "Zone 5B", description: "North perimeter — heavy vehicle approach from JB with blocker arrays",     snRange: [15, 16, 17],     hasZoomView: false },
  { id: "6A", label: "Zone 6A", description: "Mid-right gate complex — SG-side egress and entry processing",             snRange: [1, 2, 18, 19],   hasZoomView: false },
  { id: "7",  label: "Zone 7",  description: "Center-right — internal compound road junction and K12 bollards",          snRange: [10, 11, 20, 21], hasZoomView: false },
  { id: "8",  label: "Zone 8",  description: "Lower entry — blocker array S/N 9 (lorry, 3 lanes, SG→CP direction)", snRange: [9],     hasZoomView: true  },
  { id: "9A", label: "Zone 9A", description: "Bottom approach — bridge-level VSB equipment above gantries, lorry lanes", snRange: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], hasZoomView: false },
];

// ─── ZONE 8 EQUIPMENT TYPE (for detail view) ──────────────────────────────────

interface Zone8Equipment {
  id: string;
  sn: number;
  mapRef: string;
  label: string;
  lane: string;
  width: string;
  vehicleType: string;
  cctv: boolean;
  remarks: string;
}

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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        alignItems: "flex-start",
        padding: "4px 0",
        borderBottom: "1px solid #0d1e30",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "10px",
          color: "#4a6a8a",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "11px",
          color: "#a0b8d0",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── EMPTY STATE (overview) ───────────────────────────────────────────────────

function EmptyState({ checkpoint }: { checkpoint: "tuas" | "woodlands" }) {
  // Woodlands summary (static BOQ data — 28 locations, 109 CCTV, 8 zones)
  if (checkpoint === "woodlands") {
    return (
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#4a6a8a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            Checkpoint
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0f0ff" }}>
            Woodlands Checkpoint
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#4a6a8a", marginTop: "2px" }}>
            VSB Equipment Deployment
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <div
            style={{
              flex: 1,
              background: "#0a1828",
              border: "1px solid #1a2a40",
              borderRadius: "6px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>8</div>
            <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Zones</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#0a1828",
              border: "1px solid #1a2a40",
              borderRadius: "6px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>28</div>
            <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Locations</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#0a1828",
              border: "1px solid #1a2a40",
              borderRadius: "6px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>109</div>
            <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>CCTV</div>
          </div>
        </div>

        <div
          style={{
            padding: "10px",
            background: "rgba(0,221,255,0.04)",
            border: "1px solid rgba(0,221,255,0.12)",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#4a6a8a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            Status
          </div>
          <div style={{ fontSize: "10px", color: "#6a8aaa", lineHeight: 1.5 }}>
            Hover any <span style={{ color: "#00ddff" }}>W-zone</span> hotspot to preview. Drill-down view available in v2 — zone names (W1-W8) pending confirmation.
          </div>
        </div>
      </div>
    );
  }

  // Tuas summary (existing)
  const locs = tuasCheckpoint.locations;
  const totalCctv = locs.reduce((s, l) => s + l.cctvPink + l.cctvGreen, 0);

  const typeCounts: Record<string, number> = {};
  for (const loc of locs) {
    typeCounts[loc.type] = (typeCounts[loc.type] ?? 0) + 1;
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "9px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "6px",
          }}
        >
          Checkpoint
        </div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0f0ff" }}>
          Tuas Checkpoint
        </div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#4a6a8a", marginTop: "2px" }}>
          VSB Equipment Deployment
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>7</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Zones</div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>32</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Locations</div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>{totalCctv}</div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>CCTV</div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "9px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "8px",
          }}
        >
          Equipment Types
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Dot color={EQUIPMENT_COLORS[type as keyof typeof EQUIPMENT_COLORS] ?? "#888"} />
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#8899b0" }}>
                  {EQUIPMENT_LABELS[type as keyof typeof EQUIPMENT_LABELS] ?? type}
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#a0b8d0", fontWeight: 600 }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "10px",
          background: "rgba(0,221,255,0.04)",
          border: "1px solid rgba(0,221,255,0.12)",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "9px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "4px",
          }}
        >
          Demo
        </div>
        <div style={{ fontSize: "10px", color: "#6a8aaa", lineHeight: 1.5 }}>
          Click <span style={{ color: "#00ddff" }}>Zone 8</span> on the map to explore the lower entry demo zone with live equipment overlay.
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

  const typeCounts: Record<string, number> = {};
  for (const loc of zoneLocs) {
    typeCounts[loc.type] = (typeCounts[loc.type] ?? 0) + 1;
  }

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#00ccff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: "rgba(0,200,255,0.1)",
              border: "1px solid rgba(0,200,255,0.25)",
              borderRadius: "3px",
              padding: "1px 6px",
            }}
          >
            {zone.label}
          </div>
          {zone.hasZoomView && (
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "9px",
                color: "#00ddff",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "rgba(0,221,255,0.08)",
                border: "1px solid rgba(0,221,255,0.3)",
                borderRadius: "3px",
                padding: "1px 6px",
              }}
            >
              DEMO
            </div>
          )}
        </div>
        <div style={{ fontSize: "10px", color: "#5a7a9a", marginTop: "4px", lineHeight: 1.4 }}>
          {zone.description}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#00ccff", fontFamily: "var(--font-mono), monospace" }}>
            {zoneLocs.length}
          </div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Locations
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#ec4899", fontFamily: "var(--font-mono), monospace" }}>
            {totalPink}
          </div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            At-Sys
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#0a1828",
            border: "1px solid #1a2a40",
            borderRadius: "6px",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#22c55e", fontFamily: "var(--font-mono), monospace" }}>
            {totalGreen}
          </div>
          <div style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Away
          </div>
        </div>
      </div>

      {/* Equipment breakdown */}
      {Object.keys(typeCounts).length > 0 && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#4a6a8a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            Equipment
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {Object.entries(typeCounts).map(([type, count]) => (
              <div
                key={type}
                style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Dot color={EQUIPMENT_COLORS[type as keyof typeof EQUIPMENT_COLORS] ?? "#888"} />
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#8899b0" }}>
                    {EQUIPMENT_LABELS[type as keyof typeof EQUIPMENT_LABELS] ?? type}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#a0b8d0", fontWeight: 600 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enter Zone button */}
      <button
        onClick={zone.hasZoomView ? onEnterZone : undefined}
        disabled={!zone.hasZoomView}
        style={{
          width: "100%",
          padding: "9px",
          borderRadius: "6px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
          cursor: zone.hasZoomView ? "pointer" : "not-allowed",
          transition: "all 200ms",
          background: zone.hasZoomView ? "rgba(0,221,255,0.12)" : "rgba(255,255,255,0.03)",
          border: zone.hasZoomView
            ? "1px solid rgba(0,221,255,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
          color: zone.hasZoomView ? "#00ddff" : "#3a5a7a",
        }}
      >
        {zone.hasZoomView ? "Enter Zone 8 →" : "Zoom View Coming Soon"}
      </button>
    </div>
  );
}

// ─── ZONE 8 EQUIPMENT PANEL ───────────────────────────────────────────────────

function Zone8EquipPanel({ equip }: { equip: Zone8Equipment }) {
  const isBlocker = equip.label.includes("Blocker");
  const color = isBlocker ? "#00ddff" : "#f59e0b";

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Dot color={color} size={12} />
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: color,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {equip.label}
          </span>
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e0f0ff" }}>
          Map {equip.mapRef} — {equip.lane}
        </div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#5a7a9a", marginTop: "2px" }}>
          S/N {equip.sn}
        </div>
      </div>

      <div>
        <Row label="Direction" value={equip.remarks} />
        <Row label="Lane Width" value={equip.width} />
        <Row label="Vehicle" value={equip.vehicleType} />
        <Row label="CCTV" value={equip.cctv ? "Yes" : "No"} />
      </div>

      {isBlocker && (
        <div
          style={{
            padding: "8px 10px",
            background: "rgba(0,221,255,0.05)",
            border: "1px solid rgba(0,221,255,0.15)",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#4a6a8a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "3px",
            }}
          >
            Spec
          </div>
          <div style={{ fontSize: "10px", color: "#6a8aaa", lineHeight: 1.5 }}>
            3M shallow-mount blocker · K4/K8 rated · hydraulic actuation · pneumatic failsafe
          </div>
        </div>
      )}

      {!isBlocker && (
        <div
          style={{
            padding: "8px 10px",
            background: "rgba(245,158,11,0.05)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "9px",
              color: "#4a6a8a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "3px",
            }}
          >
            Remark
          </div>
          <div style={{ fontSize: "10px", color: "#6a8aaa", lineHeight: 1.5 }}>
            SG→CP direction · Lorry vehicle class · 3M blocker specification
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN DETAIL PANEL ────────────────────────────────────────────────────────

interface DetailPanelProps {
  view: "overview" | "zone";
  checkpoint: "tuas" | "woodlands";
  selectedZone: string | null;
  selectedEquipment: Zone8Equipment | null;
  onEnterZone: () => void;
}

export function DetailPanel({ view, checkpoint, selectedZone, selectedEquipment, onEnterZone }: DetailPanelProps) {
  return (
    <div
      style={{
        width: "320px",
        minWidth: "320px",
        flexShrink: 0,
        background: "#0a1020",
        borderLeft: "1px solid #1a2a40",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "9px",
            color: "#4a6a8a",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {view === "zone"
            ? "Zone 8 — Equipment"
            : checkpoint === "woodlands"
              ? "Woodlands — Overview"
              : "Detail Panel"}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "zone" && selectedEquipment ? (
          <Zone8EquipPanel equip={selectedEquipment} />
        ) : view === "zone" ? (
          <div style={{ padding: "16px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "10px",
                color: "#4a6a8a",
                lineHeight: 1.6,
              }}
            >
              Click an equipment marker on the Zone 8 image to inspect details.
            </div>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Blocker 3M Lane A", color: "#00ddff", desc: "Map 9E · Lorry · 3.5m" },
                { label: "Blocker 3M Lane B", color: "#00ddff", desc: "Map 9E · Lorry · 3.7m" },
                { label: "Blocker 3M Lane C", color: "#00ddff", desc: "Map 9E · Lorry · 3.4m" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "6px 8px",
                    background: "#0a1828",
                    border: "1px solid #1a2a40",
                    borderRadius: "5px",
                  }}
                >
                  <Dot color={item.color} size={8} />
                  <div>
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#a0b8d0" }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", color: "#4a6a8a", marginTop: "1px" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : checkpoint === "tuas" && selectedZone ? (
          <ZonePanel zoneId={selectedZone} onEnterZone={onEnterZone} />
        ) : (
          <EmptyState checkpoint={checkpoint} />
        )}
      </div>
    </div>
  );
}
