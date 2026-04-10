import { cn } from "@/lib/utils";
import type { EquipmentStatus } from "@/lib/types";

const statusConfig: Record<EquipmentStatus, { label: string; dotClass: string; bgClass: string }> = {
  secured: { label: "Secured", dotClass: "bg-status-secured", bgClass: "bg-red-50 text-status-secured dark:bg-red-950" },
  open: { label: "Open", dotClass: "bg-status-open", bgClass: "bg-green-50 text-status-open dark:bg-green-950" },
  transit: { label: "In Transit", dotClass: "bg-status-transit", bgClass: "bg-amber-50 text-status-transit dark:bg-amber-950" },
  fault: { label: "Fault", dotClass: "bg-status-fault", bgClass: "bg-purple-50 text-status-fault dark:bg-purple-950" },
  offline: { label: "Offline", dotClass: "bg-status-offline", bgClass: "bg-gray-50 text-status-offline dark:bg-gray-950" },
};

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-space-1 px-space-2 py-0.5 rounded-full text-label",
        config.bgClass,
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", config.dotClass)} />
      {config.label}
    </span>
  );
}
