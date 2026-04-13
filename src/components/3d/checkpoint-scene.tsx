"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { usePsimStore } from "@/stores/psim-store";
import { getLayout } from "@/lib/checkpoint-layout";
import { laneCenterZ } from "@/lib/3d/world-coords";
import { Lane } from "./lane";
import { Gantry } from "./gantry";
import { EquipmentRenderer } from "./equipment/equipment-renderer";
import type { Equipment } from "@/lib/types";

function GroundRing({
  position,
  color,
  opacity,
  pulse,
  inner = 1.3,
  outer = 1.6,
}: {
  position: [number, number, number];
  color: string;
  opacity: number;
  pulse: boolean;
  inner?: number;
  outer?: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current || !pulse) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 3) * 0.1;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh
      ref={ref}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[inner, outer, 48]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function equipmentWorldPosition(
  eq: Equipment,
  layout: ReturnType<typeof getLayout>,
): [number, number, number] | null {
  const slot = layout.equipmentSlots.find((s) => s.positionIndex === eq.position);
  if (!slot) return null;
  return [slot.worldX, 0.04, laneCenterZ(layout, eq.lane)];
}

export function CheckpointScene() {
  const checkpoint = usePsimStore((s) => s.checkpoint);
  const equipment = usePsimStore((s) => s.equipment);
  const selectEquipment = usePsimStore((s) => s.selectEquipment);
  const selectedId = usePsimStore((s) => s.selectedEquipmentId);
  const viewMode = usePsimStore((s) => s.mapViewMode);
  const layout = useMemo(() => getLayout(checkpoint), [checkpoint]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHoverIn = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredId(id);
    document.body.style.cursor = "pointer";
  };

  const handleHoverOut = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredId((prev) => (prev === id ? null : prev));
    document.body.style.cursor = "default";
  };

  // Group equipment by lane for rendering
  const equipmentByLane = useMemo(() => {
    const map = new Map<number, typeof equipment>();
    for (const eq of equipment) {
      if (!map.has(eq.lane)) map.set(eq.lane, []);
      map.get(eq.lane)!.push(eq);
    }
    return map;
  }, [equipment]);

  // Look up worldX for an equipment by position slot
  const slotsByPosition = useMemo(() => {
    const m = new Map<number, number>();
    for (const s of layout.equipmentSlots) m.set(s.positionIndex, s.worldX);
    return m;
  }, [layout]);

  const selectedEq = useMemo(
    () => (selectedId ? equipment.find((e) => e.id === selectedId) : undefined),
    [equipment, selectedId],
  );
  const hoveredEq = useMemo(
    () => (hoveredId ? equipment.find((e) => e.id === hoveredId) : undefined),
    [equipment, hoveredId],
  );

  const selectedPos = selectedEq ? equipmentWorldPosition(selectedEq, layout) : null;
  const hoveredPos = hoveredEq ? equipmentWorldPosition(hoveredEq, layout) : null;

  return (
    <>
      {Array.from({ length: layout.laneCount }, (_, i) => i + 1).map((laneNum) => (
        <Lane key={laneNum} layout={layout} laneNumber={laneNum}>
          {(equipmentByLane.get(laneNum) ?? [])
            .filter((eq) =>
              eq.type === "auto-bollard" ||
              eq.type === "drop-arm-barrier" ||
              eq.type === "rising-step",
            )
            .map((eq) => {
              const worldX = slotsByPosition.get(eq.position);
              if (worldX === undefined) return null;
              return (
                <group
                  key={eq.id}
                  position={[worldX, 0.03, 0]}
                  onPointerOver={handleHoverIn(eq.id)}
                  onPointerOut={handleHoverOut(eq.id)}
                >
                  <EquipmentRenderer
                    equipment={eq}
                    laneWidth={layout.laneWidth}
                    onClick={() => selectEquipment(eq.id)}
                  />
                </group>
              );
            })}
        </Lane>
      ))}
      {/* Gantries are 3D architectural detail — hidden in 2D top-down mode
          because their overhead structure occludes the equipment below. */}
      {viewMode === "3d" &&
        layout.gantries.map((g, i) => (
          <Gantry key={i} layout={layout} config={g} />
        ))}

      {/* Hover ring — white, no pulse, slightly smaller */}
      {hoveredPos && hoveredId !== selectedId && (
        <GroundRing
          position={hoveredPos}
          color="#ffffff"
          opacity={0.55}
          pulse={false}
          inner={1.1}
          outer={1.25}
        />
      )}

      {/* Selection ring — cyan, pulsing */}
      {selectedPos && (
        <GroundRing
          position={selectedPos}
          color="#38bdf8"
          opacity={0.9}
          pulse
          inner={1.3}
          outer={1.6}
        />
      )}
    </>
  );
}
