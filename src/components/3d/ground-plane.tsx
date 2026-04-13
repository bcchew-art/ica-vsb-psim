"use client";

export function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[140, 100]} />
      <meshStandardMaterial color="#dde2e9" metalness={0} roughness={1} />
    </mesh>
  );
}
