"use client";

import {
  Settings,
  Shield,
  Users,
  Bell,
  Activity,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingItem {
  label: string;
  description: string;
  enabled: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  items: SettingItem[];
}

const sections: SettingSection[] = [
  {
    id: "general",
    title: "General",
    description: "Application-wide display and locale preferences",
    icon: <Settings size={18} />,
    iconBg: "bg-ica-blue/10",
    iconColor: "text-ica-blue",
    items: [
      { label: "Dark mode", description: "Use dark navy theme across the application", enabled: true },
      { label: "Compact sidebar", description: "Collapse sidebar to icon-only view by default", enabled: false },
      { label: "24-hour clock", description: "Display timestamps in 24-hour format (SGT)", enabled: true },
    ],
  },
  {
    id: "checkpoints",
    title: "Checkpoints",
    description: "Per-checkpoint configuration and monitoring preferences",
    icon: <Shield size={18} />,
    iconBg: "bg-ica-navy/80",
    iconColor: "text-ica-blue",
    items: [
      { label: "Woodlands Checkpoint — monitoring active", description: "Enable live data feed from Woodlands VSB controllers", enabled: true },
      { label: "Tuas Checkpoint — monitoring active", description: "Enable live data feed from Tuas VSB controllers", enabled: true },
      { label: "Auto-acknowledge info events", description: "Automatically acknowledge severity-Info events after 15 minutes", enabled: false },
    ],
  },
  {
    id: "user-management",
    title: "User Management",
    description: "Access control, roles, and operator permissions",
    icon: <Users size={18} />,
    iconBg: "bg-status-open/10",
    iconColor: "text-status-open",
    items: [
      { label: "Require 2FA for all operators", description: "Enforce two-factor authentication on every login", enabled: true },
      { label: "Session auto-timeout (30 min)", description: "Lock screen after 30 minutes of inactivity", enabled: true },
      { label: "Audit trail logging", description: "Log all user actions to the central audit database", enabled: true },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alert escalation rules and notification channels",
    icon: <Bell size={18} />,
    iconBg: "bg-status-transit/10",
    iconColor: "text-status-transit",
    items: [
      { label: "Critical alert — SMS escalation", description: "Send SMS to on-call engineer for Critical severity events", enabled: true },
      { label: "Warning alert — email digest", description: "Bundle Warning events into hourly email digest", enabled: true },
      { label: "Sound alerts in browser", description: "Play audio notification for new Critical events", enabled: false },
    ],
  },
  {
    id: "system-health",
    title: "System Health",
    description: "Diagnostics, watchdog thresholds, and maintenance windows",
    icon: <Activity size={18} />,
    iconBg: "bg-status-fault/10",
    iconColor: "text-status-fault",
    items: [
      { label: "Watchdog heartbeat monitoring", description: "Alert if any controller misses 2 consecutive heartbeat intervals", enabled: true },
      { label: "Scheduled maintenance windows", description: "Suppress non-critical alerts during approved maintenance windows", enabled: true },
      { label: "Telemetry reporting to HQ", description: "Send anonymised system health metrics to ICA HQ dashboard", enabled: false },
    ],
  },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors duration-fast shrink-0 cursor-not-allowed",
        enabled ? "bg-ica-blue" : "bg-border",
      )}
      title="Settings are read-only in demo mode"
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-fast",
          enabled ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-space-5 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-text-primary font-semibold">System Settings</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Configure application behaviour, access control, and notification preferences
          </p>
        </div>
        <span className="px-space-3 py-1.5 rounded-md border border-border bg-surface text-label text-text-secondary">
          Demo — read-only
        </span>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-space-3 px-space-5 py-space-4 border-b border-border bg-surface">
            <div className={cn("w-9 h-9 rounded-md flex items-center justify-center shrink-0", section.iconBg, section.iconColor)}>
              {section.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-h3 text-text-primary">{section.title}</h2>
              <p className="text-label text-text-secondary">{section.description}</p>
            </div>
            <ChevronRight size={16} className="text-text-secondary" />
          </div>

          {/* Setting items */}
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center gap-space-4 px-space-5 py-space-3">
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-text-primary">{item.label}</p>
                  <p className="text-label text-text-secondary mt-0.5">{item.description}</p>
                </div>
                <Toggle enabled={item.enabled} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
