"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePsimStore } from "@/stores/psim-store";
import { AlertBanner } from "@/components/psim/alert-banner";
import { EquipmentCard } from "@/components/psim/equipment-card";
import { EmptySelection } from "./empty-selection";
import { RcpHandoverBanner } from "./rcp-handover-banner";
import { EfoConfirmDialog } from "./efo-confirm-dialog";

const TRANSIT_DURATION_MS = 1000;

export function RightPanel() {
  const alerts = usePsimStore((s) => s.alerts);
  const equipment = usePsimStore((s) => s.equipment);
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const controlMode = usePsimStore((s) => s.controlMode);
  const dismissAlert = usePsimStore((s) => s.dismissAlert);
  const raiseEquipment = usePsimStore((s) => s.raiseEquipment);
  const lowerEquipment = usePsimStore((s) => s.lowerEquipment);
  const triggerEfo = usePsimStore((s) => s.triggerEfo);

  const [efoDialogOpen, setEfoDialogOpen] = useState(false);

  const selected = selectedId
    ? equipment.find((e) => e.id === selectedId) ?? null
    : null;

  const handleRaise = () => {
    if (!selected) return;
    raiseEquipment(selected.id);
    toast.info(`${selected.name} raising...`);
    // After transit delay, flip to secured (only if still in transit)
    setTimeout(() => {
      const current = usePsimStore.getState().equipment.find((e) => e.id === selected.id);
      if (current?.status === "transit") {
        usePsimStore.setState({
          equipment: usePsimStore.getState().equipment.map((eq) =>
            eq.id === selected.id
              ? { ...eq, status: "secured" as const, lastAction: "Raised" }
              : eq,
          ),
        });
        toast.success(`${selected.name} raised`);
      }
    }, TRANSIT_DURATION_MS);
  };

  const handleLower = () => {
    if (!selected) return;
    lowerEquipment(selected.id);
    toast.info(`${selected.name} lowering...`);
    setTimeout(() => {
      const current = usePsimStore.getState().equipment.find((e) => e.id === selected.id);
      if (current?.status === "transit") {
        usePsimStore.setState({
          equipment: usePsimStore.getState().equipment.map((eq) =>
            eq.id === selected.id
              ? { ...eq, status: "open" as const, lastAction: "Lowered" }
              : eq,
          ),
        });
        toast.success(`${selected.name} lowered`);
      }
    }, TRANSIT_DURATION_MS);
  };

  const handleEfoClick = () => setEfoDialogOpen(true);

  const handleEfoConfirm = () => {
    if (!selected) return;
    triggerEfo(selected.id);
    setEfoDialogOpen(false);
    toast.error(`EFO ACTIVATED: ${selected.name}`, { duration: 6000 });
  };

  return (
    <>
      <div className="h-full bg-surface border-l border-border overflow-y-auto p-space-3 space-y-space-4">
        <div>
          <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
            Active Alerts · {alerts.length}
          </div>
          {alerts.length === 0 ? (
            <div className="text-body-sm text-text-secondary text-center py-space-3">
              No active alerts
            </div>
          ) : (
            <div className="space-y-space-1">
              {alerts.map((alert) => (
                <AlertBanner key={alert.id} alert={alert} onDismiss={dismissAlert} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
            Selected
          </div>
          <RcpHandoverBanner mode={controlMode} />
          {selected ? (
            <EquipmentCard
              equipment={selected}
              onRaise={handleRaise}
              onLower={handleLower}
              onEfo={handleEfoClick}
              disabled={controlMode !== "mcp"}
            />
          ) : (
            <EmptySelection />
          )}
        </div>
      </div>

      <EfoConfirmDialog
        open={efoDialogOpen}
        equipmentName={selected?.name ?? ""}
        onConfirm={handleEfoConfirm}
        onCancel={() => setEfoDialogOpen(false)}
      />
    </>
  );
}
