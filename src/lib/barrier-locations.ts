// NOTE: illustrative positions, not survey-grade.
// Coordinates (x/y as % of overview image) are eyeballed from
// public/tuas-overview2.png and public/woodlands-overview.png
// to give a visual sense of barrier distribution per zone.
// Counts follow the R9 BOQ (21 Jan 2026) — 32 at Tuas, 28 at Woodlands.

export type BarrierType =
  | "Blocker"
  | "Road Hump"
  | "K12 Drop Arm"
  | "Auto Bollard"
  | "Sliding Bollard";

export interface BarrierLocation {
  id: string;
  checkpoint: "tuas" | "woodlands";
  zone: string;
  mapRef: string;
  lane: string;
  type: BarrierType;
  x: number; // % of overview image width
  y: number; // % of overview image height
}

export const BARRIER_COLORS: Record<BarrierType, string> = {
  "Blocker":         "#ef4444",
  "Road Hump":       "#f59e0b",
  "K12 Drop Arm":    "#3b82f6",
  "Auto Bollard":    "#10b981",
  "Sliding Bollard": "#a855f7",
};

// ─── TUAS — 32 locations across 7 zones (4B, 5, 5B, 6A, 7, 8, 9A) ─────────────
// Zone hotspot anchors (from digital-twin-map.tsx) used as clustering centres:
//   4B: 24/30, 5: 29/35, 5B: 42/22, 6A: 46/45, 7: 62/30, 8: 75/42, 9A: 40/60
// Barriers are scattered within a small radius of each anchor, loosely placed
// near the inspection-lane cluster lines visible in the overview image.

export const tuasBarriers: BarrierLocation[] = [
  // Zone 4B (S/N 1, 2, 3) — entry lanes, 5 barriers
  { id: "T-4B-1A", checkpoint: "tuas", zone: "4B", mapRef: "1E",  lane: "A",   type: "Blocker",   x: 21.5, y: 28.0 },
  { id: "T-4B-1B", checkpoint: "tuas", zone: "4B", mapRef: "1E",  lane: "B",   type: "Blocker",   x: 24.0, y: 29.5 },
  { id: "T-4B-2A", checkpoint: "tuas", zone: "4B", mapRef: "2",   lane: "A",   type: "Road Hump", x: 26.5, y: 31.0 },
  { id: "T-4B-2B", checkpoint: "tuas", zone: "4B", mapRef: "2",   lane: "B",   type: "Road Hump", x: 23.0, y: 32.5 },
  { id: "T-4B-3A", checkpoint: "tuas", zone: "4B", mapRef: "3",   lane: "A",   type: "Road Hump", x: 25.5, y: 34.0 },

  // Zone 5 (S/N 4, 5, 6, 7) — 6 barriers
  { id: "T-5-4A",  checkpoint: "tuas", zone: "5",  mapRef: "5E",  lane: "A",   type: "Blocker",   x: 30.5, y: 33.0 },
  { id: "T-5-4B",  checkpoint: "tuas", zone: "5",  mapRef: "5E",  lane: "B",   type: "Blocker",   x: 32.5, y: 34.5 },
  { id: "T-5-4C",  checkpoint: "tuas", zone: "5",  mapRef: "5E",  lane: "C",   type: "Blocker",   x: 34.5, y: 36.0 },
  { id: "T-5-5A",  checkpoint: "tuas", zone: "5",  mapRef: "6E",  lane: "A",   type: "Blocker",   x: 31.5, y: 38.0 },
  { id: "T-5-6A",  checkpoint: "tuas", zone: "5",  mapRef: "7",   lane: "A",   type: "Road Hump", x: 35.0, y: 37.5 },
  { id: "T-5-7A",  checkpoint: "tuas", zone: "5",  mapRef: "4",   lane: "A",   type: "Road Hump", x: 29.5, y: 35.5 },

  // Zone 5B (S/N 8) — 1 barrier
  { id: "T-5B-8A", checkpoint: "tuas", zone: "5B", mapRef: "8",   lane: "A",   type: "Road Hump", x: 42.0, y: 22.0 },

  // Zone 6A (S/N 9, 10) — 4 barriers
  { id: "T-6A-9A",  checkpoint: "tuas", zone: "6A", mapRef: "9E",  lane: "A",  type: "Blocker",   x: 44.0, y: 43.5 },
  { id: "T-6A-9B",  checkpoint: "tuas", zone: "6A", mapRef: "9E",  lane: "B",  type: "Blocker",   x: 46.0, y: 44.5 },
  { id: "T-6A-9C",  checkpoint: "tuas", zone: "6A", mapRef: "9E",  lane: "C",  type: "Blocker",   x: 48.0, y: 45.5 },
  { id: "T-6A-10A", checkpoint: "tuas", zone: "6A", mapRef: "11E", lane: "A",  type: "Blocker",   x: 45.5, y: 47.5 },

  // Zone 7 (S/N 11, 12, 13) — 3 barriers
  { id: "T-7-11A", checkpoint: "tuas", zone: "7",  mapRef: "10A", lane: "A",   type: "K12 Drop Arm", x: 61.0, y: 28.5 },
  { id: "T-7-12A", checkpoint: "tuas", zone: "7",  mapRef: "14E", lane: "A",   type: "Blocker",      x: 63.5, y: 30.5 },
  { id: "T-7-13A", checkpoint: "tuas", zone: "7",  mapRef: "15A", lane: "A",   type: "Sliding Bollard", x: 60.5, y: 32.0 },

  // Zone 8 (S/N 14, 15, 16) — 4 barriers (separate from drill-down markers)
  { id: "T-8-14A", checkpoint: "tuas", zone: "8",  mapRef: "37",  lane: "A",   type: "Blocker",   x: 67.5, y: 40.0 },
  { id: "T-8-14B", checkpoint: "tuas", zone: "8",  mapRef: "37",  lane: "B",   type: "Blocker",   x: 69.5, y: 41.0 },
  { id: "T-8-15A", checkpoint: "tuas", zone: "8",  mapRef: "16A", lane: "A",   type: "Blocker",   x: 71.5, y: 42.5 },
  { id: "T-8-16A", checkpoint: "tuas", zone: "8",  mapRef: "38",  lane: "A",   type: "Blocker",   x: 73.0, y: 44.0 },

  // Zone 9A (S/N 17, 18, 19, 20, 25, 27) — 9 barriers (bridge/within-building cluster)
  { id: "T-9A-17A", checkpoint: "tuas", zone: "9A", mapRef: "25",       lane: "A",   type: "Road Hump",       x: 36.0, y: 57.0 },
  { id: "T-9A-18A", checkpoint: "tuas", zone: "9A", mapRef: "23",       lane: "A",   type: "Road Hump",       x: 38.5, y: 58.5 },
  { id: "T-9A-19A", checkpoint: "tuas", zone: "9A", mapRef: "24",       lane: "A",   type: "Road Hump",       x: 41.0, y: 60.0 },
  { id: "T-9A-20A", checkpoint: "tuas", zone: "9A", mapRef: "26",       lane: "RCP", type: "Road Hump",       x: 43.5, y: 61.5 },
  { id: "T-9A-25A", checkpoint: "tuas", zone: "9A", mapRef: "34 Lvl3",  lane: "A",   type: "Sliding Bollard", x: 37.5, y: 63.0 },
  { id: "T-9A-26A", checkpoint: "tuas", zone: "9A", mapRef: "33 Lvl3",  lane: "A",   type: "Road Hump",       x: 40.0, y: 64.5 },
  { id: "T-9A-27A", checkpoint: "tuas", zone: "9A", mapRef: "31 Lvl3",  lane: "A",   type: "Sliding Bollard", x: 42.5, y: 66.0 },
  { id: "T-9A-28A", checkpoint: "tuas", zone: "9A", mapRef: "32 Lvl3",  lane: "A",   type: "Road Hump",       x: 45.0, y: 62.5 },
  { id: "T-9A-29A", checkpoint: "tuas", zone: "9A", mapRef: "30 Lvl3",  lane: "A",   type: "Road Hump",       x: 39.0, y: 60.5 },
];

// ─── WOODLANDS — 28 locations across 8 zones (W1–W8) ──────────────────────────
// Hotspot anchors: W1: 22/66, W2: 33/57, W3: 42/50, W4: 52/44,
//                  W5: 62/39, W6: 72/32, W7: 82/26, W8: 92/22

// 28 barriers mapped 1-per-S/N (BOQ R9 lists 28 S/N entries for Woodlands).
// Lane letter shown is the representative lane for multi-lane S/Ns.
export const woodlandsBarriers: BarrierLocation[] = [
  // W1 — S/N 1, 2, 3
  { id: "W-W1-1",  checkpoint: "woodlands", zone: "W1", mapRef: "2",  lane: "A/B/C", type: "Blocker", x: 20.5, y: 64.0 },
  { id: "W-W1-2",  checkpoint: "woodlands", zone: "W1", mapRef: "3",  lane: "A/B",   type: "Blocker", x: 22.5, y: 66.5 },
  { id: "W-W1-3",  checkpoint: "woodlands", zone: "W1", mapRef: "4",  lane: "A/B",   type: "Blocker", x: 24.5, y: 68.5 },

  // W2 — S/N 4, 5, 6
  { id: "W-W2-4",  checkpoint: "woodlands", zone: "W2", mapRef: "19", lane: "A/B", type: "Blocker", x: 31.0, y: 55.5 },
  { id: "W-W2-5",  checkpoint: "woodlands", zone: "W2", mapRef: "21", lane: "A/B", type: "Blocker", x: 33.5, y: 57.5 },
  { id: "W-W2-6",  checkpoint: "woodlands", zone: "W2", mapRef: "20", lane: "A/B", type: "Blocker", x: 35.5, y: 59.5 },

  // W3 — S/N 7, 8
  { id: "W-W3-7",  checkpoint: "woodlands", zone: "W3", mapRef: "18", lane: "A/B", type: "Blocker", x: 40.5, y: 49.0 },
  { id: "W-W3-8",  checkpoint: "woodlands", zone: "W3", mapRef: "16", lane: "A/B", type: "Blocker", x: 43.0, y: 51.5 },

  // W4 — S/N 9, 10, 11
  { id: "W-W4-9",  checkpoint: "woodlands", zone: "W4", mapRef: "13", lane: "A/B/C/D", type: "Blocker", x: 49.5, y: 43.0 },
  { id: "W-W4-10", checkpoint: "woodlands", zone: "W4", mapRef: "29", lane: "A/B",     type: "Blocker", x: 52.0, y: 45.0 },
  { id: "W-W4-11", checkpoint: "woodlands", zone: "W4", mapRef: "30", lane: "A/B",     type: "Blocker", x: 54.0, y: 47.0 },

  // W5 — S/N 12, 13, 14
  { id: "W-W5-12", checkpoint: "woodlands", zone: "W5", mapRef: "27",  lane: "A/B", type: "Blocker", x: 59.5, y: 38.0 },
  { id: "W-W5-13", checkpoint: "woodlands", zone: "W5", mapRef: "28",  lane: "A/B", type: "Blocker", x: 62.0, y: 40.0 },
  { id: "W-W5-14", checkpoint: "woodlands", zone: "W5", mapRef: "28R", lane: "A",   type: "Blocker", x: 64.0, y: 42.0 },

  // W6 — S/N 15, 16, 17, 18
  { id: "W-W6-15", checkpoint: "woodlands", zone: "W6", mapRef: "10", lane: "A", type: "Blocker", x: 69.5, y: 30.5 },
  { id: "W-W6-16", checkpoint: "woodlands", zone: "W6", mapRef: "11", lane: "A", type: "Blocker", x: 71.5, y: 32.0 },
  { id: "W-W6-17", checkpoint: "woodlands", zone: "W6", mapRef: "9",  lane: "A", type: "Blocker", x: 73.5, y: 33.5 },
  { id: "W-W6-18", checkpoint: "woodlands", zone: "W6", mapRef: "12", lane: "A", type: "Blocker", x: 75.5, y: 35.0 },

  // W7 — S/N 19, 20, 21, 22
  { id: "W-W7-19", checkpoint: "woodlands", zone: "W7", mapRef: "8",  lane: "A",   type: "Blocker", x: 79.0, y: 24.5 },
  { id: "W-W7-20", checkpoint: "woodlands", zone: "W7", mapRef: "25", lane: "A/B", type: "Blocker", x: 81.0, y: 26.0 },
  { id: "W-W7-21", checkpoint: "woodlands", zone: "W7", mapRef: "26", lane: "A",   type: "Blocker", x: 83.0, y: 27.5 },
  { id: "W-W7-22", checkpoint: "woodlands", zone: "W7", mapRef: "14", lane: "A/B", type: "Blocker", x: 85.0, y: 28.5 },

  // W8 — S/N 23, 24, 25, 26, 27, 28
  { id: "W-W8-23", checkpoint: "woodlands", zone: "W8", mapRef: "24",           lane: "A/B", type: "Auto Bollard",    x: 88.0, y: 20.5 },
  { id: "W-W8-24", checkpoint: "woodlands", zone: "W8", mapRef: "23",           lane: "A/B", type: "Auto Bollard",    x: 90.0, y: 21.5 },
  { id: "W-W8-25", checkpoint: "woodlands", zone: "W8", mapRef: "23R",          lane: "A",   type: "K12 Drop Arm",    x: 92.0, y: 22.5 },
  { id: "W-W8-26", checkpoint: "woodlands", zone: "W8", mapRef: "17",           lane: "A",   type: "Blocker",         x: 94.0, y: 23.5 },
  { id: "W-W8-27", checkpoint: "woodlands", zone: "W8", mapRef: "38R(A) Lvl2",  lane: "A",   type: "Sliding Bollard", x: 93.0, y: 25.0 },
  { id: "W-W8-28", checkpoint: "woodlands", zone: "W8", mapRef: "39R(A) Lvl2",  lane: "A",   type: "Sliding Bollard", x: 91.5, y: 26.0 },
];
