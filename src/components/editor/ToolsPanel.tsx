"use client";

export type EditorTool =
  | "stitch"
  | "erase"
  | "pan";

type ToolsPanelProps = {
  selectedTool: EditorTool;
  onSelectTool: (
    tool: EditorTool,
  ) => void;
};

export function ToolsPanel({
  selectedTool,
  onSelectTool,
}: ToolsPanelProps) {
  return (
    <aside className="border-r border-slate-300 bg-white p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Herramientas
      </h2>

      <div className="space-y-2">
        <button
          onClick={() =>
            onSelectTool("stitch")
          }
          className={`w-full rounded-lg px-3 py-3 text-left text-sm ${
            selectedTool === "stitch"
              ? "bg-slate-900 text-white"
              : "border border-slate-300 hover:bg-slate-50"
          }`}
        >
          Puntada
        </button>

        <button
          onClick={() =>
            onSelectTool("erase")
          }
          className={`w-full rounded-lg px-3 py-3 text-left text-sm ${
            selectedTool === "erase"
              ? "bg-slate-900 text-white"
              : "border border-slate-300 hover:bg-slate-50"
          }`}
        >
          Borrar
        </button>

        <button
          onClick={() =>
            onSelectTool("pan")
          }
          className={`w-full rounded-lg px-3 py-3 text-left text-sm ${
            selectedTool === "pan"
              ? "bg-slate-900 text-white"
              : "border border-slate-300 hover:bg-slate-50"
          }`}
        >
          Mover
        </button>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="text-xs text-slate-500">
          Herramienta activa
        </div>

        <div className="mt-1 text-sm font-medium">
          {selectedTool === "stitch" &&
            "Puntada"}

          {selectedTool === "erase" &&
            "Borrar"}

          {selectedTool === "pan" &&
            "Mover"}
        </div>
      </div>
    </aside>
  );
}