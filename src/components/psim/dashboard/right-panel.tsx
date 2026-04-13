"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  // Physical direction is inverted for DABs vs bollards/rising steps:
  //   Bollard/Step:  Raise (up) = SECURED (blocking)   Lower (down) = OPEN
  //   DAB:           Raise (up) = OPEN (arm clears)    Lower (down) = SECURED (arm blocks)
  // The store functions raiseEquipment / lowerEquipment are named by outcome
  // (secured / open), so for DABs we swap which store fn each physical button calls.
  const handleRaise = () => {
    if (!selected) return;
    const isDAB = selected.type === "drop-arm-barrier";
    const storeFn = isDAB ? lowerEquipment : raiseEquipment;
    const finalStatus: "secured" | "open" = isDAB ? "open" : "secured";
    const error = storeFn(selected.id);
    if (error) {
      toast.error(error);
      return;
    }
    toast.info(`${selected.name} raising...`);
    setTimeout(() => {
      const current = usePsimStore.getState().equipment.find((e) => e.id === selected.id);
      if (current?.status === "transit") {
        usePsimStore.setState({
          equipment: usePsimStore.getState().equipment.map((eq) =>
            eq.id === selected.id
              ? { ...eq, status: finalStatus, lastAction: "Raised" }
              : eq,
          ),
        });
        toast.success(`${selected.name} raised`);
      }
    }, TRANSIT_DURATION_MS);
  };

  const handleLower = () => {
    if (!selected) return;
    const isDAB = selected.type === "drop-arm-barrier";
    const storeFn = isDAB ? raiseEquipment : lowerEquipment;
    const finalStatus: "secured" | "open" = isDAB ? "secured" : "open";
    const error = storeFn(selected.id);
    if (error) {
      toast.error(error);
      return;
    }
    toast.info(`${selected.name} lowering...`);
    setTimeout(() => {
      const current = usePsimStore.getState().equipment.find((e) => e.id === selected.id);
      if (current?.status === "transit") {
        usePsimStore.setState({
          equipment: usePsimStore.getState().equipment.map((eq) =>
            eq.id === selected.id
              ? { ...eq, status: finalStatus, lastAction: "Lowered" }
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
        <motion.div
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
            Active Alerts · {alerts.length}
          </div>
          {alerts.length === 0 ? (
            <div className="text-body-sm text-text-secondary text-center py-space-3">
              No active alerts
            </div>
          ) : (
            <div className="space-y-space-1">
              <AnimatePresence initial={true}>
                {alerts.map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 24, opacity: 0 }}
                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.35, ease: "easeOut" }}
                  >
                    <AlertBanner alert={alert} onDismiss={dismissAlert} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
            Selected
          </div>
          <RcpHandoverBanner mode={controlMode} />
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <EquipmentCard
                  equipment={selected}
                  onRaise={handleRaise}
                  onLower={handleLower}
                  onEfo={handleEfoClick}
                  disabled={controlMode !== "mcp"}
                  raiseDisabled={(() => {
                    // Raise = physical up. For bollard/step that's "secured" outcome;
                    // for DAB (inverted) that's "open" outcome. Disable when already there.
                    if (selected.status === "transit") return true;
                    const isDAB = selected.type === "drop-arm-barrier";
                    const alreadyRaised = isDAB
                      ? selected.status === "open"
                      : selected.status === "secured";
                    return alreadyRaised;
                  })()}
                  lowerDisabled={(() => {
                    if (selected.status === "transit") return true;
                    const isDAB = selected.type === "drop-arm-barrier";
                    const alreadyLowered = isDAB
                      ? selected.status === "secured"
                      : selected.status === "open";
                    return alreadyLowered;
                  })()}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <EmptySelection />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
