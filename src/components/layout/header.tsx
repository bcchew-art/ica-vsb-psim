"use client";

import { Sun, Moon, Bell, User } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-header border-b border-border bg-surface-elevated flex items-center justify-between px-space-5 relative">
      {/* ICA Red accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-ica-red" />

      {/* Left: Logo + Title */}
      <div className="flex items-center gap-space-3">
        <div className="w-8 h-8 rounded-md bg-ica-navy flex items-center justify-center">
          <span className="text-white text-label font-bold">ICA</span>
        </div>
        <div>
          <h1 className="text-body font-semibold text-text-primary">VSB PSIM Controller</h1>
          <p className="text-body-sm text-text-secondary">Physical Security Integration System</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-space-2">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-md transition-colors duration-fast",
            "hover:bg-surface text-text-secondary hover:text-text-primary"
          )}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          className={cn(
            "p-2 rounded-md transition-colors duration-fast relative",
            "hover:bg-surface text-text-secondary hover:text-text-primary"
          )}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-fault rounded-full" />
        </button>
        <button
          className={cn(
            "p-2 rounded-md transition-colors duration-fast",
            "hover:bg-surface text-text-secondary hover:text-text-primary"
          )}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
