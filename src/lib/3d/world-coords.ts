import type { CheckpointLayout } from "@/lib/checkpoint-layout";

/**
 * Lane 1 is drawn at the "top" (farthest from camera in Z); lanes ascend
 * toward the viewer. Center the lane stack around Z = 0.
 */
export function laneCenterZ(layout: CheckpointLayout, laneNumber: number): number {
  const totalWidth = (layout.laneCount - 1) * layout.laneSpacing;
  const firstLaneZ = -totalWidth / 2;
  return firstLaneZ + (laneNumber - 1) * layout.laneSpacing;
}

export function equipmentWorldPos(
  layout: CheckpointLayout,
  laneNumber: number,
  positionIndex: number,
): [number, number, number] {
  const slot = layout.equipmentSlots.find((s) => s.positionIndex === positionIndex);
  if (!slot) throw new Error(`No equipment slot for position ${positionIndex}`);
  return [slot.worldX, 0, laneCenterZ(layout, laneNumber)];
}

export function checkpointOverviewCamera(layout: CheckpointLayout): {
  targetPos: [number, number, number];
  zoom: number;
} {
  return {
    targetPos: [0, 0, 0],
    zoom: 40,
  };
}
