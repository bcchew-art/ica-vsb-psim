"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Text } from "@react-three/drei";
import { DoubleSide, Mesh } from "three";

interface BuildingConfig {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  labelOffset?: number;
  isMainTerminal?: boolean;
}

const BUILDINGS: BuildingConfig[] = [
  { name: "MAIN TERMINAL", position: [0, 0, 0], size: [50, 10, 25], labelOffset: 12, isMainTerminal: true },
  { name: "ARRIVAL HALL", position: [-35, 0, -8], size: [20, 7, 15], labelOffset: 9 },
  { name: "DEPARTURE HALL", position: [35, 0, -8], size: [20, 7, 15], labelOffset: 9 },
  { name: "NORTH INSPECTION", position: [0, 0, -30], size: [30, 4, 10], labelOffset: 6 },
  { name: "SOUTH INSPECTION", position: [0, 0, 30], size: [25, 4, 10], labelOffset: 6 },
  { name: "GUARD WEST", position: [-70, 0, 0], size: [8, 3, 6], labelOffset: 5 },
  { name: "GUARD EAST", position: [70, 0, 0], size: [8, 3, 6], labelOffset: 5 },
];

// Window grid on a single facade face
function WindowGrid({
  faceW,
  faceH,
  depth,
  offsetX,
  offsetZ,
}: {
  faceW: number;
  faceH: number;
  depth: number;
  offsetX: number;
  offsetZ: number;
}) {
  const windows = useMemo(() => {
    const result: { x: number; y: number }[] = [];
    const cols = Math.max(2, Math.floor(faceW / 4));
    const rows = Math.max(2, Math.floor(faceH / 3));
    const marginX = faceW * 0.1;
    const marginY = faceH * 0.12;
    const spacingX = (faceW - marginX * 2) / (cols - 1 || 1);
    const spacingY = (faceH - marginY * 2) / (rows - 1 || 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push({
          x: -faceW / 2 + marginX + c * spacingX,
          y: -faceH / 2 + marginY + r * spacingY,
        });
      }
    }
    return result;
  }, [faceW, faceH]);

  return (
    <group position={[offsetX, 0, offsetZ]}>
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, 0]}>
          <boxGeometry args={[0.8, 0.55, 0.05]} />
          <meshStandardMaterial
            color="#1a3a5a"
            emissive="#1a3a5a"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// AC unit cluster on rooftop
function RooftopDetails({ w, h, d }: { w: number; h: number; d: number }) {
  const units = useMemo(() => {
    const count = Math.min(4, Math.max(2, Math.floor(w / 15)));
    const result: { x: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        x: -w * 0.3 + (i * w * 0.6) / (count - 1 || 1),
        z: (Math.random() - 0.5) * d * 0.4,
      });
    }
    return result;
  }, [w, d]);

  return (
    <group position={[0, h / 2, 0]}>
      {/* Parapet rim — thin box around rooftop edge */}
      {/* Front / back edges */}
      <mesh position={[0, 0.3, d / 2]}>
        <boxGeometry args={[w + 0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, -d / 2]}>
        <boxGeometry args={[w + 0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>
      {/* Left / right edges */}
      <mesh position={[w / 2, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.6, d]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>
      <mesh position={[-w / 2, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.6, d]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>

      {/* AC units */}
      {units.map((u, i) => (
        <mesh key={i} position={[u.x, 0.75, u.z]}>
          <boxGeometry args={[2, 1.2, 1.5]} />
          <meshStandardMaterial color="#1a2535" roughness={0.85} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Building({ config }: { config: BuildingConfig }) {
  const { name, position, size, labelOffset = 8, isMainTerminal = false } = config;
  const [w, h, d] = size;

  return (
    <group position={[position[0], position[1] + h / 2, position[2]]}>
      {/* Main building body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#0d1824"
          metalness={0.35}
          roughness={0.65}
          emissive="#0a1525"
          emissiveIntensity={0.25}
        />
        <Edges color="#2F5FD0" lineWidth={1} />
      </mesh>

      {/* Window grids on long faces (front & back — along Z axis) */}
      {/* Front face (positive Z) */}
      <WindowGrid
        faceW={w}
        faceH={h * 0.75}
        depth={d}
        offsetX={0}
        offsetZ={d / 2 + 0.04}
      />
      {/* Back face (negative Z) */}
      <WindowGrid
        faceW={w}
        faceH={h * 0.75}
        depth={d}
        offsetX={0}
        offsetZ={-(d / 2 + 0.04)}
      />

      {/* Glass lobby for main terminal — bottom-front strip */}
      {isMainTerminal && (
        <mesh position={[0, -h / 2 + h * 0.15, d / 2 + 0.06]}>
          <planeGeometry args={[w * 0.85, h * 0.3]} />
          <meshPhysicalMaterial
            color="#1a4a6a"
            transmission={0.55}
            roughness={0.08}
            metalness={0.1}
            transparent
            opacity={0.7}
            side={DoubleSide}
          />
        </mesh>
      )}

      {/* Rooftop glow plane */}
      <mesh position={[0, h / 2 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.8, d * 0.8]} />
        <meshBasicMaterial
          color="#2F5FD0"
          transparent
          opacity={0.07}
          side={DoubleSide}
        />
      </mesh>

      {/* Rooftop AC + parapet */}
      <RooftopDetails w={w} h={h} d={d} />

      {/* Floating label */}
      <Text
        position={[0, labelOffset / 2 + 1.5, 0]}
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

// ── Tree component ──────────────────────────────────────────────────────────
function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 2, 6]} />
        <meshStandardMaterial color="#1a2a1a" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 3, 7]} />
        <meshStandardMaterial
          color="#0a2a1a"
          emissive="#0a1a0a"
          emissiveIntensity={0.2}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

// ── Streetlight component ───────────────────────────────────────────────────
function Streetlight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 5, 6]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color="#4a6a8a"
          emissive="#4a6a8a"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// ── Entry barrier / boom gate ───────────────────────────────────────────────
function EntryBarrier({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Guard booth */}
      <mesh position={[0, 1.5, 3]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial color="#0f1824" roughness={0.7} metalness={0.2} />
        <Edges color="#2F5FD0" lineWidth={0.8} />
      </mesh>
      {/* Boom gate bar */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[6, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#cc3333"
          emissive="#aa2222"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>
      {/* Gate post */}
      <mesh position={[-2.8, 1.1, 0]}>
        <boxGeometry args={[0.25, 2.2, 0.25]} />
        <meshStandardMaterial color="#1a2535" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── Fence post segment ──────────────────────────────────────────────────────
function FenceSegment({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.75, z]}>
      <cylinderGeometry args={[0.06, 0.06, 1.5, 5]} />
      <meshStandardMaterial color="#1a2535" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

// ── Scatter helpers ─────────────────────────────────────────────────────────
const TREE_POSITIONS: [number, number][] = [
  // Along perimeter — compound is roughly ellipse 100 x 70
  [-85, -35], [-70, -50], [-50, -55], [-30, -55], [-10, -55],
  [10, -55], [30, -55], [50, -55], [70, -50],
  [-85, 35], [-70, 50], [-50, 55], [-30, 55], [10, 55],
  [30, 55], [50, 55], [70, 50], [85, 30],
  // Near buildings (gaps)
  [-20, -18], [20, -18], [-20, 18], [20, 18],
];

const STREETLIGHT_POSITIONS: [number, number][] = [
  [-80, -6], [-60, -6], [-40, -6], [-20, -6], [0, -6],
  [20, -6], [40, -6], [60, -6], [80, -6], [-80, 6],
];

// Perimeter fence posts — approximate ellipse edge at a=100, b=70
function buildFencePosts(): [number, number][] {
  const posts: [number, number][] = [];
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const rx = 97;
    const rz = 67;
    posts.push([rx * Math.cos(angle), rz * Math.sin(angle)]);
  }
  return posts;
}
const FENCE_POSTS = buildFencePosts();

export function TwinBuildings() {
  return (
    <group>
      {/* Buildings */}
      {BUILDINGS.map((b) => (
        <Building key={b.name} config={b} />
      ))}

      {/* Trees */}
      {TREE_POSITIONS.map(([x, z], i) => (
        <Tree key={`tree-${i}`} x={x} z={z} />
      ))}

      {/* Streetlights along main arterial */}
      {STREETLIGHT_POSITIONS.map(([x, z], i) => (
        <Streetlight key={`light-${i}`} x={x} z={z} />
      ))}

      {/* Entry barriers west and east */}
      <EntryBarrier x={-85} z={0} />
      <EntryBarrier x={85} z={0} />

      {/* Perimeter fence */}
      {FENCE_POSTS.map(([x, z], i) => (
        <FenceSegment key={`fence-${i}`} x={x} z={z} />
      ))}
    </group>
  );
}
