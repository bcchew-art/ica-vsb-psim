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

  const demoColor = "#00ddff";
  const normalColor = "rgba(42, 90, 138, 0.4)";
  const demoBg = hovered ? "rgba(0, 221, 255, 0.1)" : "rgba(0, 221, 255, 0.04)";
  const normalBg = hovered ? "rgba(42, 90, 138, 0.15)" : "transparent";

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
        // Use paddingBottom = size to make it a square, then border-radius 50% = circle
        paddingBottom: size,
        height: 0,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        borderRadius: "50%",
        boxSizing: "border-box",
        transition: "background-color 200ms, box-shadow 200ms",
        animation: isDemo
          ? "zone-pulse-demo 2s ease-in-out infinite"
          : "zone-pulse 2.5s ease-in-out infinite",
        backgroundColor: isDemo ? demoBg : normalBg,
        border: `2px solid ${
          hovered
            ? isDemo
              ? "rgba(0, 221, 255, 0.9)"
              : "rgba(42, 90, 138, 0.8)"
            : isDemo
            ? "rgba(0, 221, 255, 0.4)"
            : normalColor
        }`,
        zIndex: isDemo ? 20 : 10,
      }}
    >
      {/* Zone number label — centered */}
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
            fontFamily: "monospace",
            fontSize: "clamp(8px, 1.2vw, 12px)",
            fontWeight: 700,
            color: isDemo ? demoColor : "rgba(255,255,255,0.6)",
            letterSpacing: "0.05em",
            textShadow: "0 0 8px rgba(0,0,0,0.9)",
            lineHeight: 1,
          }}
        >
          {id}
        </span>
        {equipmentCount > 0 && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(6px, 0.8vw, 9px)",
              color: isDemo ? "rgba(0,221,255,0.7)" : "rgba(255,255,255,0.3)",
              marginTop: "2px",
              lineHeight: 1,
            }}
          >
            {equipmentCount}eq
          </span>
        )}
      </div>

      {/* DEMO badge — top of circle */}
      {isDemo && (
        <span
          style={{
            position: "absolute",
            top: "-18px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: demoColor,
            background: "rgba(0, 221, 255, 0.12)",
            border: "1px solid rgba(0, 221, 255, 0.45)",
            borderRadius: "3px",
            padding: "1px 5px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          DEMO
        </span>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 22px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5,10,21,0.95)",
            border: `1px solid ${isDemo ? "rgba(0,221,255,0.35)" : "rgba(42,90,138,0.5)"}`,
            borderRadius: "4px",
            padding: "4px 10px",
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#fff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {label}
          {isDemo && (
            <span style={{ color: demoColor, marginLeft: "6px" }}>
              — Click to enter
            </span>
          )}
        </div>
      )}
    </div>
  );
}
