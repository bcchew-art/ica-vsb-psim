"use client";

import { cn } from "@/lib/utils";
import { usePsimStore } from "@/stores/psim-store";
import type { Equipment, EquipmentStatus, EquipmentType } from "@/lib/types";

// CSS variable names for status colors (see DESIGN-SYSTEM.md Tailwind v4 gotcha)
const statusVar: Record<EquipmentStatus, string> = {
  secured: "var(--color-status-secured)",
  open: "var(--color-status-open)",
  transit: "var(--color-status-transit)",
  fault: "var(--color-status-fault)",
  offline: "var(--color-status-offline)",
};

// Determine marker shape by equipment type
function isSquareShape(type: EquipmentType): boolean {
  return type === "drop-arm-barrier" || type === "rising-step";
}

interface Props {
  laneNumber: number;
  equipment: Equipment[]; // equipment on this lane, already sorted by position
}

export function MapLane({ laneNumber, equipment }: Props) {
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const selectEquipment = usePsimStore((s) => s.selectEquipment);

  return (
    <div className="flex items-center gap-space-2 mb-space-3">
      <div className="text-label font-mono text-text-secondary w-9 tracking-wider">
        LN {String(laneNumber).padStart(2, "0")}
      </div>

      <div className="flex-1 bg-slate-700 dark:bg-slate-700 h-[22px] rounded-sm relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] flex items-center justify-around px-space-3">
        {/* Yellow dashed centerline */}
        <div
          className="absolute left-[10%] right-[10%] top-1/2 h-0.5 -translate-y-1/2 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #fbbf24 0, #fbbf24 8px, transparent 8px, transparent 16px)",
          }}
        />

        {/* Equipment markers */}
        {equipment.map((eq) => {
          const isSelected = selectedId === eq.id;
          const isSquare = isSquareShape(eq.type);
          const color = statusVar[eq.status];

          return (
            <button
              key={eq.id}
              onClick={() => selectEquipment(eq.id)}
              className={cn(
                "relative z-10 w-4 h-4 transition-transform duration-fast hover:scale-[1.4]",
                isSquare ? "rounded-sm" : "rounded-full",
                "border-2 border-background/80",
                eq.status === "transit" && "animate-pulse-amber",
                eq.status === "fault" && "animate-blink-fault",
                eq.efoActive && "animate-red-glow",
                isSelected && "outline-2 outline outline-ica-blue outline-offset-[3px] scale-[1.3]",
              )}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}`,
              }}
              title={`${eq.name} — ${eq.status}`}
            />
          );
        })}
      </div>
    </div>
  );
}
