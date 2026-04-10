"use client";

import { usePsimStore } from "@/stores/psim-store";
import { AlertBanner } from "@/components/psim/alert-banner";
import { EquipmentCard } from "@/components/psim/equipment-card";
import { EmptySelection } from "./empty-selection";

export function RightPanel() {
  const alerts = usePsimStore((s) => s.alerts);
  const equipment = usePsimStore((s) => s.equipment);
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const dismissAlert = usePsimStore((s) => s.dismissAlert);

  const selected = selectedId
    ? equipment.find((e) => e.id === selectedId) ?? null
    : null;

  return (
    <div className="h-full bg-surface border-l border-border overflow-y-auto p-space-3 space-y-space-4">
      {/* Alerts section */}
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

      {/* Selected equipment section */}
      <div>
        <div className="text-label text-text-secondary uppercase tracking-wider mb-space-2 px-space-1">
          Selected
        </div>
        {selected ? (
          <EquipmentCard equipment={selected} />
        ) : (
          <EmptySelection />
        )}
      </div>
    </div>
  );
}
