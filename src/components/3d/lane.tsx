"use client";

import { useMemo, type ReactNode } from "react";
import type { CheckpointLayout } from "@/lib/checkpoint-layout";
import { laneCenterZ } from "@/lib/3d/world-coords";
import { RoadSurface } from "./road-surface";

interface Props {
  layout: CheckpointLayout;
  laneNumber: number;
  children?: ReactNode;
}

export function Lane({ layout, laneNumber, children }: Props) {
  const z = useMemo(() => laneCenterZ(layout, laneNumber), [layout, laneNumber]);
  return (
    <group position={[0, 0, z]}>
      <RoadSurface length={layout.roadLength} width={layout.laneWidth} />
      {children}
    </group>
  );
}
