"use client";

import type { EquipmentStatus } from "@/lib/types";
import { statusHex } from "@/lib/3d/materials";

interface Props {
  status: EquipmentStatus;
  radius?: number;
}

/**
 * A flat colored disc rendered just above the road surface at each equipment's
 * position. Always visible from both 2D top-down and 3D iso views, giving an
 * at-a-glance status indicator regardless of whether the equipment is raised
 * or lowered (which are visually identical from top-down).
 */
export function StatusDisc({ status, radius = 1.0 }: Props) {
  const color = statusHex(status);
  return (
    <>
      {/* Filled disc — mostly transparent, tinted by status color */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.32} />
      </mesh>
      {/* Ring outline — stronger color on the edge */}
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.07, radius, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
    </>
  );
}
