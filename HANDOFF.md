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

## Pending / Next Steps
- Wire zone click → real-time equipment status from psim-store (currently display-only)
- Add animated vehicle paths along the road network
- Consider adding `@react-three/postprocessing` bloom back once static export constraint is confirmed not an issue
- Woodlands checkpoint toggle (currently Tuas-only)

## Session Log
- 2026-04-13: Built full 3D Digital Twin (7 files), `/map` page replaced, tsc + build both pass clean
- 2026-04-13: Visual upgrade — window grids, rooftop AC/parapet, glass lobby, trees, streetlights, boom gates, perimeter fence, road curbs + lane markings, grass + parking areas, fog, per-building point lights, equipment pin markers (orb + stem + ground ring), zone scan-line animation; tsc + build both pass clean
