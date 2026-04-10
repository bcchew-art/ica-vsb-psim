"use client";

import { TopStrip } from "./top-strip";
import { EquipmentList } from "./equipment-list";
import { CheckpointMap } from "./checkpoint-map";
import { RightPanel } from "./right-panel";

export function HeroDashboard() {
  return (
    <div className="h-full flex flex-col -m-space-5">
      <TopStrip />
      <div className="flex-1 grid grid-cols-[220px_1fr_300px] overflow-hidden">
        <EquipmentList />
        <CheckpointMap />
        <RightPanel />
      </div>
    </div>
  );
}
