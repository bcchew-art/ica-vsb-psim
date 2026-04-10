"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import type { Equipment } from "@/lib/types";
import { ArrowUp, ArrowDown, ShieldAlert, Zap, Battery, Droplets } from "lucide-react";

const statusBorderColor: Record<string, string> = {
  secured: "border-l-status-secured",
  open: "border-l-status-open",
  transit: "border-l-status-transit",
  fault: "border-l-status-fault",
  offline: "border-l-status-offline",
};

const typeLabels: Record<string, string> = {
  "rising-step": "Rising Step",
  "fixed-bollard": "Fixed Bollard",
  "auto-bollard": "Auto Bollard",
  "sliding-bollard": "Sliding Bollard",
  "drop-arm-barrier": "Drop Arm Barrier",
  "sliding-gate": "Sliding Gate",
  "traffic-light": "Traffic Light",
  "card-reader": "Card Reader",
};

interface EquipmentCardProps {
  equipment: Equipment;
  onRaise?: () => void;
  onLower?: () => void;
  onEfo?: () => void;
  disabled?: boolean;
}

export function EquipmentCard({ equipment, onRaise, onLower, onEfo, disabled = false }: EquipmentCardProps) {
  const isControllable = !["fixed-bollard", "card-reader"].includes(equipment.type);

  return (
    <div
      className={cn(
        "bg-surface-elevated rounded-md border border-border border-l-4 p-space-5 shadow-sm",
        statusBorderColor[equipment.status]
      )}
    >
      {/* Top: Name + Type + Status */}
      <div className="flex items-start justify-between mb-space-3">
        <div>
          <h3 className="text-h3 text-text-primary">{equipment.name}</h3>
          <p className="text-body-sm text-text-secondary">{typeLabels[equipment.type]}</p>
        </div>
        <StatusBadge status={equipment.status} />
      </div>

      {/* Middle: Health indicators */}
      <div className="flex items-center gap-space-3 mb-space-4 text-body-sm">
        <span className="flex items-center gap-space-1">
          <Zap size={14} className={equipment.health.power ? "text-status-open" : "text-status-fault"} />
          Power
        </span>
        <span className="flex items-center gap-space-1">
          <Battery size={14} className={equipment.health.battery ? "text-status-open" : "text-status-transit"} />
          Battery
        </span>
        {equipment.health.oilLevel !== undefined && (
          <span className="flex items-center gap-space-1">
            <Droplets size={14} className={equipment.health.oilLevel ? "text-status-open" : "text-status-fault"} />
            Oil
          </span>
        )}
      </div>

      {/* Bottom: Action buttons */}
      {isControllable && (
        <div className="flex gap-space-2">
          <Button size="sm" variant="secondary" onClick={onRaise} disabled={disabled} className="flex-1">
            <ArrowUp size={14} className="mr-1" /> Raise
          </Button>
          <Button size="sm" variant="secondary" onClick={onLower} disabled={disabled} className="flex-1">
            <ArrowDown size={14} className="mr-1" /> Lower
          </Button>
          <Button size="sm" variant="destructive" onClick={onEfo} disabled={disabled}>
            <ShieldAlert size={14} className="mr-1" /> EFO
          </Button>
        </div>
      )}

      {/* Meta */}
      <p className="text-body-sm text-text-secondary mt-space-3">
        Last: {equipment.lastAction} &middot; <span className="font-mono">{equipment.lastActionTime}</span>
      </p>
    </div>
  );
}
