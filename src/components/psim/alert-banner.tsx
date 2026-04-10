"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import type { Alert } from "@/lib/types";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgClass: "bg-red-50 border-status-secured dark:bg-red-950/50",
    textClass: "text-status-secured",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-amber-50 border-status-transit dark:bg-amber-950/50",
    textClass: "text-status-transit",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-50 border-ica-blue dark:bg-blue-950/50",
    textClass: "text-ica-blue",
  },
};

interface AlertBannerProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-space-3 px-space-4 py-space-2 rounded-md border-l-4",
        config.bgClass
      )}
    >
      <Icon size={18} className={cn("shrink-0", config.textClass)} />
      <p className="flex-1 text-body-sm text-text-primary">{alert.message}</p>
      <span className="text-body-sm text-text-secondary font-mono shrink-0">{alert.timestamp}</span>
      <button
        onClick={() => onDismiss(alert.id)}
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary"
      >
        <X size={14} />
      </button>
    </div>
  );
}
