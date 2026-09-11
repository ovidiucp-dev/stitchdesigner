"use client";

type StatusBarProps = {
  width: number;
  height: number;
  stitches: number;
  colors: number;
  zoom: number;
  hasPattern: boolean;
  minZoom: number;
  maxZoom: number;

  onZoomOut: () => void;
  onZoomIn: () => void;
  onResetZoom: () => void;
};

export function StatusBar({
  width,
  height,
  stitches,
  colors,
  zoom,
  hasPattern,
  minZoom,
  maxZoom,
  onZoomOut,
  onZoomIn,
  onResetZoom,
}: StatusBarProps) {
  return (
    <footer className="flex h-10 items-center justify-between border-t border-slate-300 bg-white px-5 text-xs text-slate-600">
      <div className="flex items-center gap-6">
        <span>
          {width} × {height} puntadas
        </span>

        <span>
          {stitches} puntadas
        </span>

        <span>
          {colors} colores
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={
            !hasPattern ||
            zoom <= minZoom
          }
          className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <button
          onClick={onResetZoom}
          disabled={!hasPattern}
          className="min-w-[90px] rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
          title="Volver a 100%"
        >
          Zoom {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          disabled={
            !hasPattern ||
            zoom >= maxZoom
          }
          className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </footer>
  );
}