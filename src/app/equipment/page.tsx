"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  ChevronUp,
  Circle,
  GitMerge,
  ToggleLeft,
  AlignJustify,
  CreditCard,
  TrafficCone,
  Columns2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCard {
  icon: React.ReactNode;
  type: string;
  count: number;
  operational: number;
  fault: number;
  offline: number;
}

const equipment: EquipmentCard[] = [
  {
    icon: <ChevronUp size={22} />,
    type: "Rising Steps — Electro Motorized",
    count: 24,
    operational: 22,
    fault: 1,
    offline: 1,
  },
  {
    icon: <ChevronUp size={22} />,
    type: "Rising Steps — Hydraulic",
    count: 12,
    operational: 11,
    fault: 0,
    offline: 1,
  },
  {
    icon: <Circle size={22} />,
    type: "Fixed Bollards",
    count: 48,
    operational: 48,
    fault: 0,
    offline: 0,
  },
  {
    icon: <Circle size={22} />,
    type: "Auto Bollards",
    count: 32,
    operational: 30,
    fault: 2,
    offline: 0,
  },
  {
    icon: <GitMerge size={22} />,
    type: "Surface Mount Sliding Bollards",
    count: 16,
    operational: 15,
    fault: 0,
    offline: 1,
  },
  {
    icon: <ToggleLeft size={22} />,
    type: "Drop Arm Barriers",
    count: 20,
    operational: 18,
    fault: 1,
    offline: 1,
  },
  {
    icon: <AlignJustify size={22} />,
    type: "Sliding Gates",
    count: 8,
    operational: 8,
    fault: 0,
    offline: 0,
  },
  {
    icon: <TrafficCone size={22} />,
    type: "Traffic Lights",
    count: 56,
    operational: 54,
    fault: 2,
    offline: 0,
  },
  {
    icon: <CreditCard size={22} />,
    type: "Card Access Readers",
    count: 36,
    operational: 35,
    fault: 0,
    offline: 1,
  },
];

const totalEquipment = equipment.reduce((s, e) => s + e.count, 0);
const totalOperational = equipment.reduce((s, e) => s + e.operational, 0);
const totalFault = equipment.reduce((s, e) => s + e.fault, 0);
const totalOffline = equipment.reduce((s, e) => s + e.offline, 0);

export default function EquipmentPage() {
  return (
    <AppShell>
    <div className="flex flex-col gap-space-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-text-primary font-semibold">Equipment Registry</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            All VSB equipment types across Woodlands and Tuas checkpoints
          </p>
        </div>
      </div>

      {/* Fleet summary */}
      <div className="grid grid-cols-4 gap-space-4">
        {[
          { label: "Total Equipment", value: totalEquipment, color: "text-text-primary", icon: <Columns2 size={16} /> },
          { label: "Operational", value: totalOperational, color: "text-status-open", icon: <Activity size={16} /> },
          { label: "Fault", value: totalFault, color: "text-status-fault", icon: <TrafficCone size={16} /> },
          { label: "Offline", value: totalOffline, color: "text-status-offline", icon: <Circle size={16} /> },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface-elevated p-space-4 flex items-center gap-space-3">
            <div className={cn("shrink-0", stat.color)}>{stat.icon}</div>
            <div>
              <p className={cn("text-h2 font-semibold leading-none", stat.color)}>{stat.value}</p>
              <p className="text-label text-text-secondary mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-3 gap-space-4">
        {equipment.map((eq) => {
          const healthPct = Math.round((eq.operational / eq.count) * 100);
          return (
            <div
              key={eq.type}
              className="rounded-lg border border-border bg-surface-elevated p-space-4 flex flex-col gap-space-3"
            >
              {/* Icon + type */}
              <div className="flex items-start gap-space-3">
                <div className="w-10 h-10 rounded-md bg-ica-blue/10 flex items-center justify-center text-ica-blue shrink-0">
                  {eq.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-text-primary font-medium leading-snug">{eq.type}</p>
                  <p className="text-label text-text-secondary mt-0.5">{eq.count} units</p>
                </div>
              </div>

              {/* Status breakdown */}
              <div className="flex items-center gap-space-2 text-label">
                <span className="flex items-center gap-1 text-status-open">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-open" />
                  {eq.operational} OK
                </span>
                {eq.fault > 0 && (
                  <span className="flex items-center gap-1 text-status-fault">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-fault" />
                    {eq.fault} Fault
                  </span>
                )}
                {eq.offline > 0 && (
                  <span className="flex items-center gap-1 text-status-offline">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-offline" />
                    {eq.offline} Offline
                  </span>
                )}
              </div>

              {/* Health bar */}
              <div>
                <div className="flex justify-between text-label text-text-secondary mb-1">
                  <span>Health</span>
                  <span>{healthPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      healthPct === 100
                        ? "bg-status-open"
                        : healthPct >= 85
                        ? "bg-status-transit"
                        : "bg-ica-red",
                    )}
                    style={{ width: `${healthPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </AppShell>
  );
}
