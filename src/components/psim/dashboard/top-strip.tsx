import { CheckpointToggle } from "./checkpoint-toggle";
import { StatusPills } from "./status-pills";
import { ControlModeSwitcher } from "./control-mode-switcher";
import { SallyPortPill } from "./sally-port-pill";

export function TopStrip() {
  return (
    <div className="bg-ica-navy border-b-[3px] border-ica-red px-space-5 py-space-3 flex items-center justify-between gap-space-4">
      <CheckpointToggle />
      <div className="flex items-center gap-space-2">
        <StatusPills />
        <SallyPortPill />
      </div>
      <ControlModeSwitcher />
    </div>
  );
}
