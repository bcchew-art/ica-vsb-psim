"use client";

import { roadSurface } from "@/lib/3d/materials";

interface Props {
  length: number; // meters (X direction)
  width: number;  // meters (Z direction)
}

export function RoadSurface({ length, width }: Props) {
  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[length, 0.05, width]} />
      <primitive object={roadSurface()} attach="material" />
    </mesh>
  );
}
