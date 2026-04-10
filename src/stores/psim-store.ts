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
  sallyPortLanes: Set<number>;

  // Actions
  setCheckpoint: (c: Checkpoint) => void;
  selectEquipment: (id: string | null) => void;
  setControlMode: (mode: ControlMode) => void;
  raiseEquipment: (id: string) => string | null;
  lowerEquipment: (id: string) => string | null;
  triggerEfo: (id: string) => void;
  resetEfo: (id: string) => void;
  dismissAlert: (id: string) => void;
  activateSallyPort: (lane: number) => void;
  deactivateSallyPort: (lane: number) => void;
  isSallyPortActive: (lane: number) => boolean;
}

function getEquipmentFor(checkpoint: Checkpoint): Equipment[] {
  return checkpoint === "woodlands"
    ? [...woodlandsEquipment]
    : [...tuasEquipment];
}

function currentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

// Interlock helper — returns error reason or null if action is allowed
function checkInterlock(
  state: Pick<PsimStore, "sallyPortLanes" | "equipment">,
  equipment: Equipment,
  nextStatus: "open" | "secured",
): string | null {
  // Only enforce when sally port is active on this lane
  if (!state.sallyPortLanes.has(equipment.lane)) return null;

  // Interlock only applies to front (positions 0-1) and rear (positions 3-4) groups.
  // The middle rising step (position 2) is neutral.
  const isFrontGroup = equipment.position <= 1;
  const isRearGroup = equipment.position >= 3;
  if (!isFrontGroup && !isRearGroup) return null;

  // Only block "opening" actions — raising to secured is always allowed.
  if (nextStatus !== "open") return null;

  const laneEquipment = state.equipment.filter(
    (e) => e.lane === equipment.lane && e.checkpoint === equipment.checkpoint,
  );
  const oppositeGroup = isFrontGroup
    ? laneEquipment.filter((e) => e.position >= 3)
    : laneEquipment.filter((e) => e.position <= 1);
  const oppositeHasOpen = oppositeGroup.some((e) => e.status === "open");

  if (oppositeHasOpen) {
    return isFrontGroup
      ? "Sally port interlock: rear barriers must be secured before front can open"
      : "Sally port interlock: front barriers must be secured before rear can open";
  }
  return null;
}

export const usePsimStore = create<PsimStore>((set, get) => ({
  checkpoint: "woodlands",
  equipment: getEquipmentFor("woodlands"),
  alerts: initialAlerts,
  selectedEquipmentId: null,
  controlMode: "mcp",
  sallyPortLanes: new Set<number>(),

  setCheckpoint: (checkpoint) =>
    set(() => ({
      checkpoint,
      equipment: getEquipmentFor(checkpoint),
      selectedEquipmentId: null,
      sallyPortLanes: new Set<number>(),
    })),

  selectEquipment: (id) => set({ selectedEquipmentId: id }),

  setControlMode: (controlMode) => set({ controlMode }),

  raiseEquipment: (id) => {
    const state = get();
    const eq = state.equipment.find((e) => e.id === id);
    if (!eq) return "Equipment not found";
    // Raising (→ secured) is never blocked by interlock
    set({
      equipment: state.equipment.map((e) =>
        e.id === id
          ? { ...e, status: "transit" as const, lastAction: "Raising", lastActionTime: currentTime() }
          : e,
      ),
    });
    return null;
  },

  lowerEquipment: (id) => {
    const state = get();
    const eq = state.equipment.find((e) => e.id === id);
    if (!eq) return "Equipment not found";
    const blockReason = checkInterlock(state, eq, "open");
    if (blockReason) return blockReason;
    set({
      equipment: state.equipment.map((e) =>
        e.id === id
          ? { ...e, status: "transit" as const, lastAction: "Lowering", lastActionTime: currentTime() }
          : e,
      ),
    });
    return null;
  },

  triggerEfo: (id) =>
    set((state) => {
      const target = state.equipment.find((e) => e.id === id);
      if (!target) return {};
      // If the target equipment is on a sally-port lane, EFO affects ALL
      // equipment on that lane (full lockdown per spec §5.3).
      const isSallyPortLane = state.sallyPortLanes.has(target.lane);
      const timestamp = currentTime();
      return {
        equipment: state.equipment.map((eq) => {
          const shouldEfo = isSallyPortLane
            ? eq.lane === target.lane && eq.checkpoint === target.checkpoint
            : eq.id === id;
          if (!shouldEfo) return eq;
          return {
            ...eq,
            status: "secured" as const,
            efoActive: true,
            lastAction: "EFO Activated",
            lastActionTime: timestamp,
          };
        }),
      };
    }),

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

  activateSallyPort: (lane) =>
    set((state) => {
      const next = new Set(state.sallyPortLanes);
      next.add(lane);
      return { sallyPortLanes: next };
    }),

  deactivateSallyPort: (lane) =>
    set((state) => {
      const next = new Set(state.sallyPortLanes);
      next.delete(lane);
      return { sallyPortLanes: next };
    }),

  isSallyPortActive: (lane) => get().sallyPortLanes.has(lane),
}));
