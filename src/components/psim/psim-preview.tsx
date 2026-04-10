"use client";

import { StatusBadge } from "./status-badge";
import { EquipmentCard } from "./equipment-card";
import { AlertBanner } from "./alert-banner";
import { EquipmentIcon } from "./equipment-icon";
import type { Equipment, Alert } from "@/lib/types";

const sampleEquipment: Equipment = {
  id: "rs-001",
  name: "Rising Step A1",
  type: "rising-step",
  status: "open",
  checkpoint: "woodlands",
  zone: "Zone A - Entry",
  lastAction: "Lowered",
  lastActionTime: "10:42:15",
  controlMode: "mcp",
  health: { power: true, battery: true, oilLevel: true },
  efoActive: false,
};

const sampleAlert: Alert = {
  id: "alert-001",
  severity: "critical",
  message: "Rising Step B3 — Hydraulic pressure below threshold",
  equipmentId: "rs-003",
  timestamp: "10:45:22",
  dismissed: false,
};

export function PsimPreview() {
  return (
    <div className="space-y-space-4">
      <h2 className="text-h2 text-text-primary">PSIM Components Preview</h2>

      <AlertBanner alert={sampleAlert} onDismiss={(id) => console.log("dismiss", id)} />

      <div className="flex items-center gap-space-3">
        <span className="text-body-sm text-text-secondary">Status badges:</span>
        <StatusBadge status="secured" />
        <StatusBadge status="open" />
        <StatusBadge status="transit" />
        <StatusBadge status="fault" />
        <StatusBadge status="offline" />
      </div>

      <div className="flex items-center gap-space-4 p-space-4 bg-surface rounded-md">
        <span className="text-body-sm text-text-secondary">Map icons:</span>
        <EquipmentIcon type="rising-step" status="secured" />
        <EquipmentIcon type="auto-bollard" status="open" />
        <EquipmentIcon type="drop-arm-barrier" status="transit" />
        <EquipmentIcon type="sliding-bollard" status="fault" />
        <EquipmentIcon type="traffic-light" status="open" />
        <EquipmentIcon type="rising-step" status="open" efoActive />
      </div>

      <div className="max-w-md">
        <EquipmentCard equipment={sampleEquipment} />
      </div>
    </div>
  );
}
