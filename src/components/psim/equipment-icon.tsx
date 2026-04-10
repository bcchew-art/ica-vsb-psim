"use client";

import { cn } from "@/lib/utils";
import type { EquipmentType, EquipmentStatus } from "@/lib/types";

// Status colors as CSS variable references — fill/stroke SVG attributes
// can't use Tailwind fill-* utilities reliably for custom color tokens in v4,
// so we use inline style with the CSS variables defined in globals.css.
const statusColorVar: Record<EquipmentStatus, string> = {
  secured: "var(--color-status-secured)",
  open: "var(--color-status-open)",
  transit: "var(--color-status-transit)",
  fault: "var(--color-status-fault)",
  offline: "var(--color-status-offline)",
};

interface EquipmentIconProps {
  type: EquipmentType;
  status: EquipmentStatus;
  efoActive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function EquipmentIcon({
  type,
  status,
  efoActive = false,
  selected = false,
  onClick,
  className,
}: EquipmentIconProps) {
  const color = statusColorVar[status];

  const getShape = () => {
    switch (type) {
      case "rising-step":
        return <rect x="4" y="4" width="32" height="32" rx="4" />;
      case "fixed-bollard":
      case "auto-bollard":
        return <circle cx="20" cy="20" r="16" />;
      case "drop-arm-barrier":
        return <rect x="2" y="8" width="36" height="24" rx="4" />;
      case "sliding-bollard":
      case "sliding-gate":
        return <polygon points="20,2 38,20 20,38 2,20" />;
      case "traffic-light":
        return <rect x="10" y="2" width="20" height="36" rx="10" />;
      case "card-reader":
        return <rect x="6" y="4" width="28" height="32" rx="2" />;
      default:
        return <circle cx="20" cy="20" r="16" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-10 h-10 cursor-pointer transition-transform duration-fast hover:scale-110",
        status === "transit" && "animate-pulse-amber",
        efoActive && "animate-red-glow",
        status === "fault" && "animate-blink-fault",
        selected && "ring-2 ring-ica-blue ring-offset-2 rounded-md",
        className
      )}
      title={`${type} — ${status}`}
    >
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <g fill={color} stroke={color} strokeWidth="2">
          {getShape()}
        </g>
      </svg>
    </button>
  );
}
