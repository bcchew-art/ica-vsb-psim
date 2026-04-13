"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";
import { Grid } from "@react-three/drei";

export function TwinGround() {
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
      <mesh position={[0, 0.02, 0]} scale={[102, 1, 72]}>
        <cylinderGeometry args={[1, 1, 0.05, 64, 1, true]} />
        <meshBasicMaterial
          color="#2F5FD0"
          transparent
          opacity={0.35}
          side={DoubleSide}
        />
      </mesh>

      {/* ── Grass patches between roads and buildings ─────────────── */}
      {/* North-west grass */}
      <mesh position={[-50, 0.03, -48]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#0a1a10" roughness={1.0} side={DoubleSide} />
      </mesh>
      {/* North-east grass */}
      <mesh position={[40, 0.03, -48]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#0a1a10" roughness={1.0} side={DoubleSide} />
      </mesh>
      {/* South-west grass */}
      <mesh position={[-50, 0.03, 48]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#0a1a10" roughness={1.0} side={DoubleSide} />
      </mesh>
      {/* South-east grass */}
      <mesh position={[40, 0.03, 48]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color="#0a1a10" roughness={1.0} side={DoubleSide} />
      </mesh>
      {/* Central median strip */}
      <mesh position={[0, 0.03, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial color="#0a1a10" roughness={1.0} side={DoubleSide} />
      </mesh>

      {/* ── Parking areas near buildings ───────────────────────────── */}
      {/* West parking — near Arrival Hall */}
      <mesh position={[-35, 0.04, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color="#111a25" roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Parking bay lines west */}
      {[-5, -1.5, 2, 5.5].map((offset, i) => (
        <mesh key={`pw-${i}`} position={[-35 + offset, 0.05, 10]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[10, 0.12]} />
          <meshBasicMaterial color="#1e3a5a" transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      ))}

      {/* East parking — near Departure Hall */}
      <mesh position={[35, 0.04, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color="#111a25" roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Parking bay lines east */}
      {[-5, -1.5, 2, 5.5].map((offset, i) => (
        <mesh key={`pe-${i}`} position={[35 + offset, 0.05, 10]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[10, 0.12]} />
          <meshBasicMaterial color="#1e3a5a" transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      ))}

      {/* South parking — near South Inspection */}
      <mesh position={[15, 0.04, 38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#111a25" roughness={0.95} side={DoubleSide} />
      </mesh>
      {[-7, -3.5, 0, 3.5, 7].map((offset, i) => (
        <mesh key={`ps-${i}`} position={[15 + offset, 0.05, 38]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[10, 0.12]} />
          <meshBasicMaterial color="#1e3a5a" transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
