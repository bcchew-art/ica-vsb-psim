"use client";

import { ShieldAlert, CheckCircle, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "Critical" | "Warning" | "Info";
type AlertStatus = "Active" | "Acknowledged" | "Resolved";

interface AlertRow {
  id: string;
  timestamp: string;
  severity: Severity;
  equipment: string;
  checkpoint: string;
  description: string;
  status: AlertStatus;
}

const alerts: AlertRow[] = [
  {
    id: "EVT-2024-0891",
    timestamp: "2024-04-13 09:14:22",
    severity: "Critical",
    equipment: "Rising Step L3 — EFO",
    checkpoint: "Woodlands",
    description: "Emergency Fast Operation triggered on Lane 3 inbound. Manual override engaged.",
    status: "Active",
  },
  {
    id: "EVT-2024-0890",
    timestamp: "2024-04-13 08:57:04",
    severity: "Warning",
    equipment: "Bollard Array L1 — Auto",
    checkpoint: "Tuas",
    description: "Communication timeout on bollard controller unit. Last heartbeat: 4 min ago.",
    status: "Acknowledged",
  },
  {
    id: "EVT-2024-0889",
    timestamp: "2024-04-13 08:41:38",
    severity: "Warning",
    equipment: "Drop Arm Barrier L7",
    checkpoint: "Woodlands",
    description: "Barrier arm did not reach full-open position within expected cycle time (3.2 s).",
    status: "Acknowledged",
  },
  {
    id: "EVT-2024-0888",
    timestamp: "2024-04-13 07:30:15",
    severity: "Info",
    equipment: "Sliding Gate — Cargo Zone",
    checkpoint: "Tuas",
    description: "Scheduled maintenance window commenced. Gate placed into manual mode.",
    status: "Resolved",
  },
  {
    id: "EVT-2024-0887",
    timestamp: "2024-04-13 06:05:51",
    severity: "Info",
    equipment: "Traffic Light Array — L2–L5",
    checkpoint: "Woodlands",
    description: "Daily self-test cycle completed. All signal heads operating within spec.",
    status: "Resolved",
  },
];

const severityConfig: Record<Severity, { label: string; classes: string }> = {
  Critical: { label: "Critical", classes: "bg-ica-red/15 text-ica-red border border-ica-red/30" },
  Warning:  { label: "Warning",  classes: "bg-status-transit/15 text-status-transit border border-status-transit/30" },
  Info:     { label: "Info",     classes: "bg-ica-blue/15 text-ica-blue border border-ica-blue/30" },
};

const statusConfig: Record<AlertStatus, { icon: React.ReactNode; classes: string }> = {
  Active:       { icon: <ShieldAlert size={12} />, classes: "text-ica-red" },
  Acknowledged: { icon: <Clock size={12} />,        classes: "text-status-transit" },
  Resolved:     { icon: <CheckCircle size={12} />,  classes: "text-status-open" },
};

const summaryStats = [
  { label: "Active",       value: alerts.filter((a) => a.status === "Active").length,       color: "text-ica-red" },
  { label: "Acknowledged", value: alerts.filter((a) => a.status === "Acknowledged").length, color: "text-status-transit" },
  { label: "Resolved",     value: alerts.filter((a) => a.status === "Resolved").length,     color: "text-status-open" },
  { label: "Total (24 h)", value: alerts.length,                                             color: "text-text-primary" },
];

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-space-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-text-primary font-semibold">Alerts &amp; Events</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Real-time event log for all VSB equipment across Woodlands and Tuas checkpoints
          </p>
        </div>
        <button className="flex items-center gap-space-2 px-space-3 py-space-2 rounded-md border border-border bg-surface text-label text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">
          <Filter size={14} />
          Filter
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-space-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface-elevated p-space-4 text-center">
            <p className={cn("text-h2 font-semibold", stat.color)}>{stat.value}</p>
            <p className="text-label text-text-secondary mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts table */}
      <div className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-space-4 py-space-3 text-label text-text-secondary font-medium uppercase tracking-wider">Timestamp</th>
              <th className="px-space-4 py-space-3 text-label text-text-secondary font-medium uppercase tracking-wider">Severity</th>
              <th className="px-space-4 py-space-3 text-label text-text-secondary font-medium uppercase tracking-wider">Equipment</th>
              <th className="px-space-4 py-space-3 text-label text-text-secondary font-medium uppercase tracking-wider">Description</th>
              <th className="px-space-4 py-space-3 text-label text-text-secondary font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alerts.map((alert) => {
              const sev = severityConfig[alert.severity];
              const sta = statusConfig[alert.status];
              return (
                <tr key={alert.id} className="hover:bg-surface transition-colors">
                  <td className="px-space-4 py-space-3 whitespace-nowrap">
                    <p className="text-body-sm text-text-primary font-mono">{alert.timestamp}</p>
                    <p className="text-label text-text-secondary">{alert.id}</p>
                  </td>
                  <td className="px-space-4 py-space-3">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-label font-medium", sev.classes)}>
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-space-4 py-space-3">
                    <p className="text-body-sm text-text-primary">{alert.equipment}</p>
                    <p className="text-label text-text-secondary">{alert.checkpoint}</p>
                  </td>
                  <td className="px-space-4 py-space-3 max-w-sm">
                    <p className="text-body-sm text-text-secondary leading-relaxed">{alert.description}</p>
                  </td>
                  <td className="px-space-4 py-space-3">
                    <span className={cn("inline-flex items-center gap-1 text-label font-medium", sta.classes)}>
                      {sta.icon}
                      {alert.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
