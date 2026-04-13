"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Fog } from "three";

export function Lighting() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new Fog("#eef1f6", 80, 180);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <ambientLight intensity={1.3} color="#ffffff" />
      <directionalLight
        position={[18, 25, 14]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-12, 18, 8]} intensity={0.4} color="#38bdf8" />
      <directionalLight position={[-6, 10, -14]} intensity={0.5} color="#38bdf8" />
    </>
  );
}
