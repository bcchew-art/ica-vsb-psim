"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  TrafficCone,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: Map, label: "Checkpoint Map", href: "/map", active: false },
  { icon: ShieldAlert, label: "Alerts", href: "/alerts", active: false },
  { icon: TrafficCone, label: "Equipment", href: "/equipment", active: false },
  { icon: FileText, label: "Reports", href: "/reports", active: false },
  { icon: Settings, label: "Settings", href: "/settings", active: false },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-full bg-ica-navy flex flex-col transition-all duration-normal",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar"
      )}
    >
      {/* Collapse toggle */}
      <div className="flex justify-end p-space-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-fast"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-space-2 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-space-3 px-space-3 py-space-2 rounded-md transition-colors duration-fast",
              item.active
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span className="text-body-sm">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Footer: Checkpoint selector */}
      {!collapsed && (
        <div className="p-space-3 border-t border-white/10">
          <p className="text-body-sm text-white/40 mb-space-1">Checkpoint</p>
          <select className="w-full bg-white/10 text-white text-body-sm rounded-md px-space-2 py-space-1 border border-white/20">
            <option>Woodlands</option>
            <option>Tuas</option>
          </select>
        </div>
      )}
    </aside>
  );
}
