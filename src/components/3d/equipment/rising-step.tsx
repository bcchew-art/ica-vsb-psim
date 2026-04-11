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

const SLAB_LENGTH_X = 1.2;             // depth along traffic direction
const SLAB_WIDTH_Z_FACTOR = 0.85;       // of laneWidth
const SLAB_HEIGHT = 0.3;                // thickness when flat
const MAX_ROTATION = Math.PI / 2 * 0.78; // ~70° up

export function RisingStep({ equipment, laneWidth, onClick }: Props) {
  // Secured = wall raised. Open = wall flat in the road. Transit = in motion.
  const isRaised = equipment.status === "secured" || equipment.status === "transit";
  const targetRotation = isRaised ? MAX_ROTATION : 0;

  const [spring] = useSpring(
    () => ({
      rot: targetRotation,
      config: { mass: 2.0, tension: 48, friction: 18 },
    }),
    [targetRotation],
  );

  const slabWidthZ = laneWidth * SLAB_WIDTH_Z_FACTOR;
  const emissive = statusEmissiveColor(equipment.status);

  return (
    <group onClick={onClick}>
      {/* Recessed housing at ground level */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[SLAB_LENGTH_X + 0.2, 0.06, slabWidthZ + 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/*
        Pivot group at the REAR hinge (+X side).
        Rotation around Z axis raises the FRONT edge (negative X side) upward,
        creating a vertical wall facing -X (toward Malaysia / incoming traffic).
      */}
      <AnimatedGroup
        position={[SLAB_LENGTH_X / 2, 0, 0]}
        rotation-z={spring.rot}
      >
        {/*
          The slab is offset so its far edge sits at the hinge origin,
          and its near edge extends into -X.
        */}
        <mesh position={[-SLAB_LENGTH_X / 2, SLAB_HEIGHT / 2, 0]} castShadow>
          <boxGeometry args={[SLAB_LENGTH_X, SLAB_HEIGHT, slabWidthZ]} />
          <primitive object={paintedSteel()} attach="material" />
        </mesh>
        {/* Front face chevron overlay — only on the -X face of the slab */}
        <mesh
          position={[-SLAB_LENGTH_X + 0.001, SLAB_HEIGHT / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[slabWidthZ, SLAB_HEIGHT]} />
          <primitive object={chevron()} attach="material" />
        </mesh>
        {/* Top face chevron overlay */}
        <mesh
          position={[-SLAB_LENGTH_X / 2, SLAB_HEIGHT + 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[SLAB_LENGTH_X, slabWidthZ]} />
          <primitive object={chevron()} attach="material" />
        </mesh>
      </AnimatedGroup>

      {/* Status emissive marker on the housing (stays visible when slab is flat) */}
      <mesh position={[SLAB_LENGTH_X / 2 + 0.15, 0.05, slabWidthZ / 2 + 0.1]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={equipment.status === "transit" ? 1.5 : 0.8}
        />
      </mesh>
    </group>
  );
}
