"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TwinImageBase } from "./twin-image-base";
import { TwinZones } from "./twin-zones";
import { EquipmentDots } from "./equipment-dots";
import { TwinHud } from "./twin-hud";

function SceneContent({
  selectedZone,
  onSelectZone,
  selectedDot,
  onSelectDot,
}: {
  selectedZone: string | null;
  onSelectZone: (id: string | null) => void;
  selectedDot: number | null;
  onSelectDot: (sn: number | null) => void;
}) {
  return (
    <>
      {/* Minimal ambient light — image provides its own lighting */}
      <ambientLight intensity={0.5} />

      <TwinImageBase />
      <TwinZones selectedZone={selectedZone} onSelectZone={onSelectZone} />
      <EquipmentDots selectedDot={selectedDot} onSelectDot={onSelectDot} />
    </>
  );
}

export function TwinScene() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedDot, setSelectedDot] = useState<number | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 500,
          position: [60, 50, 60],
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        style={{ background: "#030810" }}
        onPointerMissed={() => {
          setSelectedZone(null);
          setSelectedDot(null);
        }}
      >
        <color attach="background" args={["#030810"]} />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          minDistance={40}
          maxDistance={150}
          target={[0, 0, 0]}
          enablePan={true}
        />

        <Suspense fallback={null}>
          <SceneContent
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            selectedDot={selectedDot}
            onSelectDot={setSelectedDot}
          />
        </Suspense>
      </Canvas>

      {/* DOM HUD overlay */}
      <TwinHud selectedZone={selectedZone} />
    </div>
  );
}
