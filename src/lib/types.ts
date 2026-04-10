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

export type ControlMode = "mcp" | "rcp" | "wrcd";

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
