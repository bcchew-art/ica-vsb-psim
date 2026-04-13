"use client";

import { Plus, Minus, Maximize2 } from "lucide-react";
import { usePsimStore } from "@/stores/psim-store";
import type { MapViewMode } from "@/stores/psim-store";

export function MapOverlay() {
  const viewMode = usePsimStore((s) => s.mapViewMode);
  const setViewMode = usePsimStore((s) => s.setMapViewMode);
  const zoomIn = usePsimStore((s) => s.zoomIn);
  const zoomOut = usePsimStore((s) => s.zoomOut);
  const resetZoom = usePsimStore((s) => s.resetZoom);
  const mapZoom = usePsimStore((s) => s.mapZoom);

  const handleSet = (mode: MapViewMode) => () => setViewMode(mode);

  // In 3D isometric view, the world X axis (traffic flow) projects to roughly
  // 30° below horizontal on screen. The arrow text needs to tilt to match,
  // otherwise it looks like traffic flows horizontally which contradicts the scene.
  // In 2D top-down view, the X axis IS horizontal on screen, so no tilt.
  const arrowTilt = viewMode === "3d" ? "rotate(30deg)" : "rotate(0deg)";

  // In 3D iso view the scene runs diagonally, so we anchor the labels near the
  // actual corners where Malaysia and Singapore sides project on screen.
  const malaysiaPosition =
    viewMode === "3d"
      ? "absolute top-[18%] left-[12%]"
      : "absolute left-4 top-1/2 -translate-y-1/2";
  const singaporePosition =
    viewMode === "3d"
      ? "absolute bottom-[18%] right-[12%]"
      : "absolute right-4 top-1/2 -translate-y-1/2";

  return (
    <>
      {/* View mode toggle + zoom controls — top-right corner */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="flex rounded-md overflow-hidden border border-border shadow-sm bg-surface-elevated">
          <button
            type="button"
            onClick={handleSet("3d")}
            className={`px-3 py-1.5 text-body-sm font-mono tracking-wider transition-colors ${
              viewMode === "3d"
                ? "bg-ica-blue text-white"
                : "bg-surface-elevated text-text-secondary hover:bg-surface"
            }`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={handleSet("2d")}
            className={`px-3 py-1.5 text-body-sm font-mono tracking-wider border-l border-border transition-colors ${
              viewMode === "2d"
                ? "bg-ica-blue text-white"
                : "bg-surface-elevated text-text-secondary hover:bg-surface"
            }`}
          >
            2D
          </button>
        </div>

        <div className="flex rounded-md overflow-hidden border border-border shadow-sm bg-surface-elevated">
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom out"
            className="px-2 py-1.5 text-text-secondary hover:bg-surface transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            title={`Reset zoom (${Math.round((mapZoom / 1.73) * 100)}%)`}
            className="px-2 py-1.5 text-text-secondary hover:bg-surface border-l border-border transition-colors font-mono text-[10px] min-w-[44px]"
          >
            {Math.round((mapZoom / 1.73) * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom in"
            className="px-2 py-1.5 text-text-secondary hover:bg-surface border-l border-border transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* MALAYSIA label — origin of traffic */}
      <div className={`${malaysiaPosition} z-20 pointer-events-none`}>
        <div
          className="flex items-center gap-2 font-mono text-text-secondary"
          style={{ transform: arrowTilt, transformOrigin: "left center" }}
        >
          <div className="text-label uppercase tracking-widest">Malaysia</div>
          <div className="text-h2 leading-none text-ica-blue">→</div>
        </div>
      </div>

      {/* SINGAPORE label — destination of traffic */}
      <div className={`${singaporePosition} z-20 pointer-events-none`}>
        <div
          className="flex items-center gap-2 font-mono text-text-secondary"
          style={{ transform: arrowTilt, transformOrigin: "right center" }}
        >
          <div className="text-h2 leading-none text-ica-blue">→</div>
          <div className="text-label uppercase tracking-widest">Singapore</div>
        </div>
      </div>
    </>
  );
}
