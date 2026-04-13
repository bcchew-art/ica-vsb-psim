"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera, Vector3 } from "three";
import { usePsimStore } from "@/stores/psim-store";

// Scene bounds used to compute zoom — match checkpoint-layout worldLength and
// lane stack width (5 lanes * 5.5m spacing + margin).
const SCENE_WORLD_WIDTH = 56;   // X direction (road length + margin)
const SCENE_WORLD_DEPTH = 34;   // Z direction (lane stack + margin)
const SCENE_ISO_SPAN = 52;      // approx diagonal in iso projection
const SCENE_FLAT_SPAN_X = 56;   // top-down X span
const SCENE_FLAT_SPAN_Z = 34;   // top-down Z span

const ISO_POSITION = new Vector3(32, 22, 32);
const FLAT_POSITION = new Vector3(0, 50, 0.0001);

export function ResponsiveCamera() {
  const { camera, size } = useThree();
  const mode = usePsimStore((s) => s.mapViewMode);
  const mapZoom = usePsimStore((s) => s.mapZoom);

  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;

    // Position + orientation per mode
    if (mode === "3d") {
      camera.position.copy(ISO_POSITION);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.copy(FLAT_POSITION);
      // Top-down: screen "up" should map to world -Z so lane 1 is at the top
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
    }

    // Fit-to-canvas zoom calculation, then apply user zoom multiplier
    const padding = 0.92; // leave a little margin
    const spanX = mode === "3d" ? SCENE_ISO_SPAN : SCENE_FLAT_SPAN_X;
    const spanZ = mode === "3d" ? SCENE_ISO_SPAN : SCENE_FLAT_SPAN_Z;
    const zoomX = (size.width * padding) / spanX;
    const zoomY = (size.height * padding) / spanZ;
    const fitZoom = Math.min(zoomX, zoomY);
    camera.zoom = fitZoom * mapZoom;

    camera.near = 0.1;
    camera.far = 500;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, mode, mapZoom]);

  return null;
}
