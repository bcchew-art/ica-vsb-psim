"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TwinGround } from "./twin-ground";
import { TwinBuildings } from "./twin-buildings";
import { TwinRoads } from "./twin-roads";
import { TwinZones } from "./twin-zones";
import { EquipmentDots } from "./equipment-dots";
import { TwinHud } from "./twin-hud";

function TwinLighting() {
  return (
    <>
      <ambientLight color="#1a2a40" intensity={0.4} />
      <directionalLight
        color="#4a6a9a"
        intensity={0.6}
        position={[50, 80, 30]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      <hemisphereLight args={["#1a2a40", "#050a15", 0.2]} />

      {/* Primary scene point lights */}
      <pointLight color="#2F5FD0" intensity={1.5} position={[0, 15, 0]} distance={60} decay={2} />
      <pointLight color="#06B6D4" intensity={1.0} position={[65, 10, 0]} distance={40} decay={2} />

      {/* Per-building local fill lights */}
      <pointLight color="#1a3050" intensity={0.4} position={[0, 8, 0]} distance={25} decay={2} />
      <pointLight color="#1a3050" intensity={0.3} position={[-35, 6, -8]} distance={18} decay={2} />
      <pointLight color="#1a3050" intensity={0.3} position={[35, 6, -8]} distance={18} decay={2} />
      <pointLight color="#1a3050" intensity={0.25} position={[0, 4, -30]} distance={15} decay={2} />
      <pointLight color="#1a3050" intensity={0.25} position={[0, 4, 30]} distance={15} decay={2} />
      <pointLight color="#1a2535" intensity={0.2} position={[-70, 3, 0]} distance={12} decay={2} />
      <pointLight color="#1a2535" intensity={0.2} position={[70, 3, 0]} distance={12} decay={2} />
    </>
  );
}

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
      {/* Exponential fog for depth — tighter for more atmosphere */}
      <fog attach="fog" args={["#050a15", 80, 200]} />

      <TwinLighting />
      <TwinGround />
      <TwinRoads />
      <TwinBuildings />
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
          position: [80, 60, 80],
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        style={{ background: "#050a15" }}
        onPointerMissed={() => {
          setSelectedZone(null);
          setSelectedDot(null);
        }}
      >
        <color attach="background" args={["#050a15"]} />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 9}
          maxPolarAngle={(Math.PI * 75) / 180}
          minDistance={30}
          maxDistance={250}
          target={[0, 0, 0]}
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
