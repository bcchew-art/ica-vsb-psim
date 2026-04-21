"use client";

import { useState } from "react";
import { BARRIER_COLORS, type BarrierLocation } from "@/lib/barrier-locations";

interface BarrierMarkerProps {
  barrier: BarrierLocation;
}

export function BarrierMarker({ barrier }: BarrierMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const color = BARRIER_COLORS[barrier.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${barrier.type} at Zone ${barrier.zone} ${barrier.mapRef} Lane ${barrier.lane}`}
      style={{
        position: "absolute",
        top: `${barrier.y}%`,
        left: `${barrier.x}%`,
        transform: "translate(-50%, -50%)",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: color,
        border: "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: hovered
          ? `0 0 10px ${color}, 0 0 20px ${color}AA, 0 0 32px ${color}55`
          : `0 0 6px ${color}CC, 0 0 14px ${color}66`,
        cursor: "pointer",
        zIndex: hovered ? 35 : 15,
        transition: "box-shadow 160ms, transform 160ms",
        ...(hovered ? { transform: "translate(-50%, -50%) scale(1.35)" } : null),
      }}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5,10,21,0.96)",
            border: `1px solid ${color}`,
            borderRadius: "4px",
            padding: "5px 9px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "10px",
            color: "#e0f0ff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 60,
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontWeight: 700, color }}>
            {barrier.type}
          </div>
          <div style={{ color: "#8aaac0", fontSize: "9px", marginTop: "2px" }}>
            Zone {barrier.zone} &middot; Map {barrier.mapRef} &middot; Lane {barrier.lane}
          </div>
        </div>
      )}
    </div>
  );
}
