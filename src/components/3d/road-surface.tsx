"use client";

import { roadSurface } from "@/lib/3d/materials";

interface Props {
  length: number; // meters (X direction)
  width: number;  // meters (Z direction)
}

const EDGE_LINE_WIDTH = 0.14;
const EDGE_LINE_HEIGHT = 0.015;
const DASH_LENGTH = 1.6;
const DASH_GAP = 1.2;
const DASH_WIDTH = 0.12;

export function RoadSurface({ length, width }: Props) {
  // Compute dashed centerline segments along the X axis
  const dashes: number[] = [];
  const dashStride = DASH_LENGTH + DASH_GAP;
  const totalDashLen = length - 4; // leave a margin at both ends
  const dashStart = -totalDashLen / 2;
  for (let x = dashStart; x <= -dashStart; x += dashStride) {
    dashes.push(x + DASH_LENGTH / 2);
  }

  const halfW = width / 2;

  return (
    <group>
      {/* Main asphalt surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[length, 0.05, width]} />
        <primitive object={roadSurface()} attach="material" />
      </mesh>

      {/* Left edge line (toward -Z) */}
      <mesh position={[0, 0.03, -halfW + EDGE_LINE_WIDTH / 2]}>
        <boxGeometry args={[length, EDGE_LINE_HEIGHT, EDGE_LINE_WIDTH]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.4} />
      </mesh>

      {/* Right edge line (toward +Z) */}
      <mesh position={[0, 0.03, halfW - EDGE_LINE_WIDTH / 2]}>
        <boxGeometry args={[length, EDGE_LINE_HEIGHT, EDGE_LINE_WIDTH]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.4} />
      </mesh>

      {/* Dashed centerline running along the X axis — light gray, subtle */}
      {dashes.map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0]}>
          <boxGeometry args={[DASH_LENGTH, EDGE_LINE_HEIGHT, DASH_WIDTH]} />
          <meshStandardMaterial color="#b8bcc4" metalness={0.1} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
