import { MeshStandardMaterial, Color } from "three";
import type { EquipmentStatus } from "@/lib/types";
import { getChevronStripeTexture } from "./textures";

// Build lazily so we don't hit `document` during SSR.
let _cache: {
  paintedSteel?: MeshStandardMaterial;
  brushedMetal?: MeshStandardMaterial;
  concrete?: MeshStandardMaterial;
  chevron?: MeshStandardMaterial;
  roadSurface?: MeshStandardMaterial;
} = {};

export function paintedSteel(): MeshStandardMaterial {
  if (_cache.paintedSteel) return _cache.paintedSteel;
  _cache.paintedSteel = new MeshStandardMaterial({
    color: "#e0e0e0",
    metalness: 0.6,
    roughness: 0.35,
  });
  return _cache.paintedSteel;
}

export function brushedMetal(): MeshStandardMaterial {
  if (_cache.brushedMetal) return _cache.brushedMetal;
  _cache.brushedMetal = new MeshStandardMaterial({
    color: "#4a5d7a",
    metalness: 0.85,
    roughness: 0.45,
  });
  return _cache.brushedMetal;
}

export function concrete(): MeshStandardMaterial {
  if (_cache.concrete) return _cache.concrete;
  _cache.concrete = new MeshStandardMaterial({
    color: "#2a2a2a",
    metalness: 0.05,
    roughness: 0.9,
  });
  return _cache.concrete;
}

export function chevron(): MeshStandardMaterial {
  if (_cache.chevron) return _cache.chevron;
  _cache.chevron = new MeshStandardMaterial({
    map: getChevronStripeTexture(),
    metalness: 0.4,
    roughness: 0.6,
  });
  return _cache.chevron;
}

export function roadSurface(): MeshStandardMaterial {
  if (_cache.roadSurface) return _cache.roadSurface;
  _cache.roadSurface = new MeshStandardMaterial({
    color: "#0f1826",
    metalness: 0.1,
    roughness: 0.85,
  });
  return _cache.roadSurface;
}

export function statusEmissiveColor(status: EquipmentStatus): Color {
  switch (status) {
    case "secured": return new Color("#22c55e");
    case "open":    return new Color("#38bdf8");
    case "transit": return new Color("#f59e0b");
    case "fault":   return new Color("#ef4444");
    case "offline": return new Color("#555555");
  }
}
