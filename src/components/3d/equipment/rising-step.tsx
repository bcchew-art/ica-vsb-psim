"use client";

import { useSpring, animated } from "@react-spring/three";
import type { Equipment } from "@/lib/types";
import { paintedSteel, chevron, statusEmissiveColor } from "@/lib/3d/materials";
import { StatusDisc } from "./status-disc";

const AnimatedGroup = animated("group");

interface Props {
  equipment: Equipment;
  laneWidth: number;
  onClick?: () => void;
}

// Anti-ram plate barrier: translates vertically out of a pit.
// Raised   -> vertical wall fully extruded above road surface
// Lowered  -> slab fully retracted into pit, top flush with road
const SLAB_DEPTH_X = 1.1;           // thickness along traffic direction (X)
const SLAB_WIDTH_Z_FACTOR = 0.9;    // of laneWidth
const SLAB_HEIGHT = 1.2;            // full vertical height when raised

export function RisingStep({ equipment, laneWidth, onClick }: Props) {
  // During transit, the spring target must match the intended FINAL state via lastAction.
  const isRaised = (() => {
    if (equipment.status === "transit") {
      return equipment.lastAction === "Raising";
    }
    return equipment.status === "secured";
  })();
  // When raised: slab CENTER at +H/2, so bottom sits on road (y=0) and top at +H.
  // When lowered: leave ~10cm of the slab top sticking up above road so operators
  // can still see where the equipment is (the chevron top is visible).
  const targetY = isRaised ? SLAB_HEIGHT / 2 : -(SLAB_HEIGHT / 2 - 0.1);

  const [spring] = useSpring(
    () => ({
      y: targetY,
      config: { mass: 2.0, tension: 48, friction: 18 },
    }),
    [targetY],
  );

  const slabWidthZ = laneWidth * SLAB_WIDTH_Z_FACTOR;
  const emissive = statusEmissiveColor(equipment.status);

  return (
    <group onClick={onClick}>
      <StatusDisc status={equipment.status} radius={1.15} />
      {/* Pit rim — dark rectangle at road level showing the opening where the slab retracts */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[SLAB_DEPTH_X + 0.12, 0.02, slabWidthZ + 0.12]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.85} />
      </mesh>

      {/* The slab — translates vertically between raised and retracted */}
      <AnimatedGroup position-y={spring.y}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[SLAB_DEPTH_X, SLAB_HEIGHT, slabWidthZ]} />
          <primitive object={paintedSteel()} attach="material" />
        </mesh>
        {/* Front wall face (at -X, facing Malaysia / incoming traffic) — chevron warning */}
        <mesh
          position={[-SLAB_DEPTH_X / 2 - 0.002, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[slabWidthZ, SLAB_HEIGHT]} />
          <primitive object={chevron()} attach="material" />
        </mesh>
        {/* Top face — chevron visible from above when slab is raised */}
        <mesh
          position={[0, SLAB_HEIGHT / 2 + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[SLAB_DEPTH_X, slabWidthZ]} />
          <primitive object={chevron()} attach="material" />
        </mesh>
      </AnimatedGroup>

      {/* Status LED on the housing rim, visible regardless of slab position */}
      <mesh position={[SLAB_DEPTH_X / 2 + 0.18, 0.08, slabWidthZ / 2 + 0.15]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={equipment.status === "transit" ? 1.5 : 0.8}
        />
      </mesh>
    </group>
  );
}
