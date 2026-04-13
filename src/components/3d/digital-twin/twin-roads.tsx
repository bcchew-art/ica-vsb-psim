"use client";

import { useMemo } from "react";
import { DoubleSide } from "three";

// ── Single dash for centre-line markings ────────────────────────────────────
function CentreDashes({
  length,
  width,
  posX,
  posZ,
  rotY,
}: {
  length: number;
  width: number;
  posX: number;
  posZ: number;
  rotY: number;
}) {
  const dashLen = 2;
  const gap = 1.5;
  const repeat = dashLen + gap;
  const count = Math.floor(length / repeat);
  const dashes = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(-length / 2 + dashLen / 2 + i * repeat);
    }
    return result;
  }, [count, length, repeat]);

  // local unit vectors based on rotY
  const cosR = Math.cos(rotY);
  const sinR = Math.sin(rotY);

  return (
    <>
      {dashes.map((t, i) => {
        // offset along the road axis
        const wx = posX + t * cosR;
        const wz = posZ + t * sinR;
        return (
          <mesh key={i} position={[wx, 0.03, wz]} rotation={[0, -rotY, 0]}>
            <planeGeometry args={[dashLen, 0.15]} />
            <meshStandardMaterial
              color="#00ccff"
              emissive="#00ccff"
              emissiveIntensity={3.0}
              transparent
              opacity={0.9}
              side={DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ── Edge line (solid emissive strip along road edge) ────────────────────────
function EdgeLine({
  length,
  posX,
  posY,
  posZ,
  rotY,
  sideOffset,
}: {
  length: number;
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
  sideOffset: number;
}) {
  const perpX = -Math.sin(rotY) * sideOffset;
  const perpZ = Math.cos(rotY) * sideOffset;
  return (
    <mesh
      position={[posX + perpX, posY + 0.015, posZ + perpZ]}
      rotation={[0, -rotY, 0]}
    >
      <planeGeometry args={[length, 0.18]} />
      <meshStandardMaterial
        color="#00ccff"
        emissive="#00ccff"
        emissiveIntensity={3.0}
        transparent
        opacity={0.9}
        side={DoubleSide}
      />
    </mesh>
  );
}

// ── Curb strip ───────────────────────────────────────────────────────────────
function Curb({
  length,
  posX,
  posY,
  posZ,
  rotY,
  sideOffset,
  roadWidth,
}: {
  length: number;
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
  sideOffset: number;
  roadWidth: number;
}) {
  const perpX = -Math.sin(rotY) * (sideOffset * (roadWidth / 2 + 0.15));
  const perpZ = Math.cos(rotY) * (sideOffset * (roadWidth / 2 + 0.15));
  return (
    <mesh position={[posX + perpX, posY + 0.075, posZ + perpZ]} rotation={[0, -rotY, 0]}>
      <boxGeometry args={[length, 0.15, 0.3]} />
      <meshStandardMaterial
        color="#1e2a3a"
        emissive="#0a2040"
        emissiveIntensity={0.3}
        roughness={0.95}
      />
    </mesh>
  );
}

// ── Full road segment ────────────────────────────────────────────────────────
function RoadSegment({
  posX,
  posY,
  posZ,
  rotY,
  length,
  width,
}: {
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
  length: number;
  width: number;
}) {
  return (
    <group>
      {/* Road surface */}
      <mesh
        position={[posX, posY, posZ]}
        rotation={[-Math.PI / 2, 0, -rotY]}
        receiveShadow
      >
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color="#0a1018"
          metalness={0.02}
          roughness={0.95}
          side={DoubleSide}
        />
      </mesh>

      {/* Edge lines */}
      <EdgeLine length={length} posX={posX} posY={posY} posZ={posZ} rotY={rotY} sideOffset={width / 2 - 0.4} />
      <EdgeLine length={length} posX={posX} posY={posY} posZ={posZ} rotY={rotY} sideOffset={-(width / 2 - 0.4)} />

      {/* Centre dashes */}
      <CentreDashes length={length} width={width} posX={posX} posZ={posZ} rotY={rotY} />

      {/* Curbs */}
      <Curb length={length} posX={posX} posY={posY} posZ={posZ} rotY={rotY} sideOffset={1} roadWidth={width} />
      <Curb length={length} posX={posX} posY={posY} posZ={posZ} rotY={rotY} sideOffset={-1} roadWidth={width} />
    </group>
  );
}

export function TwinRoads() {
  return (
    <group>
      {/* ── Main east–west arterial ────────────────────────────────── */}
      <RoadSegment
        posX={0} posY={0.05} posZ={0}
        rotY={0}
        length={220} width={10}
      />

      {/* ── North perimeter road (west segment) ───────────────────── */}
      <RoadSegment
        posX={-55} posY={0.05} posZ={-42}
        rotY={Math.PI / 8}
        length={60} width={8}
      />
      {/* ── North perimeter road (east segment) ───────────────────── */}
      <RoadSegment
        posX={45} posY={0.05} posZ={-42}
        rotY={-Math.PI / 8}
        length={60} width={8}
      />

      {/* ── South perimeter road (west segment) ───────────────────── */}
      <RoadSegment
        posX={-55} posY={0.05} posZ={42}
        rotY={-Math.PI / 8}
        length={60} width={8}
      />
      {/* ── South perimeter road (east segment) ───────────────────── */}
      <RoadSegment
        posX={45} posY={0.05} posZ={42}
        rotY={Math.PI / 8}
        length={60} width={8}
      />

      {/* ── Bridge approach — elevated raw meshes (keep original feel) ── */}
      {/* High segment: elevated ~5 units */}
      <mesh position={[-105, 5, 35]} rotation={[-Math.PI / 2, 0, -Math.PI / 6]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#0a1018" metalness={0.02} roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Ramp segment */}
      <mesh position={[-92, 2.5, 20]} rotation={[-Math.PI / 2 + 0.15, 0, -Math.PI / 5]}>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial color="#0a1018" metalness={0.02} roughness={0.95} side={DoubleSide} />
      </mesh>
      {/* Ground connection */}
      <RoadSegment
        posX={-82} posY={0.05} posZ={8}
        rotY={Math.PI / 10}
        length={22} width={10}
      />

      {/* Bridge guard rails */}
      <mesh position={[-98, 6.5, 38]}>
        <boxGeometry args={[28, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#00ccff"
          emissive="#00ccff"
          emissiveIntensity={3.0}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[-98, 6.5, 32]}>
        <boxGeometry args={[28, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#00ccff"
          emissive="#00ccff"
          emissiveIntensity={3.0}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
