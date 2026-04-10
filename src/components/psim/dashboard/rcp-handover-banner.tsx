import { Info } from "lucide-react";
import type { ControlMode } from "@/lib/types";

const messages: Record<ControlMode, string> = {
  mcp: "",
  rcp: "Control handed to RCP — local guard house has active control. PSIM is monitoring only.",
  wrcd: "Control handed to WRCD — wireless device is actively controlling equipment. PSIM is monitoring only.",
};

interface Props {
  mode: ControlMode;
}

export function RcpHandoverBanner({ mode }: Props) {
  if (mode === "mcp") return null;

  return (
    <div className="flex items-center gap-space-2 bg-ica-blue/15 border-l-4 border-ica-blue rounded-sm px-space-3 py-space-2 mb-space-2">
      <Info size={16} className="text-ica-blue shrink-0" />
      <p className="text-body-sm text-text-primary">{messages[mode]}</p>
    </div>
  );
}
