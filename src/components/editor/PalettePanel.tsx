"use client";

import type {
  Thread,
} from "@/types/pattern";

type PalettePanelProps = {
  palette: Thread[];
  selectedThread: Thread;
  selectedColorId: string;

  onSelectColor: (
    colorId: string,
  ) => void;
};

export function PalettePanel({
  palette,
  selectedThread,
  selectedColorId,
  onSelectColor,
}: PalettePanelProps) {
  return (
    <aside className="border-l border-slate-300 bg-white p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Palette
      </h2>

      <div className="mb-5 rounded-lg border border-slate-300 p-3">
        <div className="mb-2 text-xs text-slate-500">
          Selected color
        </div>

        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-md border border-slate-300"
            style={{
              backgroundColor:
                selectedThread.rgb,
            }}
          />

          <div>
            <div className="text-sm font-medium">
              {selectedThread.name}
            </div>

            <div className="text-xs text-slate-500">
              Símbolo:{" "}
              {selectedThread.symbol}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {palette.map(
          (thread) => (
            <button
              key={thread.id}
              onClick={() =>
                onSelectColor(
                  thread.id,
                )
              }
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${
                selectedColorId ===
                thread.id
                  ? "border-slate-900 bg-slate-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span
                className="h-6 w-6 rounded border border-slate-300"
                style={{
                  backgroundColor:
                    thread.rgb,
                }}
              />

              <span className="flex-1 text-sm">
                {thread.name}
              </span>

              <span className="text-xs text-slate-500">
                {thread.symbol}
              </span>
            </button>
          ),
        )}
      </div>
    </aside>
  );
}