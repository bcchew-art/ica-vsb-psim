import type { Checkpoint, EquipmentType } from "@/lib/types";

export interface EquipmentSlot {
  type: EquipmentType;
  positionIndex: number; // matches Equipment.position (0, 1, 2)
  worldX: number;        // meters along lane (along traffic direction)
}

export interface GantryConfig {
  worldX: number;   // meters along lane
  cameraCount: number;
}

export interface CheckpointLayout {
  checkpoint: Checkpoint;
  laneCount: number;
  laneWidth: number;    // meters
  laneSpacing: number;  // meter stride between lane centers (includes dividers)
  roadLength: number;   // meters along traffic direction
  gantries: GantryConfig[];
  equipmentSlots: EquipmentSlot[];
}

export const woodlandsLayout: CheckpointLayout = {
  checkpoint: "woodlands",
  laneCount: 5,
  laneWidth: 3.5,
  laneSpacing: 4.0,
  roadLength: 40,
  gantries: [
    { worldX: -12, cameraCount: 5 },
    { worldX: 12, cameraCount: 5 },
  ],
  equipmentSlots: [
    { type: "drop-arm-barrier", positionIndex: 0, worldX: -8 },
    { type: "auto-bollard", positionIndex: 1, worldX: 0 },
    { type: "rising-step", positionIndex: 2, worldX: 8 },
  ],
};

export const tuasLayout: CheckpointLayout = {
  checkpoint: "tuas",
  laneCount: 4,
  laneWidth: 3.5,
  laneSpacing: 4.0,
  roadLength: 40,
  gantries: [
    { worldX: -12, cameraCount: 4 },
    { worldX: 12, cameraCount: 4 },
  ],
  equipmentSlots: [
    { type: "drop-arm-barrier", positionIndex: 0, worldX: -8 },
    { type: "auto-bollard", positionIndex: 1, worldX: 0 },
    { type: "rising-step", positionIndex: 2, worldX: 8 },
  ],
};

export function getLayout(checkpoint: Checkpoint): CheckpointLayout {
  return checkpoint === "woodlands" ? woodlandsLayout : tuasLayout;
}
