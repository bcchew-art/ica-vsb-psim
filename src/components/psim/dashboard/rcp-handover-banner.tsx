import { Info } from "lucide-react";
import type { ControlMode } from "@/lib/types";

const messages: Record<ControlMode, string> = {
  mcp: "",
  rcp: "Control handed to RCP — wired panel at the guard house has active control. PSIM is monitoring only.",
  op: "Control handed to OP — observation post officer has active control. PSIM is monitoring only.",
  hpu: "Control handed to HPU — local equipment control unit (hydraulic pump / electrical cabinet) is in direct manual control. PSIM is monitoring only.",
  wrcd: "Control handed to WRCD — wireless handheld device is actively controlling equipment. PSIM is monitoring only.",
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
