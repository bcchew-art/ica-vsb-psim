"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/3d/scene-3d"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#050a14] flex items-center justify-center text-ica-blue font-mono text-sm">
      LOADING 3D SCENE...
    </div>
  ),
});

export function CheckpointMap() {
  return (
    <div className="h-full relative overflow-hidden">
      <Scene3D />
    </div>
  );
}
