"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { usePsimStore } from "@/stores/psim-store";
import { EquipmentListItem } from "./equipment-list-item";
import type { Equipment, Zone } from "@/lib/types";

const zoneLabels: Record<Zone, string> = {
  entry: "Entry",
  mid: "Mid",
  exit: "Exit",
};

const zoneOrder: Zone[] = ["entry", "mid", "exit"];

export function EquipmentList() {
  const checkpoint = usePsimStore((s) => s.checkpoint);
  const equipment = usePsimStore((s) => s.equipment);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter) return equipment;
    const q = filter.toLowerCase();
    return equipment.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q),
    );
  }, [equipment, filter]);

  const byZone = useMemo(() => {
    const groups: Record<Zone, Equipment[]> = { entry: [], mid: [], exit: [] };
    for (const eq of filtered) {
      groups[eq.zone].push(eq);
    }
    return groups;
  }, [filtered]);

  const checkpointName = checkpoint === "woodlands" ? "Woodlands" : "Tuas";

  return (
    <div className="h-full bg-surface border-r border-border overflow-y-auto p-space-3">
      <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
        Equipment · {checkpointName}
      </div>

      <div className="relative mb-space-3">
        <Search size={12} className="absolute left-space-2 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter equipment..."
          className="w-full bg-black/20 border border-border text-text-primary pl-space-5 pr-space-2 py-space-1 rounded-sm text-body-sm placeholder:text-text-secondary focus:outline-none focus:border-ica-blue"
        />
      </div>

      {zoneOrder.map((zone) => {
        const items = byZone[zone];
        if (items.length === 0) return null;
        return (
          <div key={zone} className="mb-space-3">
            <div className="text-label text-text-secondary font-bold uppercase px-space-1 py-space-1 flex justify-between">
              <span>Zone {zone.charAt(0).toUpperCase()} · {zoneLabels[zone]}</span>
              <span>{items.length}</span>
            </div>
            <div className="space-y-0.5">
              {items.map((eq) => (
                <EquipmentListItem key={eq.id} equipment={eq} />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center text-body-sm text-text-secondary py-space-5">
          No equipment matches &quot;{filter}&quot;
        </div>
      )}
    </div>
  );
}
