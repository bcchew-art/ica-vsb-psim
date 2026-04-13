"use client";

import { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import type { Group } from "three";
import type { Equipment } from "@/lib/types";
import { paintedSteel, chevron, statusEmissiveColor } from "@/lib/3d/materials";
import { StatusDisc } from "./status-disc";

const AnimatedGroup = animated("group");

interface Props {
  equipment: Equipment;
  laneWidth: number;
  onClick?: () => void;
}

const POST_HEIGHT = 1.1;
const POST_RADIUS = 0.22;

export function BollardArray({ equipment, laneWidth, onClick }: Props) {
  // During transit, the spring target must match the intended FINAL state,
  // determined by lastAction (Raising/Lowering), not by the transient status.
  const isRaised = (() => {
    if (equipment.status === "transit") {
      return equipment.lastAction === "Raising";
    }
    return equipment.status === "secured";
  })();
  // When lowered, leave the top ~10cm of the post visible above the road so
  // operators can still see where the equipment is.
  const targetY = isRaised ? 0 : -(POST_HEIGHT - 0.1);

  const [spring] = useSpring(
    () => ({
      y: targetY,
      config: { mass: 1.2, tension: 45, friction: 14 },
    }),
    [targetY],
  );

  const rootRef = useRef<Group>(null);

  // Spread 3 posts evenly across ~75% of lane width in the Z direction
  const span = laneWidth * 0.75;
  const postZ = [-span / 2, 0, span / 2];
  const emissive = statusEmissiveColor(equipment.status);

  return (
    <group ref={rootRef} onClick={onClick}>
      <StatusDisc status={equipment.status} radius={1.15} />
      {postZ.map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* Base plate */}
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[POST_RADIUS + 0.05, POST_RADIUS + 0.05, 0.05, 16]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.5} />
          </mesh>
          {/* Animated post — travels in Y */}
          <AnimatedGroup position-y={spring.y}>
            <mesh position={[0, POST_HEIGHT / 2 + 0.05, 0]} castShadow>
              <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 16]} />
              <primitive object={paintedSteel()} attach="material" />
            </mesh>
            {/* Chevron warning band */}
            <mesh position={[0, POST_HEIGHT * 0.55, 0]} castShadow>
              <cylinderGeometry args={[POST_RADIUS + 0.005, POST_RADIUS + 0.005, 0.18, 16]} />
              <primitive object={chevron()} attach="material" />
            </mesh>
            {/* Status emissive cap */}
            <mesh position={[0, POST_HEIGHT + 0.03, 0]}>
              <cylinderGeometry args={[POST_RADIUS * 0.6, POST_RADIUS * 0.6, 0.03, 16]} />
              <meshStandardMaterial
                color={emissive}
                emissive={emissive}
                emissiveIntensity={equipment.status === "transit" ? 1.5 : 0.8}
              />
            </mesh>
          </AnimatedGroup>
        </group>
      ))}
    </group>
  );
}
