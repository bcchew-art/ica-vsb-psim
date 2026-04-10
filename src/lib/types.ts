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

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  checkpoint: "woodlands" | "tuas";
  zone: string;
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
