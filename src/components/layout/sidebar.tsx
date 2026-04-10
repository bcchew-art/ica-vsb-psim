"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  TrafficCone,
  FileText,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePsimStore } from "@/stores/psim-store";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  badge?: number | string | null;
  badgeColor?: "red" | "amber" | "blue";
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const alertsCount = usePsimStore((s) => s.alerts.length);
  const equipmentCount = usePsimStore((s) => s.equipment.length);

  const sections: NavSection[] = [
    {
      label: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
      ],
    },
    {
      label: "Monitoring",
      items: [
        { icon: Map, label: "Checkpoint Map", href: "/map" },
        {
          icon: ShieldAlert,
          label: "Alerts",
          href: "/alerts",
          badge: alertsCount > 0 ? alertsCount : null,
          badgeColor: "red",
        },
        {
          icon: TrafficCone,
          label: "Equipment",
          href: "/equipment",
          badge: equipmentCount,
          badgeColor: "blue",
        },
      ],
    },
    {
      label: "System",
      items: [
        { icon: FileText, label: "Reports", href: "/reports" },
        { icon: Settings, label: "Settings", href: "/settings" },
      ],
    },
  ];

  const badgeColorClass = (color: NavItem["badgeColor"] = "red") => {
    switch (color) {
      case "red":
        return "bg-ica-red text-white";
      case "amber":
        return "bg-status-transit text-white";
      case "blue":
        return "bg-ica-blue text-white";
      default:
        return "bg-ica-red text-white";
    }
  };

  return (
    <aside
      className={cn(
        "h-full bg-ica-navy flex flex-col transition-all duration-normal",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
      )}
    >
      <nav className="flex-1 pt-space-3 pb-space-3 space-y-space-4 overflow-y-auto">
        {sections.map((section, sectionIdx) => (
          <div key={section.label}>
            {/* Section header — for first section, includes the collapse toggle */}
            {!collapsed ? (
              <div className="flex items-center justify-between px-space-4 mb-space-1">
                <span className="text-label text-white/40 uppercase tracking-wider">
                  {section.label}
                </span>
                {sectionIdx === 0 && (
                  <button
                    onClick={() => setCollapsed(true)}
                    className="p-0.5 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-fast"
                    title="Collapse sidebar"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                )}
              </div>
            ) : (
              sectionIdx === 0 && (
                <div className="flex justify-center mb-space-2">
                  <button
                    onClick={() => setCollapsed(false)}
                    className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-fast"
                    title="Expand sidebar"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              )
            )}

            {/* Nav items */}
            <div className="px-space-2 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-space-3 px-space-3 py-space-2 rounded-md transition-colors duration-fast relative",
                      collapsed && "justify-center px-space-2",
                      item.active
                        ? "bg-white/15 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} className="shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 text-body-sm">{item.label}</span>
                    )}
                    {item.badge !== null && item.badge !== undefined && (
                      collapsed ? (
                        <span
                          className={cn(
                            "absolute top-1 right-1 w-2 h-2 rounded-full",
                            badgeColorClass(item.badgeColor),
                          )}
                        />
                      ) : (
                        <span
                          className={cn(
                            "min-w-[20px] h-5 px-space-1 rounded-full text-label font-bold flex items-center justify-center",
                            badgeColorClass(item.badgeColor),
                          )}
                        >
                          {item.badge}
                        </span>
                      )
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
