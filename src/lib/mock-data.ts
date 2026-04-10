import type { Equipment, Alert } from "./types";

// Helper — generates an Equipment with sensible defaults
function eq(
  id: string,
  name: string,
  type: Equipment["type"],
  checkpoint: Equipment["checkpoint"],
  zone: Equipment["zone"],
  lane: number,
  position: number,
  status: Equipment["status"] = "open",
  hasOil = false,
): Equipment {
  return {
    id,
    name,
    type,
    status,
    checkpoint,
    zone,
    lane,
    position,
    lastAction: status === "secured" ? "Raised" : status === "open" ? "Lowered" : "Transition",
    lastActionTime: "10:42:15",
    controlMode: "mcp",
    health: {
      power: true,
      battery: true,
      ...(hasOil ? { oilLevel: true } : {}),
    },
    efoActive: false,
  };
}

// =========== WOODLANDS — 15 on-road equipment (5 lanes × 3) + extras ===========
// Each lane: [DAB at pos 0, Bollard at pos 1, Rising Step at pos 2]
export const woodlandsEquipment: Equipment[] = [
  // === Lane 1 (Entry) ===
  eq("WL-L1-DAB-01", "DAB L1-01", "drop-arm-barrier", "woodlands", "entry", 1, 0, "secured", true),
  eq("WL-L1-BL-01", "Bollard L1-01", "auto-bollard", "woodlands", "entry", 1, 1, "open", true),
  eq("WL-L1-RS-01", "Rising Step L1-01", "rising-step", "woodlands", "entry", 1, 2, "secured", true),

  // === Lane 2 (Entry) ===
  eq("WL-L2-DAB-01", "DAB L2-01", "drop-arm-barrier", "woodlands", "entry", 2, 0, "open", true),
  eq("WL-L2-BL-01", "Bollard L2-01", "auto-bollard", "woodlands", "entry", 2, 1, "open", true),
  eq("WL-L2-RS-01", "Rising Step L2-01", "rising-step", "woodlands", "entry", 2, 2, "secured", true),

  // === Lane 3 (Mid) ===
  eq("WL-L3-DAB-01", "DAB L3-01", "drop-arm-barrier", "woodlands", "mid", 3, 0, "secured", true),
  eq("WL-L3-BL-01", "Bollard L3-01", "auto-bollard", "woodlands", "mid", 3, 1, "fault", true),
  eq("WL-L3-RS-01", "Rising Step L3-01", "rising-step", "woodlands", "mid", 3, 2, "secured", true),

  // === Lane 4 (Exit) ===
  eq("WL-L4-DAB-01", "DAB L4-01", "drop-arm-barrier", "woodlands", "exit", 4, 0, "open", true),
  eq("WL-L4-BL-01", "Bollard L4-01", "auto-bollard", "woodlands", "exit", 4, 1, "open", true),
  eq("WL-L4-RS-01", "Rising Step L4-01", "rising-step", "woodlands", "exit", 4, 2, "transit", true),

  // === Lane 5 (Exit) ===
  eq("WL-L5-DAB-01", "DAB L5-01", "drop-arm-barrier", "woodlands", "exit", 5, 0, "open", true),
  eq("WL-L5-BL-01", "Bollard L5-01", "auto-bollard", "woodlands", "exit", 5, 1, "open", true),
  eq("WL-L5-RS-01", "Rising Step L5-01", "rising-step", "woodlands", "exit", 5, 2, "secured", true),

  // === Additional fixed bollards for realism (not on road, zone context only) ===
  eq("WL-Z1-FB-01", "Fixed Bollard Z1-01", "fixed-bollard", "woodlands", "entry", 1, 0, "open"),
  eq("WL-Z2-FB-01", "Fixed Bollard Z2-01", "fixed-bollard", "woodlands", "entry", 2, 0, "open"),
  eq("WL-Z3-FB-01", "Fixed Bollard Z3-01", "fixed-bollard", "woodlands", "mid", 3, 0, "open"),

  // === Card readers (monitoring only) ===
  eq("WL-CR-01", "Card Reader Entry", "card-reader", "woodlands", "entry", 1, 0, "open"),
  eq("WL-CR-02", "Card Reader Mid", "card-reader", "woodlands", "mid", 3, 0, "open"),
  eq("WL-CR-03", "Card Reader Exit", "card-reader", "woodlands", "exit", 5, 0, "open"),

  // === Traffic lights ===
  eq("WL-TL-L1", "Traffic Light L1", "traffic-light", "woodlands", "entry", 1, 0, "secured"),
  eq("WL-TL-L2", "Traffic Light L2", "traffic-light", "woodlands", "entry", 2, 0, "open"),
  eq("WL-TL-L3", "Traffic Light L3", "traffic-light", "woodlands", "mid", 3, 0, "secured"),
  eq("WL-TL-L4", "Traffic Light L4", "traffic-light", "woodlands", "exit", 4, 0, "open"),
  eq("WL-TL-L5", "Traffic Light L5", "traffic-light", "woodlands", "exit", 5, 0, "open"),
];

// =========== TUAS — 12 on-road equipment (4 lanes × 3) + extras ===========
export const tuasEquipment: Equipment[] = [
  // === Lane 1 (Entry) ===
  eq("TU-L1-DAB-01", "DAB L1-01", "drop-arm-barrier", "tuas", "entry", 1, 0, "secured", true),
  eq("TU-L1-BL-01", "Bollard L1-01", "auto-bollard", "tuas", "entry", 1, 1, "open", true),
  eq("TU-L1-RS-01", "Rising Step L1-01", "rising-step", "tuas", "entry", 1, 2, "secured", true),

  // === Lane 2 (Entry) ===
  eq("TU-L2-DAB-01", "DAB L2-01", "drop-arm-barrier", "tuas", "entry", 2, 0, "open", true),
  eq("TU-L2-BL-01", "Bollard L2-01", "auto-bollard", "tuas", "entry", 2, 1, "open", true),
  eq("TU-L2-RS-01", "Rising Step L2-01", "rising-step", "tuas", "entry", 2, 2, "secured", true),

  // === Lane 3 (Mid) ===
  eq("TU-L3-DAB-01", "DAB L3-01", "drop-arm-barrier", "tuas", "mid", 3, 0, "secured", true),
  eq("TU-L3-BL-01", "Bollard L3-01", "auto-bollard", "tuas", "mid", 3, 1, "open", true),
  eq("TU-L3-RS-01", "Rising Step L3-01", "rising-step", "tuas", "mid", 3, 2, "transit", true),

  // === Lane 4 (Exit) ===
  eq("TU-L4-DAB-01", "DAB L4-01", "drop-arm-barrier", "tuas", "exit", 4, 0, "open", true),
  eq("TU-L4-BL-01", "Bollard L4-01", "auto-bollard", "tuas", "exit", 4, 1, "open", true),
  eq("TU-L4-RS-01", "Rising Step L4-01", "rising-step", "tuas", "exit", 4, 2, "secured", true),

  // === Fixed bollards ===
  eq("TU-Z1-FB-01", "Fixed Bollard Z1-01", "fixed-bollard", "tuas", "entry", 1, 0, "open"),
  eq("TU-Z2-FB-01", "Fixed Bollard Z2-01", "fixed-bollard", "tuas", "entry", 2, 0, "open"),
  eq("TU-Z4-FB-01", "Fixed Bollard Z4-01", "fixed-bollard", "tuas", "exit", 4, 0, "open"),

  // === Card readers ===
  eq("TU-CR-01", "Card Reader Entry", "card-reader", "tuas", "entry", 1, 0, "open"),
  eq("TU-CR-02", "Card Reader Mid", "card-reader", "tuas", "mid", 3, 0, "open"),

  // === Traffic lights ===
  eq("TU-TL-L1", "Traffic Light L1", "traffic-light", "tuas", "entry", 1, 0, "secured"),
  eq("TU-TL-L2", "Traffic Light L2", "traffic-light", "tuas", "entry", 2, 0, "open"),
  eq("TU-TL-L4", "Traffic Light L4", "traffic-light", "tuas", "exit", 4, 0, "open"),
];

// =========== INITIAL ALERTS ===========
export const initialAlerts: Alert[] = [
  {
    id: "alert-wl-01",
    severity: "critical",
    message: "WL-L3-BL-01 · Hydraulic pressure below threshold",
    equipmentId: "WL-L3-BL-01",
    timestamp: "10:45:22",
    dismissed: false,
  },
  {
    id: "alert-wl-02",
    severity: "warning",
    message: "WL-L4-RS-01 · Transitioning over 12 seconds",
    equipmentId: "WL-L4-RS-01",
    timestamp: "10:46:08",
    dismissed: false,
  },
];
