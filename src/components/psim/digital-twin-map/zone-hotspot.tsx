"use client";

import { useState } from "react";

interface ZoneHotspotProps {
  id: string;
  label: string;
  style: React.CSSProperties;
  isDemo?: boolean;
  equipmentCount: number;
  onClick: () => void;
}

export function ZoneHotspot({
  id,
  label,
  style,
  isDemo = false,
  equipmentCount,
  onClick,
}: ZoneHotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Zone ${label}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        cursor: "pointer",
        borderRadius: "8px",
        boxSizing: "border-box",
        transition: "background-color 200ms, box-shadow 200ms",
        animation: isDemo ? "zone-pulse-demo 2s ease-in-out infinite" : "zone-pulse 2.5s ease-in-out infinite",
        backgroundColor: hovered
          ? isDemo
            ? "rgba(0, 221, 255, 0.1)"
            : "rgba(0, 200, 255, 0.08)"
          : "transparent",
        border: hovered
          ? isDemo
            ? "2px solid rgba(0, 221, 255, 0.9)"
            : "2px solid rgba(0, 200, 255, 0.6)"
          : undefined,
        ...style,
      }}
    >
      {/* Zone label top-left */}
      <span
        style={{
          position: "absolute",
          top: "6px",
          left: "8px",
          fontFamily: "monospace",
          fontSize: "9px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: isDemo ? "#00ddff" : "rgba(255,255,255,0.7)",
          fontWeight: 600,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          textShadow: "0 0 8px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>

      {/* Demo badge */}
      {isDemo && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "8px",
            fontFamily: "monospace",
            fontSize: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#00ddff",
            background: "rgba(0, 221, 255, 0.15)",
            border: "1px solid rgba(0, 221, 255, 0.4)",
            borderRadius: "3px",
            padding: "1px 5px",
            pointerEvents: "none",
          }}
        >
          DEMO
        </span>
      )}

      {/* Equipment count badge bottom-right */}
      <span
        style={{
          position: "absolute",
          bottom: "6px",
          right: "8px",
          fontFamily: "monospace",
          fontSize: "9px",
          color: isDemo ? "#00ddff" : "rgba(255,255,255,0.5)",
          background: "rgba(0,0,0,0.5)",
          borderRadius: "10px",
          padding: "1px 6px",
          pointerEvents: "none",
        }}
      >
        {equipmentCount} eq
      </span>

      {/* Hover tooltip: zone id (center) */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "6px",
            background: "rgba(5,10,21,0.92)",
            border: "1px solid rgba(0,200,255,0.3)",
            borderRadius: "4px",
            padding: "3px 8px",
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#fff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          Zone {id} — {label}
          {isDemo && (
            <span style={{ color: "#00ddff", marginLeft: "6px" }}>
              Click to enter
            </span>
          )}
        </div>
      )}
    </div>
  );
}
