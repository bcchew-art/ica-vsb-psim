"use client";

import { Grid } from "@react-three/drei";

export function GroundPlane() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#050a14" metalness={0} roughness={1} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[80, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a3352"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#38bdf8"
        fadeDistance={40}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid={false}
      />
    </>
  );
}
