"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";

// Road surface material props shared across all road meshes
function RoadPlane({
  position,
  rotation,
  args,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  args: [number, number];
}) {
  const planeArgs = useMemo<[number, number]>(() => args, [args]);
  return (
    <group>
      {/* Road base */}
      <mesh position={position} rotation={rotation} receiveShadow>
        <planeGeometry args={planeArgs} />
        <meshStandardMaterial
          color="#141e2e"
          metalness={0.05}
          roughness={0.95}
          side={DoubleSide}
        />
      </mesh>
      {/* Centre-line lane marking — thin emissive strip */}
      <mesh
        position={[position[0], position[1] + 0.01, position[2]]}
        rotation={rotation}
      >
        <planeGeometry args={[planeArgs[0], 0.25]} />
        <meshBasicMaterial
          color="#2F5FD0"
          transparent
          opacity={0.55}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function TwinRoads() {
  return (
    <group>
      {/* ── Main east–west arterial ────────────────────────────────── */}
      <RoadPlane
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[220, 12]}
      />

      {/* ── North perimeter road (west segment) ───────────────────── */}
      <RoadPlane
        position={[-55, 0.05, -42]}
        rotation={[-Math.PI / 2, 0, Math.PI / 8]}
        args={[60, 8]}
      />
      {/* ── North perimeter road (east segment) ───────────────────── */}
      <RoadPlane
        position={[45, 0.05, -42]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 8]}
        args={[60, 8]}
      />

      {/* ── South perimeter road (west segment) ───────────────────── */}
      <RoadPlane
        position={[-55, 0.05, 42]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 8]}
        args={[60, 8]}
      />
      {/* ── South perimeter road (east segment) ───────────────────── */}
      <RoadPlane
        position={[45, 0.05, 42]}
        rotation={[-Math.PI / 2, 0, Math.PI / 8]}
        args={[60, 8]}
      />

      {/* ── Bridge approach — elevated section ─────────────────────── */}
      {/* High segment: elevated ~5 units */}
      <mesh position={[-105, 5, 35]} rotation={[-Math.PI / 2, 0, -Math.PI / 6]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#141e2e" metalness={0.05} roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Ramp segment: descends from ~5 to ground */}
      <mesh position={[-92, 2.5, 20]} rotation={[-Math.PI / 2 + 0.15, 0, -Math.PI / 5]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial color="#141e2e" metalness={0.05} roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Ground connection segment */}
      <RoadPlane
        position={[-82, 0.05, 8]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 10]}
        args={[22, 10]}
      />

      {/* Bridge guard rails — thin emissive bars */}
      <mesh position={[-98, 6.5, 38]}>
        <boxGeometry args={[28, 0.3, 0.3]} />
        <meshBasicMaterial color="#2F5FD0" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-98, 6.5, 32]}>
        <boxGeometry args={[28, 0.3, 0.3]} />
        <meshBasicMaterial color="#2F5FD0" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
