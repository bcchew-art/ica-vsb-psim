"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
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
      {/* Centered checkpoint header with building icon — visual anchor */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col items-center mb-space-4"
      >
        <div className="w-10 h-10 rounded-full bg-ica-navy/10 dark:bg-white/5 flex items-center justify-center mb-space-1 border border-border">
          <Landmark size={20} className="text-ica-navy dark:text-ica-blue" />
        </div>
        <div className="text-label font-mono font-bold text-text-primary tracking-widest">
          {checkpointName} CHECKPOINT
        </div>
      </motion.div>

      {/* Direction markers — both arrows point RIGHT showing traffic flow direction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="flex items-center justify-between mb-space-3 text-body-sm italic font-mono text-text-secondary tracking-wider"
      >
        <div>MALAYSIA →</div>
        <div>→ SINGAPORE</div>
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
    </div>
  );
}
