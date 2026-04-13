"use client";

import { useState } from "react";
import { Map, Camera, ChevronDown, ChevronUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SiteOverview } from "@/components/psim/site-overview/site-overview";
import { CctvPanel } from "@/components/psim/site-overview/cctv-panel";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [cctvOpen, setCctvOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-col gap-space-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-text-primary font-semibold">Site Overview</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Schematic map of VSB equipment across Tuas and Woodlands checkpoints
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
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-[var(--color-ica-blue)]"
              )}
            >
              <Camera size={14} />
              CCTV Panel
              {cctvOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Live indicator */}
            <div className="flex items-center gap-space-2 px-space-3 py-space-2 rounded-md bg-surface border border-border">
              <span className="w-2 h-2 rounded-full bg-status-open animate-pulse" />
              <span className="text-label text-text-secondary">Live Feed Active</span>
            </div>
          </div>
        </div>

        {/* Site Overview map */}
        <SiteOverview />

        {/* CCTV Panel — collapsible */}
        {cctvOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <CctvPanel />
          </div>
        )}
      </div>
    </AppShell>
  );
}
