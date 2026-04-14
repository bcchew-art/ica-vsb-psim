"use client";

import { useState } from "react";

interface ZoneHotspotProps {
  id: string;
  label: string;
  top: string;
  left: string;
  size: string;
  isDemo?: boolean;
  equipmentCount: number;
  onClick: () => void;
}

export function ZoneHotspot({
  id,
  label,
  top,
  left,
  size,
  isDemo = false,
  equipmentCount,
  onClick,
}: ZoneHotspotProps) {
  const [hovered, setHovered] = useState(false);

  // All zones use the same 3D cylinder style to match the DALL-E image cylinders
  // Demo zone gets a subtle highlight + label callout, but same shape language
  const cylinderHeight = "130%";
  const borderAlpha = isDemo ? (hovered ? 1.0 : 0.8) : (hovered ? 0.5 : 0.25);
  const bodyAlpha = isDemo ? (hovered ? 0.4 : 0.28) : (hovered ? 0.08 : 0.03);
  const capAlpha = isDemo ? (hovered ? 0.5 : 0.35) : (hovered ? 0.12 : 0.05);
  const glowSpread = isDemo
    ? (hovered
        ? "0 0 35px rgba(0,221,255,0.8), 0 0 70px rgba(0,221,255,0.5), 0 0 100px rgba(0,221,255,0.2)"
        : "0 0 25px rgba(0,221,255,0.6), 0 0 50px rgba(0,221,255,0.3), 0 0 80px rgba(0,221,255,0.1)")
    : (hovered ? "0 0 15px rgba(0,221,255,0.2)" : "none");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: isDemo ? 20 : 10,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: cylinderHeight,
        }}
      >
        {/* Body — vertical sides */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            bottom: "22%",
            left: "2%",
            right: "2%",
            background: `linear-gradient(90deg, transparent 0%, rgba(0,221,255,${bodyAlpha}) 30%, rgba(0,221,255,${bodyAlpha * 1.3}) 50%, rgba(0,221,255,${bodyAlpha}) 70%, transparent 100%)`,
            borderLeft: `1px solid rgba(0,221,255,${borderAlpha * 0.7})`,
            borderRight: `1px solid rgba(0,221,255,${borderAlpha * 0.7})`,
            transition: "all 300ms",
          }}
        />

        {/* Top ellipse cap */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: 0,
            right: 0,
            paddingBottom: "25%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 50% 40%, rgba(0,221,255,${capAlpha}) 0%, rgba(0,221,255,${capAlpha * 0.4}) 50%, transparent 100%)`,
            border: `1.5px solid rgba(0,221,255,${borderAlpha})`,
            boxShadow: glowSpread,
            transition: "all 300ms",
            animation: isDemo ? "zone-pulse-demo 2.5s ease-in-out infinite" : undefined,
          }}
        />

        {/* Bottom ellipse */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: 0,
            right: 0,
            paddingBottom: "25%",
            borderRadius: "50%",
            borderBottom: `1.5px solid rgba(0,221,255,${borderAlpha * 0.8})`,
            borderLeft: `1px solid rgba(0,221,255,${borderAlpha * 0.4})`,
            borderRight: `1px solid rgba(0,221,255,${borderAlpha * 0.4})`,
            borderTop: "none",
            transition: "all 300ms",
          }}
        />

        {/* Label — centered */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: isDemo ? "clamp(8px, 1.2vw, 11px)" : "clamp(6px, 0.9vw, 9px)",
              fontWeight: 700,
              color: isDemo ? "#ffffff" : "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
              textShadow: "0 0 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            ZONE {id}
          </span>
          {equipmentCount > 0 && (
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "clamp(5px, 0.7vw, 8px)",
                color: "rgba(255,255,255,0.35)",
                marginTop: "2px",
                lineHeight: 1,
              }}
            >
              {equipmentCount}eq
            </span>
          )}
        </div>

        {/* Demo callout badge — only for Zone 8 */}
        {isDemo && (
          <span
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "7px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#fff",
              background: "rgba(0, 180, 255, 0.6)",
              borderRadius: "3px",
              padding: "2px 6px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 5,
            }}
          >
            CLICK TO ENTER
          </span>
        )}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5,10,21,0.95)",
            border: `1px solid rgba(0,221,255,${isDemo ? 0.4 : 0.25})`,
            borderRadius: "4px",
            padding: "4px 10px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "10px",
            color: "#fff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {label}
          {isDemo && (
            <span style={{ color: "#00ddff", marginLeft: "6px" }}>
              — Click to enter
            </span>
          )}
        </div>
      )}
    </div>
  );
}
