"use client";

import { useState } from "react";
import { EquipmentLocation, EQUIPMENT_LABELS } from "@/lib/checkpoint-data";

interface EquipmentMarkerProps {
  location: EquipmentLocation;
  color: string;
  style: React.CSSProperties;
  isSelected: boolean;
  onClick: () => void;
}

export function EquipmentMarker({
  location,
  color,
  style,
  isSelected,
  onClick,
}: EquipmentMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const size = isSelected ? 18 : 14;
  const glowStrength = isSelected ? "strong" : hovered ? "medium" : "soft";

  const glowShadow = {
    soft: `0 0 6px ${color}80, 0 0 12px ${color}40`,
    medium: `0 0 8px ${color}, 0 0 16px ${color}80`,
    strong: `0 0 10px ${color}, 0 0 20px ${color}99, 0 0 30px ${color}40`,
  }[glowStrength];

  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: isSelected ? 30 : hovered ? 20 : 10,
        ...style,
      }}
    >
      {/* Tooltip above */}
      {(hovered || isSelected) && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5,10,21,0.95)",
            border: `1px solid ${color}60`,
            borderRadius: "4px",
            padding: "4px 8px",
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#fff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: color, fontWeight: 700 }}>
            {EQUIPMENT_LABELS[location.type]}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)" }}>
            Map {location.mapRef} · S/N {location.sn}
          </div>
        </div>
      )}

      {/* Dot */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Equipment ${location.mapRef}`}
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: glowShadow,
          cursor: "pointer",
          transition: "width 150ms, height 150ms, box-shadow 150ms",
          transform: hovered && !isSelected ? "scale(1.3)" : "scale(1)",
          animation: isSelected ? "marker-pulse 1.5s ease-in-out infinite" : undefined,
          border: isSelected ? `2px solid #fff` : "none",
          boxSizing: "border-box",
        }}
      />

      {/* Label below */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          fontSize: "8px",
          color: "rgba(255,255,255,0.5)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        {location.mapRef}
      </div>
    </div>
  );
}
