"use client";

import { motion } from "framer-motion";
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

function isSquareShape(type: EquipmentType): boolean {
  return type === "drop-arm-barrier" || type === "rising-step";
}

interface Props {
  laneNumber: number;
  equipment: Equipment[];
}

export function MapLane({ laneNumber, equipment }: Props) {
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const selectEquipment = usePsimStore((s) => s.selectEquipment);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: (laneNumber - 1) * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex items-center gap-space-2 mb-space-3"
    >
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
        {equipment.map((eq, idx) => {
          const isSelected = selectedId === eq.id;
          const isSquare = isSquareShape(eq.type);
          const color = statusVar[eq.status];

          return (
            <motion.button
              key={eq.id}
              onClick={() => selectEquipment(eq.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isSelected ? 1.5 : 1,
                opacity: 1,
              }}
              transition={{
                delay: (laneNumber - 1) * 0.08 + idx * 0.05,
                type: "spring",
                stiffness: 280,
                damping: 18,
              }}
              whileHover={{ scale: isSelected ? 1.7 : 1.6 }}
              whileTap={{ scale: 0.85 }}
              className={cn(
                "relative z-10 w-4 h-4",
                isSquare ? "rounded-sm" : "rounded-full",
                "border-2 border-background/80",
                eq.status === "transit" && "animate-pulse-amber",
                eq.status === "fault" && "animate-blink-fault",
                eq.efoActive && "animate-red-glow",
                isSelected && "ring-2 ring-ica-blue ring-offset-2 ring-offset-slate-700 z-20",
              )}
              style={{
                backgroundColor: color,
                boxShadow: isSelected
                  ? `0 0 16px ${color}, 0 0 32px ${color}`
                  : `0 0 6px ${color}`,
                transition: "background-color 0.3s ease-out, box-shadow 0.3s ease-out",
              }}
              title={`${eq.name} — ${eq.status}`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
