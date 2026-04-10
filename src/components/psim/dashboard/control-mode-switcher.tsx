"use client";

import { cn } from "@/lib/utils";
import { usePsimStore } from "@/stores/psim-store";
import type { ControlMode } from "@/lib/types";

const modes: ControlMode[] = ["mcp", "rcp", "wrcd"];

const modeLabels: Record<ControlMode, string> = {
  mcp: "MCP",
  rcp: "RCP",
  wrcd: "WRCD",
};

export function ControlModeSwitcher() {
  const controlMode = usePsimStore((s) => s.controlMode);
  const setControlMode = usePsimStore((s) => s.setControlMode);

  return (
    <div className="flex items-center gap-space-2">
      <span className="text-label text-white/60 uppercase tracking-wider">Control</span>
      <div className="flex gap-0.5 bg-black/40 p-0.5 rounded-md border border-ica-blue">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setControlMode(mode)}
            className={cn(
              "px-space-3 py-space-1 rounded-sm text-label font-bold font-mono transition-all duration-fast",
              controlMode === mode
                ? "bg-ica-red text-white shadow-[0_0_8px_rgba(211,40,62,0.6)]"
                : "text-white/60 hover:text-white",
            )}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}
