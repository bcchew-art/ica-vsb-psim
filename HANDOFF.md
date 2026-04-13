# HANDOFF — vsb-psim (ICA VSB PSIM Demo)

## Project State
Next.js 16 App Router, static export (`output: "export"`, basePath `/ica-vsb-psim`), Tailwind v4, R3F v9, Drei v10, Three v0.171.

## What Was Built (this session)
Full 3D Digital Twin of Tuas Checkpoint, replacing the SVG site-overview on `/map`.

### Files Created
- `src/components/3d/digital-twin/twin-ground.tsx` — Elliptical compound floor + infinite grid
- `src/components/3d/digital-twin/twin-buildings.tsx` — 7 extruded buildings with `<Edges>` glow + floating labels
- `src/components/3d/digital-twin/twin-roads.tsx` — Arterial road, perimeter roads, elevated bridge approach with guard rails
- `src/components/3d/digital-twin/twin-zones.tsx` — 6 zone cylinders (A–F), pulsing demo zone C, click-to-inspect, `<Html>` detail popups
- `src/components/3d/digital-twin/equipment-dots.tsx` — All 32 Tuas BOQ locations as glowing spheres, hover tooltip + selected detail panel, coordinate-converted from SVG space
- `src/components/3d/digital-twin/twin-hud.tsx` — DOM overlay: title, live clock, equipment legend, zone summary, hint bar
- `src/components/3d/digital-twin/twin-scene.tsx` — Root Canvas (ACESFilmic tone mapping, OrbitControls, perspective cam at [80,60,80])

### Files Modified
- `src/app/map/page.tsx` — Replaced `<SiteOverview>` with `<TwinScene>`, updated header to "Digital Twin — Tuas Checkpoint", preserved CCTV panel toggle

## Build Status
`npx tsc --noEmit` ✓ clean  
`npm run build` ✓ all 9 static pages generated

## Key Decisions
- Postprocessing bloom skipped — static export + SSR-safe constraint; emissive materials at intensity 2.0 achieve glow effect without it
- `EQUIPMENT_COLORS` imported from `checkpoint-data.ts` (already exported there) rather than duplicated
- Zone F (Bridge L3) covers S/N 21–32, which is the full Level 3 bridge group from the BOQ

## Image-Base Swap (2026-04-13)
Replaced all procedural geometry (buildings, roads, ground, trees, fence) with a pre-rendered site plan image used as a flat ground-plane texture.

### Files Created
- `src/components/3d/digital-twin/twin-image-base.tsx` — flat plane (160×107) with `meshBasicMaterial` + `useTexture("/ica-vsb-psim/twin-base.png")`; rotation `-PI/2` on X to lie flat; `SRGBColorSpace` set on texture
- `public/twin-base.png` — copied from VSB ATT Shared Drive rendered folder (1536×1024, 3:2 aspect)

### Files Modified
- `twin-scene.tsx` — removed TwinBuildings/TwinRoads/TwinGround imports; added TwinImageBase; removed fog; simplified lighting to single `ambientLight intensity=0.5`; camera default [60,50,60]; OrbitControls: minPolar PI/6, maxPolar PI/3, minDist 40, maxDist 150; background `#030810`
- `twin-zones.tsx` — repositioned all 6 zones to fit 160×107 plane (A→[-30,11,-15], B→[-10,11,20], C→[30,11,5], D→[15,11,-20], E→[0,11,0], F→[-40,11,15]); radii reduced to 10-12
- `equipment-dots.tsx` — svgToWorld scale factors updated: X=(x-500)×0.16, Z=(y-400)×0.12 (was 0.22)

### Files Deleted
- `twin-buildings.tsx`, `twin-roads.tsx`, `twin-ground.tsx` (geometry replaced by image)

## Pending / Next Steps
- Wire zone click → real-time equipment status from psim-store (currently display-only)
- Add animated vehicle paths along the road network
- Consider adding `@react-three/postprocessing` bloom back once static export constraint is confirmed not an issue
- Woodlands checkpoint toggle (currently Tuas-only)
- Fine-tune zone/dot positions once visually verified against actual rendered image

## Session Log
- 2026-04-13: Built full 3D Digital Twin (7 files), `/map` page replaced, tsc + build both pass clean
- 2026-04-13: Visual upgrade — window grids, rooftop AC/parapet, glass lobby, trees, streetlights, boom gates, perimeter fence, road curbs + lane markings, grass + parking areas, fog, per-building point lights, equipment pin markers (orb + stem + ground ring), zone scan-line animation; tsc + build both pass clean
- 2026-04-13: Hyper-realistic upgrade — MeshPhysicalMaterial glass buildings (transmission 0.4) + internal floor plates, bright cyan lane markings (emissiveIntensity 3.0), circuit-board Grid (cellSize 4 / sectionSize 20) + radial glow, zones height→22 + top rings + emissiveIntensity 4.0, Zone D→purple #6633cc / Zone F→magenta #9945ff, equipment orb emissive 5.0; tsc + build both pass clean
- 2026-04-13: Image-base swap — all procedural geometry replaced by rendered site plan PNG as flat texture plane; zone/dot positions remapped; tsc + build both pass clean
