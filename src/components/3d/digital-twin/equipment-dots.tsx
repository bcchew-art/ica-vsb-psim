"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh } from "three";
import { tuasCheckpoint, EQUIPMENT_COLORS } from "@/lib/checkpoint-data";
import type { EquipmentLocation } from "@/lib/checkpoint-data";

// ── Coordinate conversion ──────────────────────────────────────────────────
function svgToWorld(x: number, y: number): [number, number, number] {
  // Map SVG 0-1000 coords to image plane space (160x107 centered at origin)
  // worldX: SVG 0..1000 → -80..+80 (scale 0.16)
  // worldZ: SVG 0..800 → -48..+48 (scale 0.12, centered on 400)
  const worldX = (x - 500) * 0.16;
  const worldZ = (y - 400) * 0.12;
  return [worldX, 0, worldZ];
}

// ── Single equipment dot — pin style ──────────────────────────────────────
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
  const sphereRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);

  const base = useMemo(() => svgToWorld(loc.x, loc.y), [loc.x, loc.y]);
  // Position the group at ground level; sphere sits on top of stem
  const position: [number, number, number] = [base[0], base[1], base[2]];
  const color = EQUIPMENT_COLORS[loc.type] ?? "#ffffff";

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Scale orb on hover/select
    if (sphereRef.current) {
      const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1.0;
      const cur = sphereRef.current.scale.x;
      const next = cur + (targetScale - cur) * 0.15;
      sphereRef.current.scale.setScalar(next);
    }

    // Rotate ground ring slowly
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.012;
      const mat = ringRef.current.material as { opacity: number };
      if (isSelected || isHovered) {
        mat.opacity = 0.5 + Math.sin(t * 4) * 0.2;
      } else {
        mat.opacity = 0.25;
      }
    }

    // Outer ring pulses on select
    if (outerRingRef.current) {
      outerRingRef.current.visible = isSelected;
      if (isSelected) {
        const s = 1 + Math.sin(t * 3) * 0.12;
        outerRingRef.current.scale.set(s, s, 1);
        const mat = outerRingRef.current.material as { opacity: number };
        mat.opacity = 0.3 + Math.sin(t * 3) * 0.15;
      }
    }
  });

  return (
    <group position={position}>
      {/* Vertical stem from ground to orb */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Ground ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.0, 1.3, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.0}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Outer pulse ring (selection only) */}
      <mesh
        ref={outerRingRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[1.5, 1.9, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.0}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Glowing orb */}
      <mesh
        ref={sphereRef}
        position={[0, 1.6, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverIn(); }}
        onPointerOut={(e) => { e.stopPropagation(); onHoverOut(); }}
      >
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={5.0}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Hover tooltip */}
      {isHovered && (
        <Html
          position={[0, 3.2, 0]}
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
            <div style={{ color, fontWeight: "bold" }}>{loc.mapRef}</div>
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
          position={[2.5, 1.6, 0]}
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
