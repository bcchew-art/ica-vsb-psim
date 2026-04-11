"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Fog } from "three";

export function Lighting() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new Fog("#050a14", 35, 90);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.25} color="#1a2438" />
      <directionalLight
        position={[18, 25, 14]}
        intensity={0.8}
        color="#f0f8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight position={[-12, 18, 8]} intensity={0.15} color="#38bdf8" />
      <directionalLight position={[-6, 10, -14]} intensity={0.25} color="#38bdf8" />
    </>
  );
}
