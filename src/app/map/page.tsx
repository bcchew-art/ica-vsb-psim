"use client";

import { Map, Navigation, Shield, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const checkpoints = [
  {
    id: "WC",
    name: "Woodlands Checkpoint",
    lanes: 28,
    status: "Operational",
    statusColor: "text-status-open",
    dotColor: "bg-status-open",
    barriers: 14,
    activeLanes: 22,
  },
  {
    id: "TC",
    name: "Tuas Checkpoint",
    lanes: 18,
    status: "Operational",
    statusColor: "text-status-open",
    dotColor: "bg-status-open",
    barriers: 10,
    activeLanes: 16,
  },
];

export default function MapPage() {
  return (
    <AppShell>
    <div className="flex flex-col gap-space-5 h-full">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-text-primary font-semibold">Checkpoint Map</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Full geospatial view of VSB installations across all checkpoints
          </p>
        </div>
        <div className="flex items-center gap-space-2 px-space-3 py-space-2 rounded-md bg-surface border border-border">
          <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
          <span className="text-label text-text-secondary">Live Feed Active</span>
        </div>
      </div>

      {/* Map placeholder — takes up remaining height */}
      <div className="flex-1 rounded-lg border border-border bg-surface overflow-hidden relative min-h-[480px]">
        {/* Grid overlay to suggest a map */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#2F5FD0 1px, transparent 1px), linear-gradient(90deg, #2F5FD0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Centre content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-4">
          <div className="w-24 h-24 rounded-full bg-ica-blue/10 border-2 border-ica-blue/20 flex items-center justify-center">
            <Map size={48} className="text-ica-blue/50" />
          </div>
          <div className="text-center">
            <p className="text-h3 text-text-primary font-semibold">
              Geospatial Map Layer
            </p>
            <p className="text-body-sm text-text-secondary mt-1 max-w-xs text-center">
              Interactive checkpoint map with real-time barrier positions,
              camera feeds, and lane status overlays
            </p>
          </div>
          <div className="flex items-center gap-space-2 px-space-3 py-1.5 rounded-full border border-ica-blue/30 bg-ica-blue/5">
            <Navigation size={12} className="text-ica-blue" />
            <span className="text-label text-ica-blue">
              GIS integration pending configuration
            </span>
          </div>
        </div>

        {/* Corner labels to anchor the map feel */}
        <div className="absolute top-space-3 left-space-4 text-label text-text-secondary opacity-50">
          1°27′N 103°46′E
        </div>
        <div className="absolute bottom-space-3 right-space-4 text-label text-text-secondary opacity-50">
          1°20′N 103°38′E
        </div>
      </div>

      {/* Checkpoint summary cards */}
      <div className="grid grid-cols-2 gap-space-4">
        {checkpoints.map((cp) => (
          <div
            key={cp.id}
            className="rounded-lg border border-border bg-surface-elevated p-space-4 flex flex-col gap-space-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-2">
                <div className="w-8 h-8 rounded-md bg-ica-navy flex items-center justify-center">
                  <Shield size={16} className="text-ica-blue" />
                </div>
                <span className="text-h3 text-text-primary">{cp.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cp.dotColor}`} />
                <span className={`text-label ${cp.statusColor}`}>{cp.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-space-3">
              <div className="rounded-md bg-surface p-space-2 text-center">
                <p className="text-h3 text-text-primary">{cp.lanes}</p>
                <p className="text-label text-text-secondary">Total Lanes</p>
              </div>
              <div className="rounded-md bg-surface p-space-2 text-center">
                <p className="text-h3 text-status-open">{cp.activeLanes}</p>
                <p className="text-label text-text-secondary">Active</p>
              </div>
              <div className="rounded-md bg-surface p-space-2 text-center">
                <p className="text-h3 text-text-primary">{cp.barriers}</p>
                <p className="text-label text-text-secondary">Barriers</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AppShell>
  );
}
