"use client";

import { useState, useCallback } from "react";
import { Shield, MapPin, Camera, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CheckpointData,
  EquipmentLocation,
  EquipmentType,
  EQUIPMENT_COLORS,
  EQUIPMENT_LABELS,
  tuasCheckpoint,
  woodlandsCheckpoint,
} from "@/lib/checkpoint-data";

// ─── TUAS SVG LAYOUT ─────────────────────────────────────────────────────────

function TuasCompound() {
  return (
    <g>
      {/* Compound oval fill */}
      <ellipse cx="500" cy="400" rx="390" ry="265" fill="#eef1f6" stroke="#d1d5db" strokeWidth="2" />

      {/* Entry road from LEFT (JB side) */}
      <rect x="0" y="370" width="115" height="60" fill="#d1d5db" />
      {/* Exit road to RIGHT (SG side) */}
      <rect x="885" y="370" width="115" height="60" fill="#d1d5db" />

      {/* Bridge/level 3 road — left side, angled upward */}
      <path d="M 115 400 L 115 380 L 60 220 L 100 215" stroke="#d1d5db" strokeWidth="24" fill="none" strokeLinecap="round" />

      {/* Internal road — horizontal through center */}
      <rect x="115" y="378" width="770" height="44" fill="#c9ced6" opacity="0.6" />

      {/* Building blocks center */}
      <rect x="440" y="340" width="130" height="70" rx="6" fill="#dde2ea" stroke="#b5bcc9" strokeWidth="1.5" />
      <rect x="390" y="420" width="220" height="65" rx="6" fill="#dde2ea" stroke="#b5bcc9" strokeWidth="1.5" />

      {/* Road direction labels */}
      <text x="28" y="368" fill="#374151" fontSize="13" fontWeight="600">TO JB</text>
      <text x="895" y="368" fill="#374151" fontSize="13" fontWeight="600">TO SG</text>

      {/* Bridge label */}
      <text x="62" y="205" fill="#6b7280" fontSize="11" fontWeight="500" transform="rotate(-70 62 205)">Lvl 3 Bridge</text>

      {/* Checkpoint name */}
      <text x="500" y="760" textAnchor="middle" fill="#6b7280" fontSize="13" fontWeight="500">
        Tuas Checkpoint — Ground &amp; Bridge Level
      </text>
    </g>
  );
}

function WoodlandsCompound() {
  return (
    <g>
      {/* Trapezoid compound fill — wider at top (JB), narrower at bottom (SG) */}
      <polygon
        points="100,120 900,120 750,700 250,700"
        fill="#eef1f6"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Entry roads from TOP (JB approach) */}
      <rect x="280" y="50" width="130" height="75" fill="#d1d5db" />
      <rect x="440" y="50" width="120" height="75" fill="#d1d5db" />
      <rect x="590" y="50" width="130" height="75" fill="#d1d5db" />

      {/* Exit roads at BOTTOM (SG) */}
      <rect x="300" y="700" width="110" height="60" fill="#d1d5db" />
      <rect x="450" y="700" width="100" height="60" fill="#d1d5db" />
      <rect x="590" y="700" width="110" height="60" fill="#d1d5db" />

      {/* Bridge/Lvl2 — left edge */}
      <rect x="110" y="180" width="55" height="320" rx="4" fill="#d1d5db" />
      {/* Bridge/Lvl2 — right edge */}
      <rect x="835" y="180" width="55" height="320" rx="4" fill="#d1d5db" />

      {/* Lane dividers — vertical lines through compound */}
      <line x1="370" y1="120" x2="290" y2="700" stroke="#c4c9d4" strokeWidth="1.5" strokeDasharray="6,4" />
      <line x1="500" y1="120" x2="500" y2="700" stroke="#c4c9d4" strokeWidth="1.5" strokeDasharray="6,4" />
      <line x1="630" y1="120" x2="710" y2="700" stroke="#c4c9d4" strokeWidth="1.5" strokeDasharray="6,4" />

      {/* Central building complex */}
      <rect x="330" y="380" width="340" height="160" rx="8" fill="#dde2ea" stroke="#b5bcc9" strokeWidth="1.5" />
      <text x="500" y="467" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="500">ICA Building</text>

      {/* Lane labels at top */}
      <text x="345" y="107" textAnchor="middle" fill="#6b7280" fontSize="11">Car</text>
      <text x="500" y="107" textAnchor="middle" fill="#6b7280" fontSize="11">Bus</text>
      <text x="660" y="107" textAnchor="middle" fill="#6b7280" fontSize="11">Lorry</text>

      {/* Direction labels */}
      <text x="500" y="42" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">TO JB (MALAYSIA)</text>
      <text x="500" y="772" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">TO SG (SINGAPORE)</text>

      {/* Left bridge label */}
      <text x="138" y="345" fill="#6b7280" fontSize="10" fontWeight="500" transform="rotate(90 138 345)">Lvl 2 Bridge</text>
      {/* Right bridge label */}
      <text x="862" y="345" fill="#6b7280" fontSize="10" fontWeight="500" transform="rotate(-90 862 345)">Lvl 2 Bridge</text>

      {/* Checkpoint name */}
      <text x="500" y="800" textAnchor="middle" fill="#6b7280" fontSize="13" fontWeight="500">
        Woodlands Checkpoint — Ground &amp; Bridge Level
      </text>
    </g>
  );
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  loc: EquipmentLocation;
}

// ─── EQUIPMENT MARKERS ────────────────────────────────────────────────────────

interface MarkersProps {
  locations: EquipmentLocation[];
  selected: EquipmentLocation | null;
  hovered: number | null;
  onSelect: (loc: EquipmentLocation) => void;
  onHover: (sn: number | null, evt?: React.MouseEvent) => void;
}

function EquipmentMarkers({ locations, selected, hovered, onSelect, onHover }: MarkersProps) {
  return (
    <g>
      {locations.map((loc) => {
        const color = EQUIPMENT_COLORS[loc.type];
        const isSelected = selected?.sn === loc.sn;
        const isHovered = hovered === loc.sn;
        const r = isSelected ? 11 : isHovered ? 9 : 7;

        return (
          <g
            key={`${loc.sn}-${loc.mapRef}`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(loc)}
            onMouseEnter={(e) => onHover(loc.sn, e)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Pulsing ring for selected */}
            {isSelected && (
              <>
                <circle cx={loc.x} cy={loc.y} r={18} fill="none" stroke={color} strokeWidth="2" opacity="0.4">
                  <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </>
            )}
            {/* Shadow */}
            <circle cx={loc.x + 1} cy={loc.y + 1} r={r} fill="rgba(0,0,0,0.2)" />
            {/* Main marker */}
            <circle
              cx={loc.x}
              cy={loc.y}
              r={r}
              fill={color}
              stroke="white"
              strokeWidth={isSelected ? 2.5 : 1.5}
              style={{ transition: "r 0.15s ease" }}
            />
            {/* CCTV indicator dot */}
            {(loc.cctv === "Y" || loc.cctv === "E") && (
              <circle cx={loc.x + 5} cy={loc.y - 5} r={3} fill="#EC4899" stroke="white" strokeWidth="1" />
            )}
          </g>
        );
      })}
    </g>
  );
}

// ─── MAP LEGEND ───────────────────────────────────────────────────────────────

const LEGEND_ITEMS: { type: EquipmentType; label: string }[] = [
  { type: "blocker", label: "Blocker" },
  { type: "k12-dab", label: "K12 Drop Arm" },
  { type: "road-hump", label: "Road Hump" },
  { type: "sliding-bollard", label: "Sliding Bollard" },
  { type: "auto-bollard", label: "Auto Bollard" },
  { type: "crash-barrier", label: "Crash Barrier" },
  { type: "k12-fixed-bollard", label: "K12 Fixed Bollard" },
  { type: "non-crash-barrier", label: "Non-Crash Barrier" },
];

function MapLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
      {LEGEND_ITEMS.map(({ type, label }) => (
        <div key={type} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: EQUIPMENT_COLORS[type] }}
          />
          <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full flex-shrink-0 bg-pink-500" />
        <span className="text-xs text-[var(--text-secondary)]">CCTV (pink dot)</span>
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  selected: EquipmentLocation | null;
  checkpoint: CheckpointData;
}

function DetailPanel({ selected, checkpoint }: DetailPanelProps) {
  if (!selected) {
    // Summary stats
    const typeCounts: Partial<Record<EquipmentType, number>> = {};
    for (const loc of checkpoint.locations) {
      typeCounts[loc.type] = (typeCounts[loc.type] ?? 0) + 1;
    }
    const cctvCount = checkpoint.locations.filter((l) => l.cctv === "Y" || l.cctv === "E").length;
    const groundCount = checkpoint.locations.filter((l) => l.installLocation === "Ground").length;
    const bridgeCount = checkpoint.locations.filter((l) => l.installLocation === "Bridge").length;
    const buildingCount = checkpoint.locations.filter((l) => l.installLocation === "Building").length;

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={16} className="text-[var(--color-ica-blue)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">{checkpoint.name}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">{checkpoint.totalEquipment}</p>
            <p className="text-xs text-[var(--text-secondary)]">Locations</p>
          </div>
          <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2 text-center">
            <p className="text-lg font-bold text-pink-500">{cctvCount}</p>
            <p className="text-xs text-[var(--text-secondary)]">CCTV Locations</p>
          </div>
        </div>

        {/* Install location breakdown */}
        <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Install Location</p>
          <div className="space-y-1.5">
            {[
              { label: "Ground Level", count: groundCount, color: "bg-[var(--color-ica-blue)]" },
              { label: "Bridge / Lvl 2-3", count: bridgeCount, color: "bg-violet-500" },
              { label: "Within Building", count: buildingCount, color: "bg-amber-500" },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-[var(--text-secondary)]">{label}</span>
                  <span className="font-medium text-[var(--text-primary)]">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", color)}
                    style={{ width: `${(count / checkpoint.totalEquipment) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment type breakdown */}
        <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Equipment Types</p>
          <div className="space-y-1">
            {Object.entries(typeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: EQUIPMENT_COLORS[type as EquipmentType] }}
                    />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {EQUIPMENT_LABELS[type as EquipmentType]}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-1">
          <Info size={11} />
          Click a marker to view details
        </p>
      </div>
    );
  }

  // Selected location detail
  const color = EQUIPMENT_COLORS[selected.type];

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="rounded-md p-2.5" style={{ backgroundColor: color + "18", border: `1px solid ${color}40` }}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">S/N {selected.sn}</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: color, color: "white" }}
          >
            {selected.mapRef}
          </span>
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{EQUIPMENT_LABELS[selected.type]}</p>
      </div>

      {/* Details grid */}
      <div className="space-y-2">
        <DetailRow label="Direction" value={selected.direction} />
        <DetailRow label="Vehicle Type" value={selected.vehicleType} />
        <DetailRow
          label="Lanes"
          value={selected.lanes.join(", ")}
          suffix={`(${selected.laneWidth.toFixed(1)}m avg)`}
        />
        <DetailRow
          label="Install Location"
          value={selected.installLocation}
          badge
          badgeColor={
            selected.installLocation === "Ground"
              ? "bg-blue-100 text-blue-700"
              : selected.installLocation === "Bridge"
              ? "bg-violet-100 text-violet-700"
              : "bg-amber-100 text-amber-700"
          }
        />
      </div>

      {/* CCTV status */}
      <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-medium text-[var(--text-secondary)]">CCTV Status</p>
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              selected.cctv === "Y"
                ? "bg-green-100 text-green-700"
                : selected.cctv === "E"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {selected.cctv === "Y" ? "New" : selected.cctv === "E" ? "Existing" : "None"}
          </span>
        </div>
        {(selected.cctv === "Y" || selected.cctv === "E") && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Camera size={12} className="text-pink-500" />
              <span className="text-xs text-[var(--text-secondary)]">At System:</span>
              <span className="text-xs font-semibold text-pink-600">{selected.cctvPink}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera size={12} className="text-green-500" />
              <span className="text-xs text-[var(--text-secondary)]">Away:</span>
              <span className="text-xs font-semibold text-green-600">{selected.cctvGreen}</span>
            </div>
          </div>
        )}
      </div>

      {/* Remarks */}
      {selected.remarks && (
        <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] p-2">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Remarks</p>
          <p className="text-xs text-[var(--text-primary)]">{selected.remarks}</p>
        </div>
      )}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  suffix?: string;
  badge?: boolean;
  badgeColor?: string;
}

function DetailRow({ label, value, suffix, badge, badgeColor }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">{label}</span>
      <div className="flex items-center gap-1 text-right">
        {badge ? (
          <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", badgeColor)}>{value}</span>
        ) : (
          <span className="text-xs font-medium text-[var(--text-primary)]">{value}</span>
        )}
        {suffix && <span className="text-xs text-[var(--text-secondary)]">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function SiteOverview() {
  const [activeCheckpoint, setActiveCheckpoint] = useState<"tuas" | "woodlands">("tuas");
  const [selected, setSelected] = useState<EquipmentLocation | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const checkpoint = activeCheckpoint === "tuas" ? tuasCheckpoint : woodlandsCheckpoint;

  const handleSelect = useCallback((loc: EquipmentLocation) => {
    setSelected((prev) => (prev?.sn === loc.sn ? null : loc));
  }, []);

  const handleHover = useCallback(
    (sn: number | null, evt?: React.MouseEvent) => {
      setHovered(sn);
      if (sn !== null && evt) {
        const loc = checkpoint.locations.find((l) => l.sn === sn);
        if (loc) {
          const rect = (evt.currentTarget as SVGElement)
            .closest("svg")
            ?.getBoundingClientRect();
          if (rect) {
            setTooltip({ x: evt.clientX - rect.left, y: evt.clientY - rect.top - 12, loc });
          }
        }
      } else {
        setTooltip(null);
      }
    },
    [checkpoint.locations]
  );

  const handleTabChange = (id: "tuas" | "woodlands") => {
    setActiveCheckpoint(id);
    setSelected(null);
    setTooltip(null);
    setHovered(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Checkpoint tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] self-start">
        {(["tuas", "woodlands"] as const).map((id) => {
          const cp = id === "tuas" ? tuasCheckpoint : woodlandsCheckpoint;
          return (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150",
                activeCheckpoint === id
                  ? "bg-[var(--color-ica-navy)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
              )}
            >
              <Shield size={14} />
              {cp.name}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                  activeCheckpoint === id
                    ? "bg-white/20 text-white"
                    : "bg-[var(--border)] text-[var(--text-secondary)]"
                )}
              >
                {cp.totalEquipment}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content: map + detail panel */}
      <div className="flex gap-4">
        {/* SVG Map canvas */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div
            className="relative rounded-lg border border-[var(--border)] overflow-hidden bg-[#f5f7fa]"
            style={{ aspectRatio: "1000/820" }}
            onClick={(e) => {
              // Deselect if clicking canvas background
              if ((e.target as Element).tagName === "svg" || (e.target as Element).tagName === "ellipse" || (e.target as Element).tagName === "polygon" || (e.target as Element).tagName === "rect") {
                setSelected(null);
              }
            }}
          >
            <svg
              viewBox="0 0 1000 820"
              className="w-full h-full"
              style={{ display: "block" }}
            >
              {/* Compound outline */}
              {activeCheckpoint === "tuas" ? <TuasCompound /> : <WoodlandsCompound />}

              {/* Equipment markers */}
              <EquipmentMarkers
                locations={checkpoint.locations}
                selected={selected}
                hovered={hovered}
                onSelect={handleSelect}
                onHover={handleHover}
              />

              {/* SVG Tooltip */}
              {tooltip && (
                <g style={{ pointerEvents: "none" }}>
                  <rect
                    x={Math.min(tooltip.x, 820)}
                    y={Math.max(tooltip.y - 38, 4)}
                    width="168"
                    height="34"
                    rx="5"
                    fill="#1a1d23"
                    opacity="0.92"
                  />
                  <text
                    x={Math.min(tooltip.x, 820) + 8}
                    y={Math.max(tooltip.y - 38, 4) + 13}
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {tooltip.loc.mapRef} — S/N {tooltip.loc.sn}
                  </text>
                  <text
                    x={Math.min(tooltip.x, 820) + 8}
                    y={Math.max(tooltip.y - 38, 4) + 27}
                    fill="#9ca3af"
                    fontSize="10"
                  >
                    {EQUIPMENT_LABELS[tooltip.loc.type]}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Legend</p>
            <MapLegend />
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="flex-shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3 overflow-y-auto"
          style={{ width: "300px", maxHeight: "620px" }}
        >
          <DetailPanel selected={selected} checkpoint={checkpoint} />
        </div>
      </div>
    </div>
  );
}
