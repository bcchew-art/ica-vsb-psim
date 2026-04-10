"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePsimStore } from "@/stores/psim-store";
import type { ControlMode } from "@/lib/types";

// All 5 control layers per eval criteria 3.2.1
const modes: ControlMode[] = ["mcp", "rcp", "op", "hpu", "wrcd"];

const modeLabels: Record<ControlMode, string> = {
  mcp: "MCP",
  rcp: "RCP",
  op: "OP",
  hpu: "HPU",
  wrcd: "WRCD",
};

const modeToastMessages: Record<ControlMode, string> = {
  mcp: "Control mode: MCP — PSIM has active control (Command Operation Room)",
  rcp: "Control mode: RCP — wired panel at guard house has control",
  op: "Control mode: OP — observation post has control",
  hpu: "Control mode: HPU — local equipment panel has control",
  wrcd: "Control mode: WRCD — wireless handheld has control",
};

export function ControlModeSwitcher() {
  const controlMode = usePsimStore((s) => s.controlMode);
  const setControlMode = usePsimStore((s) => s.setControlMode);

  return (
    <div className="flex items-center gap-space-2">
      <span className="text-label text-white/60 uppercase tracking-wider">Control</span>
      <div className="flex gap-0.5 bg-black/40 p-0.5 rounded-md border border-ica-blue">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setControlMode(mode);
              if (mode === "mcp") {
                toast.success(modeToastMessages[mode]);
              } else {
                toast.info(modeToastMessages[mode]);
              }
            }}
            className={cn(
              "px-space-2 py-space-1 rounded-sm text-label font-bold font-mono transition-all duration-fast min-w-[40px]",
              controlMode === mode
                ? "bg-ica-red text-white shadow-[0_0_8px_rgba(211,40,62,0.6)]"
                : "text-white/60 hover:text-white",
            )}
            title={modeToastMessages[mode]}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}
