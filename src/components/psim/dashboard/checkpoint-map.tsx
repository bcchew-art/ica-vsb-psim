"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePsimStore } from "@/stores/psim-store";
import { MapLane } from "./map-lane";
import type { Equipment } from "@/lib/types";

// Equipment types that appear on the road (not just monitoring)
function isOnRoad(equipment: Equipment): boolean {
  return [
    "rising-step",
    "auto-bollard",
    "sliding-bollard",
    "drop-arm-barrier",
    "sliding-gate",
  ].includes(equipment.type);
}

export function CheckpointMap() {
  const checkpoint = usePsimStore((s) => s.checkpoint);
  const equipment = usePsimStore((s) => s.equipment);

  // Group on-road equipment by lane, sort by position within each lane
  const lanesMap = useMemo(() => {
    const map = new Map<number, Equipment[]>();
    for (const eq of equipment) {
      if (!isOnRoad(eq)) continue;
      if (!map.has(eq.lane)) map.set(eq.lane, []);
      map.get(eq.lane)!.push(eq);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.position - b.position);
    }
    return map;
  }, [equipment]);

  // Sorted lane numbers
  const laneNumbers = useMemo(
    () => Array.from(lanesMap.keys()).sort((a, b) => a - b),
    [lanesMap],
  );

  const checkpointName = checkpoint === "woodlands" ? "WOODLANDS" : "TUAS";

  return (
    <div className="h-full bg-gradient-to-b from-surface to-background p-space-5 relative overflow-hidden flex flex-col">
      {/* Header row — no more overlap */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="flex items-center justify-between mb-space-5"
      >
        <div className="text-body-sm italic font-mono text-text-secondary tracking-wider">
          ← MALAYSIA · CAUSEWAY
        </div>
        <div className="text-label font-mono font-bold text-text-primary tracking-widest">
          {checkpointName} CHECKPOINT
        </div>
      </motion.div>

      {/* Lanes */}
      <div className="flex-1">
        {laneNumbers.map((laneNum) => (
          <MapLane
            key={laneNum}
            laneNumber={laneNum}
            equipment={lanesMap.get(laneNum) ?? []}
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
        className="text-body-sm italic font-mono text-text-secondary tracking-wider text-right"
      >
        SINGAPORE →
      </motion.div>
    </div>
  );
}
