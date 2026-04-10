"use client";

import { cn } from "@/lib/utils";
import { usePsimStore } from "@/stores/psim-store";

export function CheckpointToggle() {
  const checkpoint = usePsimStore((s) => s.checkpoint);
  const setCheckpoint = usePsimStore((s) => s.setCheckpoint);

  return (
    <div className="flex gap-space-1 bg-white/10 p-space-1 rounded-md">
      <button
        onClick={() => setCheckpoint("woodlands")}
        className={cn(
          "px-space-4 py-space-1 rounded-sm text-label font-semibold transition-colors duration-fast",
          checkpoint === "woodlands"
            ? "bg-ica-blue text-white"
            : "text-white/60 hover:text-white",
        )}
      >
        Woodlands
      </button>
      <button
        onClick={() => setCheckpoint("tuas")}
        className={cn(
          "px-space-4 py-space-1 rounded-sm text-label font-semibold transition-colors duration-fast",
          checkpoint === "tuas"
            ? "bg-ica-blue text-white"
            : "text-white/60 hover:text-white",
        )}
      >
        Tuas
      </button>
    </div>
  );
}
