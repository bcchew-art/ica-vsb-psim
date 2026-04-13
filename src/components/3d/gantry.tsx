"use client";

import { useMemo } from "react";
import type { CheckpointLayout, GantryConfig } from "@/lib/checkpoint-layout";

interface Props {
  layout: CheckpointLayout;
  config: GantryConfig;
}

export function Gantry({ layout, config }: Props) {
  // Beam spans across all lanes along the Z axis
  const beamLength = useMemo(
    () => (layout.laneCount - 1) * layout.laneSpacing + layout.laneWidth + 4,
    [layout],
  );
  const beamY = 5.5;
  const pillarHeight = 5.5;
  const pillarInsetZ = beamLength / 2;

  const cams = useMemo(() => {
    const totalLaneZ = (layout.laneCount - 1) * layout.laneSpacing;
    const firstZ = -totalLaneZ / 2;
    return Array.from({ length: config.cameraCount }, (_, i) => ({
      z: firstZ + i * layout.laneSpacing,
    }));
  }, [layout, config.cameraCount]);

  return (
    <group position={[config.worldX, 0, 0]}>
      {/* Main beam — neutral steel gray */}
      <mesh position={[0, beamY, 0]} castShadow>
        <boxGeometry args={[0.7, 0.55, beamLength]} />
        <meshStandardMaterial color="#7a808a" metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Secondary lower structural rail */}
      <mesh position={[0, beamY - 0.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, beamLength]} />
        <meshStandardMaterial color="#6a707a" metalness={0.55} roughness={0.55} />
      </mesh>

      {/* Pillars — steel gray, square cross-section */}
      <mesh position={[0, pillarHeight / 2, pillarInsetZ]} castShadow>
        <boxGeometry args={[0.55, pillarHeight, 0.55]} />
        <meshStandardMaterial color="#7a808a" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[0, pillarHeight / 2, -pillarInsetZ]} castShadow>
        <boxGeometry args={[0.55, pillarHeight, 0.55]} />
        <meshStandardMaterial color="#7a808a" metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Pillar base plates */}
      <mesh position={[0, 0.05, pillarInsetZ]}>
        <boxGeometry args={[0.85, 0.1, 0.85]} />
        <meshStandardMaterial color="#50565e" metalness={0.45} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, -pillarInsetZ]}>
        <boxGeometry args={[0.85, 0.1, 0.85]} />
        <meshStandardMaterial color="#50565e" metalness={0.45} roughness={0.6} />
      </mesh>

      {/* Camera housings */}
      {cams.map((c, i) => (
        <group key={i} position={[0, beamY - 0.42, c.z]}>
          {/* Housing body — dark gray */}
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.45, 0.55]} />
            <meshStandardMaterial color="#3a3e46" metalness={0.65} roughness={0.4} />
          </mesh>
          {/* Lens barrel */}
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.3, 16]} />
            <meshStandardMaterial color="#2a2e36" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Lens glass — subtle cyan tint */}
          <mesh position={[-0.505, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
            <meshStandardMaterial
              color="#4a5a70"
              metalness={0.3}
              roughness={0.15}
              emissive="#38bdf8"
              emissiveIntensity={0.35}
            />
          </mesh>
          {/* Small status LED — tiny accent, not neon */}
          <mesh position={[0.18, 0.12, 0.28]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
