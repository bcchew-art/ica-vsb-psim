"use client";

import type { Equipment } from "@/lib/types";
import { BollardArray } from "./bollard-array";
import { DropArmBarrier } from "./drop-arm-barrier";
import { RisingStep } from "./rising-step";

interface Props {
  equipment: Equipment;
  laneWidth: number;
  onClick?: () => void;
}

export function EquipmentRenderer({ equipment, laneWidth, onClick }: Props) {
  switch (equipment.type) {
    case "auto-bollard":
    case "sliding-bollard":
    case "fixed-bollard":
      return <BollardArray equipment={equipment} laneWidth={laneWidth} onClick={onClick} />;
    case "drop-arm-barrier":
      return <DropArmBarrier equipment={equipment} laneWidth={laneWidth} onClick={onClick} />;
    case "rising-step":
      return <RisingStep equipment={equipment} laneWidth={laneWidth} onClick={onClick} />;
    default:
      return null;
  }
}
