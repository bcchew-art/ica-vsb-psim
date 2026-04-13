"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import { DoubleSide, Mesh } from "three";

export interface ZoneConfig {
  id: string;
  label: string;
  description: string;
  position: [number, number, number]; // x, y(height-center), z
  radius: number;
  height: number;
  color: string;
  isDemo?: boolean;
  equipmentCount: number;
}

export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    id: "A",
    label: "WEST ENTRY",
    description: "JB approach blockers + road humps",
    position: [-75, 7.5, 5],
    radius: 15,
    height: 15,
    color: "#3b82f6",
    equipmentCount: 3,
  },
  {
    id: "B",
    label: "SOUTH APPROACH",
    description: "Mixed blockers + road humps",
    position: [-40, 7.5, 35],
    radius: 18,
    height: 15,
    color: "#8b5cf6",
    equipmentCount: 5,
  },
  {
    id: "C",
    label: "EAST GATE",
    description: "SG approach — DEMO ZONE",
    position: [65, 7.5, 0],
    radius: 18,
    height: 15,
    color: "#06B6D4",
    isDemo: true,
    equipmentCount: 4,
  },
  {
    id: "D",
    label: "NORTH RETURN",
    description: "Return lanes, bollards",
    position: [30, 7.5, -35],
    radius: 15,
    height: 15,
    color: "#10b981",
    equipmentCount: 4,
  },
  {
    id: "E",
    label: "INTERNAL",
    description: "Within building",
    position: [0, 7.5, 15],
    radius: 12,
    height: 15,
    color: "#f59e0b",
    equipmentCount: 4,
  },
  {
    id: "F",
    label: "BRIDGE L3",
    description: "Level 3 bridge equipment",
    position: [-80, 7.5, -25],
    radius: 22,
    height: 15,
    color: "#ec4899",
    equipmentCount: 12,
  },
];

function PulsingZone({
  zone,
  isSelected,
  onClick,
}: {
  zone: ZoneConfig;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cylinderRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);
  const scanRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Cylinder opacity — slow pulse
    if (cylinderRef.current) {
      const mat = cylinderRef.current.material as { opacity: number };
      const base = zone.isDemo ? 0.13 : isSelected ? 0.10 : 0.05;
      mat.opacity = base + Math.sin(t * (zone.isDemo ? 1.8 : 1.2)) * 0.03;
    }

    // Base ring scale pulse
    if (ringRef.current) {
      const pulse = zone.isDemo || isSelected;
      if (pulse) {
        const s = 1 + Math.sin(t * (zone.isDemo ? 2.5 : 3)) * 0.05;
        ringRef.current.scale.set(s, 1, s);
      }
    }

    // Outer ring slow rotation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.006;
    }

    // Vertical scan line: oscillates up and down inside cylinder
    if (scanRef.current) {
      const halfH = zone.height / 2;
      // y relative to group center (which is zone.position[1])
      const scanY = Math.sin(t * 1.5) * halfH * 0.85;
      scanRef.current.position.y = scanY;
      const mat = scanRef.current.material as { opacity: number };
      mat.opacity = 0.12 + Math.sin(t * 3) * 0.06;
    }
  });

  const opacity = zone.isDemo ? 0.15 : isSelected ? 0.12 : 0.06;
  const ringOpacity = zone.isDemo ? 0.8 : isSelected ? 0.7 : 0.4;

  return (
    <group
      position={zone.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* Zone cylinder volume */}
      <mesh ref={cylinderRef}>
        <cylinderGeometry args={[zone.radius, zone.radius, zone.height, 48, 1, true]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={opacity}
          side={DoubleSide}
        />
      </mesh>

      {/* Vertical scan plane — thin horizontal disc that travels up/down */}
      <mesh ref={scanRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[zone.radius - 0.5, 48]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={0.12}
          side={DoubleSide}
        />
      </mesh>

      {/* Base ring — inner */}
      <mesh
        ref={ringRef}
        position={[0, -zone.height / 2 + 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[zone.radius - 0.8, zone.radius + 0.8, 64]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={ringOpacity}
          side={DoubleSide}
        />
      </mesh>

      {/* Base ring — outer (slowly rotating dashed feel) */}
      <mesh
        ref={outerRingRef}
        position={[0, -zone.height / 2 + 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[zone.radius + 1.5, zone.radius + 3.0, 32]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={ringOpacity * 0.3}
          side={DoubleSide}
        />
      </mesh>

      {/* Top ring */}
      <mesh
        position={[0, zone.height / 2 - 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[zone.radius - 1.5, zone.radius, 64]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={ringOpacity * 0.5}
          side={DoubleSide}
        />
      </mesh>

      {/* Zone label */}
      <Text
        position={[0, zone.height / 2 + 3, 0]}
        fontSize={2.2}
        color={zone.isDemo ? "#06B6D4" : "#8899b0"}
        anchorX="center"
        anchorY="middle"
        fillOpacity={zone.isDemo ? 1.0 : 0.8}
      >
        {`[${zone.id}] ${zone.label}`}
      </Text>

      {/* Equipment count */}
      <Text
        position={[0, zone.height / 2 + 0.5, 0]}
        fontSize={1.4}
        color={zone.color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.9}
      >
        {`${zone.equipmentCount} units`}
      </Text>

      {/* Demo badge */}
      {zone.isDemo && (
        <Html
          position={[0, zone.height / 2 + 7, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(6,182,212,0.15)",
              border: "1px solid #06B6D4",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#06B6D4",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
            }}
          >
            ◆ DEMO ZONE
          </div>
        </Html>
      )}

      {/* Selected detail popup */}
      {isSelected && (
        <Html
          position={[zone.radius + 4, 0, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(5,10,21,0.9)",
              border: `1px solid ${zone.color}`,
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#8899b0",
              minWidth: "150px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                color: zone.color,
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              ZONE {zone.id} — {zone.label}
            </div>
            <div>{zone.description}</div>
            <div style={{ marginTop: "4px", color: "#ffffff" }}>
              {zone.equipmentCount} equipment units
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function TwinZones({
  selectedZone,
  onSelectZone,
}: {
  selectedZone: string | null;
  onSelectZone: (id: string | null) => void;
}) {
  return (
    <group>
      {ZONE_CONFIGS.map((zone) => (
        <PulsingZone
          key={zone.id}
          zone={zone}
          isSelected={selectedZone === zone.id}
          onClick={() =>
            onSelectZone(selectedZone === zone.id ? null : zone.id)
          }
        />
      ))}
    </group>
  );
}
