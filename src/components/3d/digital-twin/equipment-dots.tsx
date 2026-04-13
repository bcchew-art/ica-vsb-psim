"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, Color } from "three";
import { tuasCheckpoint, EQUIPMENT_COLORS } from "@/lib/checkpoint-data";
import type { EquipmentLocation } from "@/lib/checkpoint-data";

// ── Coordinate conversion ──────────────────────────────────────────────────
// SVG space: 0-1000 x, 0-800 y  →  3D world space centered at origin
function svgToWorld(x: number, y: number): [number, number, number] {
  const worldX = (x - 500) * 0.22;
  const worldZ = (y - 400) * 0.22;
  return [worldX, 1.5, worldZ];
}

// ── Single equipment dot ──────────────────────────────────────────────────
function EquipmentDot({
  loc,
  isSelected,
  isHovered,
  onClick,
  onHoverIn,
  onHoverOut,
}: {
  loc: EquipmentLocation;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const position = useMemo(() => svgToWorld(loc.x, loc.y), [loc.x, loc.y]);
  const color = EQUIPMENT_COLORS[loc.type] ?? "#ffffff";

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Hover/select scale
    const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1.0;
    meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as never, 0.15);

    // Pulsing ring on selection
    if (ringRef.current) {
      ringRef.current.visible = isSelected;
      if (isSelected) {
        const s = 1 + Math.sin(t * 4) * 0.2;
        ringRef.current.scale.set(s, 1, s);
        const mat = ringRef.current.material as { opacity: number };
        mat.opacity = 0.6 + Math.sin(t * 4) * 0.3;
      }
    }
  });

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverIn(); }}
        onPointerOut={(e) => { e.stopPropagation(); onHoverOut(); }}
      >
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.0}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Selection pulse ring */}
      <mesh
        ref={ringRef}
        position={[0, -1.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Hover tooltip */}
      {isHovered && (
        <Html
          position={[0, 2.5, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(5,10,21,0.92)",
              border: `1px solid ${color}`,
              borderRadius: "5px",
              padding: "5px 9px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#d1e0f0",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}
          >
            <div style={{ color, fontWeight: "bold" }}>
              {loc.mapRef}
            </div>
            <div>{loc.type.replace(/-/g, " ").toUpperCase()}</div>
            <div style={{ color: "#8899b0", fontSize: "9px", marginTop: "2px" }}>
              {loc.direction}
            </div>
          </div>
        </Html>
      )}

      {/* Selected detail panel */}
      {isSelected && (
        <Html
          position={[2.5, 0, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(5,10,21,0.95)",
              border: `1px solid ${color}`,
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#8899b0",
              minWidth: "160px",
              backdropFilter: "blur(8px)",
              boxShadow: `0 0 12px ${color}44`,
            }}
          >
            <div style={{ color, fontWeight: "bold", fontSize: "11px", marginBottom: "4px" }}>
              S/N {loc.sn} — {loc.mapRef}
            </div>
            <div><span style={{ color: "#4a6a9a" }}>TYPE </span>{loc.type.replace(/-/g, " ").toUpperCase()}</div>
            <div><span style={{ color: "#4a6a9a" }}>DIR  </span>{loc.direction}</div>
            <div><span style={{ color: "#4a6a9a" }}>LOC  </span>{loc.installLocation}</div>
            <div><span style={{ color: "#4a6a9a" }}>VEH  </span>{loc.vehicleType}</div>
            {loc.cctv === "Y" && (
              <div style={{ color: "#22c55e", marginTop: "4px" }}>● CCTV EQUIPPED</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function EquipmentDots({
  selectedDot,
  onSelectDot,
}: {
  selectedDot: number | null;
  onSelectDot: (sn: number | null) => void;
}) {
  const [hoveredSn, setHoveredSn] = useState<number | null>(null);
  const locations = useMemo(() => tuasCheckpoint.locations, []);

  return (
    <group>
      {locations.map((loc) => (
        <EquipmentDot
          key={loc.sn}
          loc={loc}
          isSelected={selectedDot === loc.sn}
          isHovered={hoveredSn === loc.sn}
          onClick={() => onSelectDot(selectedDot === loc.sn ? null : loc.sn)}
          onHoverIn={() => {
            setHoveredSn(loc.sn);
            document.body.style.cursor = "pointer";
          }}
          onHoverOut={() => {
            setHoveredSn((prev) => (prev === loc.sn ? null : prev));
            document.body.style.cursor = "default";
          }}
        />
      ))}
    </group>
  );
}
