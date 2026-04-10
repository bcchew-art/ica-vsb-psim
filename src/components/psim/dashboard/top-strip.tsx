import { CheckpointToggle } from "./checkpoint-toggle";
import { StatusPills } from "./status-pills";
import { ControlModeSwitcher } from "./control-mode-switcher";

export function TopStrip() {
  return (
    <div className="bg-ica-navy border-b-[3px] border-ica-red px-space-5 py-space-3 flex items-center justify-between gap-space-4">
      <CheckpointToggle />
      <StatusPills />
      <ControlModeSwitcher />
    </div>
  );
}
