"use client";

import { Canvas } from "@react-three/fiber";
import { Lighting } from "./lighting";

export default function Scene3D() {
  return (
    <div className="h-full w-full bg-[#050a14]">
      <Canvas
        orthographic
        camera={{ position: [30, 30, 30], zoom: 40, near: 0.1, far: 200 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050a14"]} />
        <Lighting />
        {/* Placeholder: visible ground quad so we can see lighting */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#0f1826" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.35} />
        </mesh>
      </Canvas>
    </div>
  );
}
