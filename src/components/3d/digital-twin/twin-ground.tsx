"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { Grid } from "@react-three/drei";

export function TwinGround() {
  // Build an ellipse shape using a CylinderGeometry approximation
  // radiusX ~100, radiusZ ~70 — approximated with scaled cylinder
  const groundArgs = useMemo<[number, number, number, number]>(
    () => [1, 1, 0.1, 64],
    [],
  );

  return (
    <group>
      {/* Ambient grid beneath everything */}
      <Grid
        position={[0, -0.05, 0]}
        args={[300, 300]}
        cellSize={5}
        cellColor="#1a2a40"
        sectionSize={25}
        sectionColor="#1e3050"
        fadeDistance={200}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Main compound elliptical floor — scaled cylinder */}
      <mesh
        position={[0, 0.01, 0]}
        scale={[100, 1, 70]}
        rotation={[0, 0, 0]}
        receiveShadow
      >
        <cylinderGeometry args={groundArgs} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.1}
          roughness={0.9}
          side={DoubleSide}
        />
      </mesh>

      {/* Compound perimeter glow ring */}
      <mesh
        position={[0, 0.02, 0]}
        scale={[102, 1, 72]}
        rotation={[0, 0, 0]}
      >
        <cylinderGeometry args={[1, 1, 0.05, 64, 1, true]} />
        <meshBasicMaterial
          color="#2F5FD0"
          transparent
          opacity={0.35}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}
