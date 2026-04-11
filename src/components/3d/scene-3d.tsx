"use client";

import { Canvas } from "@react-three/fiber";
import { Lighting } from "./lighting";
import { GroundPlane } from "./ground-plane";
import { Lane } from "./lane";
import { Gantry } from "./gantry";
import { BollardArray } from "./equipment/bollard-array";
import { DropArmBarrier } from "./equipment/drop-arm-barrier";
import { RisingStep } from "./equipment/rising-step";
import { woodlandsLayout } from "@/lib/checkpoint-layout";
import type { Equipment } from "@/lib/types";

const testBollard: Equipment = {
  id: "test-bol",
  name: "Test Bollard",
  type: "auto-bollard",
  status: "secured",
  checkpoint: "woodlands",
  zone: "mid",
  lane: 3,
  position: 1,
  lastAction: "init",
  lastActionTime: "00:00",
  controlMode: "mcp",
  health: { power: true, battery: true },
  efoActive: false,
};

export default function Scene3D() {
  return (
    <div className="h-full w-full bg-[#050a14]">
      <Canvas
        orthographic
        camera={{ position: [30, 30, 30], zoom: 40, near: 0.1, far: 200 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050a14"]} />
        <Lighting />
        <GroundPlane />
        {Array.from({ length: woodlandsLayout.laneCount }, (_, i) => {
          const laneNum = i + 1;
          return (
            <Lane key={laneNum} layout={woodlandsLayout} laneNumber={laneNum}>
              {laneNum === 3 && (
                <group position={[0, 0.03, 0]}>
                  <BollardArray
                    equipment={testBollard}
                    laneWidth={woodlandsLayout.laneWidth}
                  />
                </group>
              )}
              {laneNum === 2 && (
                <group position={[-8, 0.03, 0]}>
                  <DropArmBarrier
                    equipment={{ ...testBollard, id: "test-dab", type: "drop-arm-barrier", position: 0, lane: 2 }}
                    laneWidth={woodlandsLayout.laneWidth}
                  />
                </group>
              )}
              {laneNum === 4 && (
                <group position={[8, 0.03, 0]}>
                  <RisingStep
                    equipment={{ ...testBollard, id: "test-step", type: "rising-step", position: 2, lane: 4, status: "secured" }}
                    laneWidth={woodlandsLayout.laneWidth}
                  />
                </group>
              )}
            </Lane>
          );
        })}
        {woodlandsLayout.gantries.map((g, i) => (
          <Gantry key={i} layout={woodlandsLayout} config={g} />
        ))}
      </Canvas>
    </div>
  );
}
