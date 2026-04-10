"use client";

import { cn } from "@/lib/utils";
import { usePsimStore } from "@/stores/psim-store";
import type { Equipment, EquipmentStatus } from "@/lib/types";

const statusDotClass: Record<EquipmentStatus, string> = {
  secured: "bg-status-secured",
  open: "bg-status-open",
  transit: "bg-status-transit",
  fault: "bg-status-fault",
  offline: "bg-status-offline",
};

const shortTypeLabel: Record<Equipment["type"], string> = {
  "rising-step": "Step",
  "fixed-bollard": "Fixed BL",
  "auto-bollard": "Bollard",
  "sliding-bollard": "Slide BL",
  "drop-arm-barrier": "DAB",
  "sliding-gate": "Gate",
  "traffic-light": "Light",
  "card-reader": "Reader",
};

interface Props {
  equipment: Equipment;
}

export function EquipmentListItem({ equipment }: Props) {
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const selectEquipment = usePsimStore((s) => s.selectEquipment);
  const isSelected = selectedId === equipment.id;

  return (
    <button
      onClick={() => selectEquipment(equipment.id)}
      className={cn(
        "w-full flex items-center gap-space-2 px-space-2 py-space-1 rounded-sm text-label transition-colors duration-fast text-left",
        isSelected
          ? "bg-ica-blue/20 border-l-2 border-ica-blue pl-[6px]"
          : "border-l-2 border-transparent hover:bg-white/5",
      )}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDotClass[equipment.status]}`} />
      <span className="flex-1 text-text-primary font-mono truncate">{equipment.id}</span>
      <span className="text-body-sm text-text-secondary shrink-0">{shortTypeLabel[equipment.type]}</span>
    </button>
  );
}
