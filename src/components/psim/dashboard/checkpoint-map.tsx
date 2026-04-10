"use client";

import { useMemo } from "react";
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
    <div className="h-full bg-gradient-to-b from-surface to-background p-space-5 relative overflow-hidden">
      <div className="absolute top-space-3 left-space-4 text-body-sm italic font-mono text-text-secondary tracking-wider">
        ← MALAYSIA · CAUSEWAY
      </div>
      <div className="absolute bottom-space-3 right-space-4 text-body-sm italic font-mono text-text-secondary tracking-wider">
        SINGAPORE →
      </div>
      <div className="absolute top-space-3 right-space-4 text-label font-mono text-text-secondary">
        {checkpointName} CHECKPOINT
      </div>

      <div className="mt-space-8 pt-space-3">
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
