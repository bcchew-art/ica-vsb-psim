"use client";

import { Canvas } from "@react-three/fiber";

export default function Scene3D() {
  return (
    <div className="h-full w-full bg-[#050a14]">
      <Canvas
        orthographic
        camera={{ position: [20, 20, 20], zoom: 40, near: 0.1, far: 200 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050a14"]} />
        <ambientLight intensity={0.5} />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </Canvas>
    </div>
  );
}
