"use client";

import type {
  MouseEvent,
  RefObject,
  WheelEvent,
} from "react";

import {
  CELL_SIZE,
} from "@/lib/canvasRenderer";

import type {
  Pattern,
} from "@/types/pattern";

import type {
  EditorTool,
} from "@/components/editor/ToolsPanel";

type PatternCanvasProps = {
  pattern: Pattern | null;
  zoom: number;
  selectedTool: EditorTool;
  isPanning: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  workspaceRef: RefObject<HTMLElement | null>;

  onCanvasClick: (
    event: MouseEvent<HTMLCanvasElement>,
  ) => void;

  onWheel: (
    event: WheelEvent<HTMLElement>,
  ) => void;

  onPanStart: (
    event: MouseEvent<HTMLElement>,
  ) => void;

  onPanMove: (
    event: MouseEvent<HTMLElement>,
  ) => void;

  onPanEnd: () => void;
};

export function PatternCanvas({
  pattern,
  zoom,
  selectedTool,
  isPanning,
  canvasRef,
  workspaceRef,
  onCanvasClick,
  onWheel,
  onPanStart,
  onPanMove,
  onPanEnd,
}: PatternCanvasProps) {
  return (
    <section
      ref={workspaceRef}
      onWheel={onWheel}
      onMouseDown={onPanStart}
      onMouseMove={onPanMove}
      onMouseUp={onPanEnd}
      onMouseLeave={onPanEnd}
      className={`min-h-0 min-w-0 overflow-auto bg-slate-200 p-6 select-none ${
        selectedTool === "pan"
          ? isPanning
            ? "cursor-grabbing"
            : "cursor-grab"
          : ""
      }`}
    >
      {!pattern && (
        <div className="flex h-full min-h-full items-center justify-center text-sm text-slate-500">
          Crea un patrón nuevo para mostrar el Canvas.
        </div>
      )}

      {pattern && (
        <div className="inline-block overflow-hidden rounded-lg border border-slate-400 bg-white shadow-sm">
          <canvas
            ref={canvasRef}
            onClick={onCanvasClick}
            style={{
              width: `${
                pattern.width *
                CELL_SIZE *
                zoom
              }px`,
              height: `${
                pattern.height *
                CELL_SIZE *
                zoom
              }px`,
            }}
            className={`block ${
              selectedTool === "stitch"
                ? "cursor-crosshair"
                : selectedTool === "erase"
                  ? "cursor-pointer"
                  : ""
            }`}
            aria-label="Canvas del patrón"
          />
        </div>
      )}
    </section>
  );
}