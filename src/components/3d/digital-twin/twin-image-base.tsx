"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function TwinImageBase() {
  // basePath is /ica-vsb-psim for GitHub Pages static export
  const texture = useTexture("/ica-vsb-psim/twin-base.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  // Image is 1536x1024 — exactly 3:2 aspect ratio
  // Plane width=160, height=160/1.5≈107 to preserve aspect
  const width = 160;
  const height = 107;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={false} />
    </mesh>
  );
}
