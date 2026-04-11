"use client";

import { useMemo } from "react";
import type { CheckpointLayout, GantryConfig } from "@/lib/checkpoint-layout";
import { brushedMetal } from "@/lib/3d/materials";

interface Props {
  layout: CheckpointLayout;
  config: GantryConfig;
}

export function Gantry({ layout, config }: Props) {
  // Beam spans across all lanes along the Z axis:
  // length = (laneCount - 1) * laneSpacing + laneWidth + margin
  const beamLength = useMemo(
    () => (layout.laneCount - 1) * layout.laneSpacing + layout.laneWidth + 4,
    [layout],
  );
  const beamY = 5.5;
  const pillarHeight = 5.5;
  const pillarInsetZ = beamLength / 2;

  const cams = useMemo(() => {
    // Evenly space cameras along the beam (one per lane center).
    const totalLaneZ = (layout.laneCount - 1) * layout.laneSpacing;
    const firstZ = -totalLaneZ / 2;
    return Array.from({ length: config.cameraCount }, (_, i) => ({
      z: firstZ + i * layout.laneSpacing,
    }));
  }, [layout, config.cameraCount]);

  return (
    <group position={[config.worldX, 0, 0]}>
      {/* Beam along Z axis at height 5.5 */}
      <mesh position={[0, beamY, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, beamLength]} />
        <primitive object={brushedMetal()} attach="material" />
      </mesh>
      {/* Pillar near side (+Z) */}
      <mesh position={[0, pillarHeight / 2, pillarInsetZ]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, pillarHeight, 12]} />
        <primitive object={brushedMetal()} attach="material" />
      </mesh>
      {/* Pillar far side (-Z) */}
      <mesh position={[0, pillarHeight / 2, -pillarInsetZ]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, pillarHeight, 12]} />
        <primitive object={brushedMetal()} attach="material" />
      </mesh>
      {/* Camera housings distributed along the beam */}
      {cams.map((c, i) => (
        <group key={i} position={[0, beamY - 0.3, c.z]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.18, 0.25]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.14]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
