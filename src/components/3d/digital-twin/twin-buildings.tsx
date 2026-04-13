"use client";

import { useMemo, useRef } from "react";
import { Edges, Text } from "@react-three/drei";
import { DoubleSide } from "three";

interface BuildingConfig {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  labelOffset?: number;
}

const BUILDINGS: BuildingConfig[] = [
  { name: "MAIN TERMINAL", position: [0, 0, 0], size: [50, 8, 25], labelOffset: 10 },
  { name: "ARRIVAL HALL", position: [-35, 0, -8], size: [20, 6, 15], labelOffset: 8 },
  { name: "DEPARTURE HALL", position: [35, 0, -8], size: [20, 6, 15], labelOffset: 8 },
  { name: "NORTH INSPECTION", position: [0, 0, -30], size: [30, 5, 10], labelOffset: 7 },
  { name: "SOUTH INSPECTION", position: [0, 0, 30], size: [25, 5, 10], labelOffset: 7 },
  { name: "GUARD WEST", position: [-70, 0, 0], size: [8, 4, 6], labelOffset: 6 },
  { name: "GUARD EAST", position: [70, 0, 0], size: [8, 4, 6], labelOffset: 6 },
];

function Building({ config }: { config: BuildingConfig }) {
  const { name, position, size, labelOffset = 8 } = config;
  const [w, h, d] = size;
  const boxArgs = useMemo<[number, number, number]>(() => [w, h, d], [w, h, d]);

  return (
    <group position={[position[0], position[1] + h / 2, position[2]]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={boxArgs} />
        <meshStandardMaterial
          color="#0f1a2e"
          metalness={0.3}
          roughness={0.7}
          emissive="#0a1525"
          emissiveIntensity={0.3}
        />
        <Edges color="#2F5FD0" lineWidth={1} />
      </mesh>

      {/* Rooftop glow plane */}
      <mesh position={[0, h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.8, d * 0.8]} />
        <meshBasicMaterial
          color="#2F5FD0"
          transparent
          opacity={0.08}
          side={DoubleSide}
        />
      </mesh>

      {/* Floating label */}
      <Text
        position={[0, labelOffset / 2 + 1, 0]}
        fontSize={1.5}
        color="#8899b0"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.7}
      >
        {name}
      </Text>
    </group>
  );
}

export function TwinBuildings() {
  return (
    <group>
      {BUILDINGS.map((b) => (
        <Building key={b.name} config={b} />
      ))}
    </group>
  );
}
