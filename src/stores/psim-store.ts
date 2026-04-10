import { create } from "zustand";
import type { Equipment, Alert, Checkpoint, ControlMode } from "@/lib/types";
import { woodlandsEquipment, tuasEquipment, initialAlerts } from "@/lib/mock-data";

interface PsimStore {
  // Data
  checkpoint: Checkpoint;
  equipment: Equipment[];
  alerts: Alert[];
  selectedEquipmentId: string | null;
  controlMode: ControlMode;

  // Actions
  setCheckpoint: (c: Checkpoint) => void;
  selectEquipment: (id: string | null) => void;
  setControlMode: (mode: ControlMode) => void;
  raiseEquipment: (id: string) => void;
  lowerEquipment: (id: string) => void;
  triggerEfo: (id: string) => void;
  resetEfo: (id: string) => void;
  dismissAlert: (id: string) => void;
}

// Derive equipment list for a checkpoint
function getEquipmentFor(checkpoint: Checkpoint): Equipment[] {
  return checkpoint === "woodlands"
    ? [...woodlandsEquipment]
    : [...tuasEquipment];
}

// Helper — returns current time as HH:MM:SS
function currentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

export const usePsimStore = create<PsimStore>((set) => ({
  // Initial state
  checkpoint: "woodlands",
  equipment: getEquipmentFor("woodlands"),
  alerts: initialAlerts,
  selectedEquipmentId: null,
  controlMode: "mcp",

  setCheckpoint: (checkpoint) =>
    set(() => ({
      checkpoint,
      equipment: getEquipmentFor(checkpoint),
      selectedEquipmentId: null,
    })),

  selectEquipment: (id) => set({ selectedEquipmentId: id }),

  setControlMode: (controlMode) => set({ controlMode }),

  raiseEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id
          ? { ...eq, status: "transit" as const, lastAction: "Raising", lastActionTime: currentTime() }
          : eq,
      ),
    })),

  lowerEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id
          ? { ...eq, status: "transit" as const, lastAction: "Lowering", lastActionTime: currentTime() }
          : eq,
      ),
    })),

  triggerEfo: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id
          ? { ...eq, status: "secured" as const, efoActive: true, lastAction: "EFO Activated", lastActionTime: currentTime() }
          : eq,
      ),
    })),

  resetEfo: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id
          ? { ...eq, efoActive: false, lastAction: "EFO Reset", lastActionTime: currentTime() }
          : eq,
      ),
    })),

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}));
