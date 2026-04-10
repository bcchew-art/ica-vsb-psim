"use client";

import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { usePsimStore } from "@/stores/psim-store";

interface Props {
  laneNumber: number;
  children: React.ReactNode;
  className?: string;
}

export function LaneContextMenu({ laneNumber, children, className }: Props) {
  const controlMode = usePsimStore((s) => s.controlMode);
  const isActive = usePsimStore((s) => s.sallyPortLanes.has(laneNumber));
  const activateSallyPort = usePsimStore((s) => s.activateSallyPort);
  const deactivateSallyPort = usePsimStore((s) => s.deactivateSallyPort);

  const isMcp = controlMode === "mcp";
  const laneLabel = `Lane ${String(laneNumber).padStart(2, "0")}`;

  const handleActivate = () => {
    if (!isMcp) return;
    activateSallyPort(laneNumber);
    toast.success(`Sally port activated on ${laneLabel}`);
  };

  const handleDeactivate = () => {
    if (!isMcp) return;
    deactivateSallyPort(laneNumber);
    toast.info(`Sally port deactivated on ${laneLabel}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {isActive ? (
          <ContextMenuItem
            onClick={handleDeactivate}
            disabled={!isMcp}
            className="text-ica-blue"
          >
            <LockOpen size={14} className="mr-2" />
            Deactivate Sally Port
            {!isMcp && (
              <span className="ml-auto text-label text-text-secondary">MCP only</span>
            )}
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            onClick={handleActivate}
            disabled={!isMcp}
          >
            <Lock size={14} className="mr-2" />
            Activate Sally Port
            {!isMcp && (
              <span className="ml-auto text-label text-text-secondary">MCP only</span>
            )}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          View Lane Info
          <span className="ml-auto text-label text-text-secondary">Soon</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
