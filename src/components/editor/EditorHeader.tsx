"use client";

import type {
  ChangeEvent,
  RefObject,
} from "react";

type EditorHeaderProps = {
  patternName: string | null;
  hasPattern: boolean;
  canUndo: boolean;
  canRedo: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onNew: () => void;
  onOpen: () => void;
  onImageToPattern: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExportPng: () => void;
  onOpenFile: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export function EditorHeader({
  patternName,
  hasPattern,
  canUndo,
  canRedo,
  fileInputRef,
  onNew,
  onOpen,
  onImageToPattern,
  onSave,
  onUndo,
  onRedo,
  onExportPng,
  onOpenFile,
}: EditorHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-300 bg-white px-5">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-lg font-semibold">
            StitchDesigner
          </div>

          {patternName && (
            <div className="text-xs text-slate-500">
              {patternName}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
          >
            Nuevo
          </button>

          <button
            onClick={onOpen}
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
          >
            Abrir
          </button>

          <button
            onClick={onImageToPattern}
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
          >
            Imagen → Patrón
          </button>

          <button
            onClick={onSave}
            disabled={!hasPattern}
            className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".stitch,application/json"
            onChange={onOpenFile}
            className="hidden"
          />
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Undo
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Redo
        </button>

        <button
          onClick={onExportPng}
          disabled={!hasPattern}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Exportar PNG
        </button>
      </div>
    </header>
  );
}
