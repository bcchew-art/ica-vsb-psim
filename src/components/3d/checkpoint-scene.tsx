"use client";

import { useMemo } from "react";
import { usePsimStore } from "@/stores/psim-store";
import { getLayout } from "@/lib/checkpoint-layout";
import { Lane } from "./lane";
import { Gantry } from "./gantry";
import { EquipmentRenderer } from "./equipment/equipment-renderer";

export function CheckpointScene() {
  const checkpoint = usePsimStore((s) => s.checkpoint);
  const equipment = usePsimStore((s) => s.equipment);
  const selectEquipment = usePsimStore((s) => s.selectEquipment);
  const layout = useMemo(() => getLayout(checkpoint), [checkpoint]);

  // Group equipment by lane for rendering
  const equipmentByLane = useMemo(() => {
    const map = new Map<number, typeof equipment>();
    for (const eq of equipment) {
      if (!map.has(eq.lane)) map.set(eq.lane, []);
      map.get(eq.lane)!.push(eq);
    }
    return map;
  }, [equipment]);

  // Look up worldX for an equipment by position slot
  const slotsByPosition = useMemo(() => {
    const m = new Map<number, number>();
    for (const s of layout.equipmentSlots) m.set(s.positionIndex, s.worldX);
    return m;
  }, [layout]);

  return (
    <>
      {Array.from({ length: layout.laneCount }, (_, i) => i + 1).map((laneNum) => (
        <Lane key={laneNum} layout={layout} laneNumber={laneNum}>
          {(equipmentByLane.get(laneNum) ?? [])
            .filter((eq) =>
              eq.type === "auto-bollard" ||
              eq.type === "drop-arm-barrier" ||
              eq.type === "rising-step",
            )
            .map((eq) => {
              const worldX = slotsByPosition.get(eq.position);
              if (worldX === undefined) return null;
              return (
                <group key={eq.id} position={[worldX, 0.03, 0]}>
                  <EquipmentRenderer
                    equipment={eq}
                    laneWidth={layout.laneWidth}
                    onClick={() => selectEquipment(eq.id)}
                  />
                </group>
              );
            })}
        </Lane>
      ))}
      {layout.gantries.map((g, i) => (
        <Gantry key={i} layout={layout} config={g} />
      ))}
    </>
  );
}
