"use client";

import { useState, useMemo } from "react";
import { Camera, ChevronDown, ChevronUp, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  tuasCheckpoint,
  woodlandsCheckpoint,
  EquipmentLocation,
  EQUIPMENT_LABELS,
} from "@/lib/checkpoint-data";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type CameraType = "pink" | "green";

interface CameraEntry {
  id: string;
  mapRef: string;
  checkpoint: "tuas" | "woodlands";
  checkpointLabel: string;
  cameraType: CameraType;
  cameraIndex: number;
  online: boolean;
  loc: EquipmentLocation;
}

// ─── DERIVE CAMERA ENTRIES ────────────────────────────────────────────────────

function derivecameras(): CameraEntry[] {
  const entries: CameraEntry[] = [];

  // Deterministic pseudo-random online status (~90% online)
  const isOnline = (seed: number) => (seed * 7 + 3) % 10 !== 0;

  let globalIdx = 0;

  for (const [cpId, cp] of [
    ["tuas", tuasCheckpoint],
    ["woodlands", woodlandsCheckpoint],
  ] as const) {
    for (const loc of cp.locations) {
      if (loc.cctv === "N") continue;

      for (let i = 0; i < loc.cctvPink; i++) {
        entries.push({
          id: `${cpId}-${loc.mapRef}-pink-${i}`,
          mapRef: loc.mapRef,
          checkpoint: cpId,
          checkpointLabel: cp.name,
          cameraType: "pink",
          cameraIndex: i + 1,
          online: isOnline(globalIdx++),
          loc,
        });
      }

      for (let i = 0; i < loc.cctvGreen; i++) {
        entries.push({
          id: `${cpId}-${loc.mapRef}-green-${i}`,
          mapRef: loc.mapRef,
          checkpoint: cpId,
          checkpointLabel: cp.name,
          cameraType: "green",
          cameraIndex: i + 1,
          online: isOnline(globalIdx++),
          loc,
        });
      }
    }
  }

  return entries;
}

const ALL_CAMERAS = derivecameras();

// ─── CAMERA CARD ──────────────────────────────────────────────────────────────

function CameraCard({ cam }: { cam: CameraEntry }) {
  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--surface-elevated)] flex flex-col">
      {/* Feed placeholder */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "110px", background: "#1a1d23" }}
      >
        {/* Scanline overlay for realism */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)",
          }}
        />
        {/* Camera icon */}
        <div className="flex flex-col items-center gap-1.5 z-10">
          <Camera size={24} className="text-white/30" />
          <span className="text-xs text-white/20 font-mono">
            CAM {cam.mapRef}-{cam.cameraType === "pink" ? "A" : "B"}{cam.cameraIndex}
          </span>
        </div>
        {/* Status indicator top-right */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {cam.online ? (
            <Wifi size={10} className="text-green-400" />
          ) : (
            <WifiOff size={10} className="text-gray-500" />
          )}
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              cam.online ? "bg-green-400" : "bg-gray-500"
            )}
          />
        </div>
        {/* Checkpoint badge top-left */}
        <div className="absolute top-2 left-2">
          <span className="text-xs font-semibold text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
            {cam.checkpoint === "tuas" ? "TC" : "WC"}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-2 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
            Map {cam.mapRef}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0",
              cam.cameraType === "pink"
                ? "bg-pink-100 text-pink-700"
                : "bg-green-100 text-green-700"
            )}
          >
            {cam.cameraType === "pink" ? "At System" : "Away"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)] truncate">
            {EQUIPMENT_LABELS[cam.loc.type]}
          </span>
          <span
            className={cn(
              "text-xs",
              cam.online ? "text-green-600" : "text-gray-400"
            )}
          >
            {cam.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CCTV PANEL ──────────────────────────────────────────────────────────

const DEFAULT_SHOW = 12;

export function CctvPanel() {
  const [expanded, setExpanded] = useState(false);
  const [filterCheckpoint, setFilterCheckpoint] = useState<"all" | "tuas" | "woodlands">("all");
  const [filterType, setFilterType] = useState<"all" | "pink" | "green">("all");

  const filtered = useMemo(() => {
    return ALL_CAMERAS.filter((c) => {
      if (filterCheckpoint !== "all" && c.checkpoint !== filterCheckpoint) return false;
      if (filterType !== "all" && c.cameraType !== filterType) return false;
      return true;
    });
  }, [filterCheckpoint, filterType]);

  const displayed = expanded ? filtered : filtered.slice(0, DEFAULT_SHOW);
  const totalPink = ALL_CAMERAS.filter((c) => c.cameraType === "pink").length;
  const totalGreen = ALL_CAMERAS.filter((c) => c.cameraType === "green").length;
  const onlineCount = ALL_CAMERAS.filter((c) => c.online).length;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]">
      {/* Panel header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--color-ica-navy)] flex items-center justify-center flex-shrink-0">
            <Camera size={16} className="text-[var(--color-ica-blue)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">CCTV Camera Grid</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {ALL_CAMERAS.length} total —{" "}
              <span className="text-green-600 font-medium">{onlineCount} online</span>,{" "}
              <span className="text-gray-400">{ALL_CAMERAS.length - onlineCount} offline</span>
            </p>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-xs font-medium text-pink-700">{totalPink} At System</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">{totalGreen} Away</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
        <span className="text-xs text-[var(--text-secondary)] font-medium">Filter:</span>

        {/* Checkpoint filter */}
        <div className="flex items-center gap-1">
          {(["all", "tuas", "woodlands"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setFilterCheckpoint(val)}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                filterCheckpoint === val
                  ? "bg-[var(--color-ica-navy)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--border)]"
              )}
            >
              {val === "all" ? "All" : val === "tuas" ? "Tuas" : "Woodlands"}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-[var(--border)]" />

        {/* Camera type filter */}
        <div className="flex items-center gap-1">
          {(["all", "pink", "green"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setFilterType(val)}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                filterType === val
                  ? "bg-[var(--color-ica-navy)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--border)]"
              )}
            >
              {val === "all" ? "All Types" : val === "pink" ? "At System" : "Away"}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-[var(--text-secondary)]">
          Showing {displayed.length} of {filtered.length}
        </span>
      </div>

      {/* Camera grid */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Camera size={32} className="text-[var(--text-secondary)] opacity-30" />
            <p className="text-sm text-[var(--text-secondary)]">No cameras match the current filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {displayed.map((cam) => (
              <CameraCard key={cam.id} cam={cam} />
            ))}
          </div>
        )}

        {/* Show more / show less */}
        {filtered.length > DEFAULT_SHOW && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-md border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} /> Show fewer cameras
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show all ({filtered.length} cameras)
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
