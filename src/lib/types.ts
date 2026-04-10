export type EquipmentStatus = "secured" | "open" | "transit" | "fault" | "offline";

export type EquipmentType =
  | "rising-step"
  | "fixed-bollard"
  | "auto-bollard"
  | "sliding-bollard"
  | "drop-arm-barrier"
  | "sliding-gate"
  | "traffic-light"
  | "card-reader";

// 5-layer control per eval criteria 3.2.1:
//   mcp  = Master Control Panel (COR / PSIM)
//   rcp  = Remote Control Panel (wired at guard house)
//   op   = Observation Post (officer at viewing post)
//   hpu  = VSB Control Unit (Hydraulic Pump Unit / Electrical Control Unit — at the equipment)
//   wrcd = Wireless Remote Control Device (roaming handheld)
export type ControlMode = "mcp" | "rcp" | "op" | "hpu" | "wrcd";

export type AlertSeverity = "critical" | "warning" | "info";

export type Checkpoint = "woodlands" | "tuas";

export type Zone = "entry" | "mid" | "exit";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  checkpoint: Checkpoint;
  zone: Zone;
  lane: number;        // 1-5 for Woodlands, 1-4 for Tuas
  position: number;    // 0-4, index within the lane (left to right)
  lastAction: string;
  lastActionTime: string;
  controlMode: ControlMode;
  health: {
    power: boolean;
    battery: boolean;
    oilLevel?: boolean;
  };
  efoActive: boolean;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  equipmentId?: string;
  timestamp: string;
  dismissed: boolean;
}
