"use client";

import { Canvas } from "@react-three/fiber";
import { Lighting } from "./lighting";
import { GroundPlane } from "./ground-plane";
import { CheckpointScene } from "./checkpoint-scene";
import { ResponsiveCamera } from "./responsive-camera";

export default function Scene3D() {
  return (
    <div className="h-full w-full bg-[#eef1f6]">
      <Canvas
        orthographic
        camera={{ position: [32, 22, 32], zoom: 28, near: 0.1, far: 500 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#eef1f6"]} />
        <ResponsiveCamera />
        <Lighting />
        <GroundPlane />
        <CheckpointScene />
      </Canvas>
    </div>
  );
}
