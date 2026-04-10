"use client";

import { usePsimStore } from "@/stores/psim-store";
import type { Equipment } from "@/lib/types";

interface Pill {
  label: string;
  count: number;
  dotColor: string;
}

function countByStatus(equipment: Equipment[], status: Equipment["status"]): number {
  return equipment.filter((e) => e.status === status).length;
}

export function StatusPills() {
  const equipment = usePsimStore((s) => s.equipment);

  const pills: Pill[] = [
    { label: "Operational", count: countByStatus(equipment, "open"), dotColor: "bg-status-open" },
    { label: "In Transit", count: countByStatus(equipment, "transit"), dotColor: "bg-status-transit" },
    { label: "Secured", count: countByStatus(equipment, "secured"), dotColor: "bg-status-secured" },
    { label: "Fault", count: countByStatus(equipment, "fault"), dotColor: "bg-status-fault" },
  ];

  return (
    <div className="flex gap-space-2">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="flex items-center gap-space-1 bg-white/10 px-space-3 py-space-1 rounded-full text-label text-white"
        >
          <span className={`w-2 h-2 rounded-full ${pill.dotColor}`} />
          <span className="font-semibold">{pill.count}</span>
          <span className="text-white/70">{pill.label}</span>
        </span>
      ))}
    </div>
  );
}
