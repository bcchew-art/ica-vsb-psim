"use client";

import { useSpring, animated } from "@react-spring/three";
import type { Equipment } from "@/lib/types";
import { paintedSteel, chevron, statusEmissiveColor } from "@/lib/3d/materials";

const AnimatedGroup = animated("group");

interface Props {
  equipment: Equipment;
  laneWidth: number;
  onClick?: () => void;
}

const POST_HEIGHT = 1.2;
const ARM_LENGTH_FACTOR = 0.95; // of laneWidth
const ARM_THICKNESS = 0.12;

export function DropArmBarrier({ equipment, laneWidth, onClick }: Props) {
  // Lowered = arm horizontal, blocking (rotation 0).
  // Raised (cleared) = arm vertical (rotation -PI/2 * 0.95 ≈ 85° up).
  const isBlocking = equipment.status === "secured" || equipment.status === "transit";
  const targetRotation = isBlocking ? 0 : -Math.PI / 2 * 0.95;

  const [spring] = useSpring(
    () => ({
      rot: targetRotation,
      config: { mass: 1.4, tension: 55, friction: 16 },
    }),
    [targetRotation],
  );

  const armLength = laneWidth * ARM_LENGTH_FACTOR;
  const emissive = statusEmissiveColor(equipment.status);
  const postZ = -laneWidth / 2 + 0.2; // post at one edge of the lane

  return (
    <group onClick={onClick}>
      {/* Mounting post */}
      <mesh position={[0, POST_HEIGHT / 2, postZ]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, POST_HEIGHT, 16]} />
        <primitive object={paintedSteel()} attach="material" />
      </mesh>
      {/* Base plate */}
      <mesh position={[0, 0.04, postZ]}>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Status indicator on post top */}
      <mesh position={[0, POST_HEIGHT + 0.06, postZ]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={equipment.status === "transit" ? 1.5 : 0.8}
        />
      </mesh>
      {/* Arm pivots around post top. Pivot group rotates around its own origin. */}
      <AnimatedGroup position={[0, POST_HEIGHT - 0.05, postZ]} rotation-x={spring.rot}>
        {/* Arm offset so its origin is at the hinge, extending into +Z */}
        <mesh position={[0, 0, armLength / 2 - 0.05]} castShadow>
          <boxGeometry args={[ARM_THICKNESS, ARM_THICKNESS, armLength]} />
          <primitive object={chevron()} attach="material" />
        </mesh>
      </AnimatedGroup>
    </group>
  );
}
