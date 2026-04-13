"use client";

import { useState } from "react";
import { Camera, ChevronDown, ChevronUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TwinScene } from "@/components/3d/digital-twin/twin-scene";
import { CctvPanel } from "@/components/psim/site-overview/cctv-panel";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [cctvOpen, setCctvOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-col gap-space-5 h-full">
        {/* Page header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-h2 text-text-primary font-semibold">
              Digital Twin — Tuas Checkpoint
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              3D command view of VSB equipment deployment across the Tuas compound
            </p>
          </div>
          <div className="flex items-center gap-space-3">
            {/* CCTV toggle */}
            <button
              onClick={() => setCctvOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-space-3 py-space-2 rounded-md border text-label font-medium transition-all duration-150",
                cctvOpen
                  ? "bg-[var(--color-ica-navy)] text-white border-[var(--color-ica-navy)]"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-[var(--color-ica-blue)]",
              )}
            >
              <Camera size={14} />
              CCTV Panel
              {cctvOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Live indicator */}
            <div className="flex items-center gap-space-2 px-space-3 py-space-2 rounded-md bg-surface border border-border">
              <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
              <span className="text-label text-text-secondary font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* Digital Twin canvas — fills remaining height */}
        <div className="flex-1 min-h-[600px] rounded-lg overflow-hidden border border-[#1a2a40]">
          <TwinScene />
        </div>

        {/* CCTV Panel — collapsible */}
        {cctvOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 flex-shrink-0">
            <CctvPanel />
          </div>
        )}
      </div>
    </AppShell>
  );
}
