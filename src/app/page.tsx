"use client";

import { useEffect, useRef, useState } from "react";

type StitchType = "full";
type EditorTool = "stitch" | "erase" | "pan";

type Stitch = {
  x: number;
  y: number;
  colorId: string;
  type: StitchType;
};

type Thread = {
  id: string;
  name: string;
  rgb: string;
  symbol: string;
  brand: string;
};

type Fabric = {
  type: string;
  count: number;
  color: string;
};

type Pattern = {
  version: "1.0";
  id: string;
  name: string;
  width: number;
  height: number;
  fabric: Fabric;
  palette: Thread[];
  stitches: Stitch[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};

type StitchHistoryEntry = {
  x: number;
  y: number;
  before: Stitch | null;
  after: Stitch | null;
};

const internalPalette: Thread[] = [
  {
    id: "thread-001",
    name: "Black",
    rgb: "#111111",
    symbol: "X",
    brand: "internal",
  },
  {
    id: "thread-002",
    name: "Dark Red",
    rgb: "#A92332",
    symbol: "O",
    brand: "internal",
  },
  {
    id: "thread-003",
    name: "Green",
    rgb: "#2E7D32",
    symbol: "+",
    brand: "internal",
  },
  {
    id: "thread-004",
    name: "Blue",
    rgb: "#2563EB",
    symbol: "#",
    brand: "internal",
  },
  {
    id: "thread-005",
    name: "Gold",
    rgb: "#D4A017",
    symbol: "*",
    brand: "internal",
  },
];

const CELL_SIZE = 20;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const panStartRef = useRef({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const [showNewPattern, setShowNewPattern] = useState(false);
  const [pattern, setPattern] = useState<Pattern | null>(null);

  const [name, setName] = useState("Mi patrón");
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(80);
  const [fabricType, setFabricType] = useState("aida");
  const [fabricCount, setFabricCount] = useState(14);
  const [fabricColor, setFabricColor] = useState("#ffffff");

  const [selectedColorId, setSelectedColorId] =
    useState(internalPalette[0].id);

  const [selectedTool, setSelectedTool] =
    useState<EditorTool>("stitch");

  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const [undoStack, setUndoStack] = useState<StitchHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<StitchHistoryEntry[]>([]);

  const activePalette =
    pattern && pattern.palette.length > 0
      ? pattern.palette
      : internalPalette;

  const selectedThread =
    activePalette.find((thread) => thread.id === selectedColorId) ??
    activePalette[0];

  function openNewPatternDialog() {
    setName("Mi patrón");
    setWidth(100);
    setHeight(80);
    setFabricType("aida");
    setFabricCount(14);
    setFabricColor("#ffffff");
    setShowNewPattern(true);
  }

  function createPattern() {
    if (
      name.trim() === "" ||
      !Number.isInteger(width) ||
      width <= 0 ||
      !Number.isInteger(height) ||
      height <= 0 ||
      fabricCount <= 0
    ) {
      alert(
        "Revisa los datos del patrón. Ancho, alto y count deben ser válidos.",
      );
      return;
    }

    const now = new Date().toISOString();

    const newPattern: Pattern = {
      version: "1.0",
      id: crypto.randomUUID(),
      name: name.trim(),
      width,
      height,
      fabric: {
        type: fabricType,
        count: fabricCount,
        color: fabricColor,
      },
      palette: internalPalette,
      stitches: [],
      metadata: {
        createdAt: now,
        updatedAt: now,
      },
    };

    setPattern(newPattern);
    setSelectedColorId(internalPalette[0].id);
    setSelectedTool("stitch");
    setZoom(1);
    setUndoStack([]);
    setRedoStack([]);
    setShowNewPattern(false);
  }

  function updatePatternCell(
    currentPattern: Pattern,
    x: number,
    y: number,
    stitch: Stitch | null,
  ): Pattern {
    const remainingStitches = currentPattern.stitches.filter(
      (item) => !(item.x === x && item.y === y),
    );

    return {
      ...currentPattern,
      stitches: stitch
        ? [...remainingStitches, stitch]
        : remainingStitches,
      metadata: {
        ...currentPattern.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  function addHistoryEntry(entry: StitchHistoryEntry) {
    setUndoStack((current) => [...current, entry]);
    setRedoStack([]);
  }

  function handleCanvasClick(
    event: React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (!pattern || selectedTool === "pan") {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const x = Math.floor(mouseX / CELL_SIZE);
    const y = Math.floor(mouseY / CELL_SIZE);

    if (
      x < 0 ||
      y < 0 ||
      x >= pattern.width ||
      y >= pattern.height
    ) {
      return;
    }

    const existingStitch =
      pattern.stitches.find(
        (stitch) => stitch.x === x && stitch.y === y,
      ) ?? null;

    if (selectedTool === "erase") {
      if (!existingStitch) {
        return;
      }

      const historyEntry: StitchHistoryEntry = {
        x,
        y,
        before: existingStitch,
        after: null,
      };

      setPattern(updatePatternCell(pattern, x, y, null));
      addHistoryEntry(historyEntry);

      return;
    }

    const newStitch: Stitch = {
      x,
      y,
      colorId: selectedColorId,
      type: "full",
    };

    if (
      existingStitch &&
      existingStitch.colorId === newStitch.colorId &&
      existingStitch.type === newStitch.type
    ) {
      return;
    }

    const historyEntry: StitchHistoryEntry = {
      x,
      y,
      before: existingStitch,
      after: newStitch,
    };

    setPattern(updatePatternCell(pattern, x, y, newStitch));
    addHistoryEntry(historyEntry);
  }

  function handleUndo() {
    if (!pattern || undoStack.length === 0) {
      return;
    }

    const entry = undoStack[undoStack.length - 1];

    setPattern(
      updatePatternCell(
        pattern,
        entry.x,
        entry.y,
        entry.before,
      ),
    );

    setUndoStack((current) => current.slice(0, -1));
    setRedoStack((current) => [...current, entry]);
  }

  function handleRedo() {
    if (!pattern || redoStack.length === 0) {
      return;
    }

    const entry = redoStack[redoStack.length - 1];

    setPattern(
      updatePatternCell(
        pattern,
        entry.x,
        entry.y,
        entry.after,
      ),
    );

    setRedoStack((current) => current.slice(0, -1));
    setUndoStack((current) => [...current, entry]);
  }

  function isValidHexColor(value: unknown): value is string {
    return (
      typeof value === "string" &&
      /^#[0-9A-Fa-f]{6}$/.test(value)
    );
  }

  function isValidDate(value: unknown): value is string {
    return (
      typeof value === "string" &&
      !Number.isNaN(Date.parse(value))
    );
  }

  function isValidPattern(value: unknown): value is Pattern {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const candidate = value as Partial<Pattern>;

    if (
      candidate.version !== "1.0" ||
      typeof candidate.id !== "string" ||
      candidate.id.trim() === "" ||
      typeof candidate.name !== "string" ||
      candidate.name.trim() === "" ||
      !Number.isInteger(candidate.width) ||
      !candidate.width ||
      candidate.width <= 0 ||
      !Number.isInteger(candidate.height) ||
      !candidate.height ||
      candidate.height <= 0
    ) {
      return false;
    }

    if (
      typeof candidate.fabric !== "object" ||
      candidate.fabric === null ||
      typeof candidate.fabric.type !== "string" ||
      typeof candidate.fabric.count !== "number" ||
      candidate.fabric.count <= 0 ||
      !isValidHexColor(candidate.fabric.color)
    ) {
      return false;
    }

    if (!Array.isArray(candidate.palette)) {
      return false;
    }

    const threadIds = new Set<string>();

    for (const thread of candidate.palette) {
      if (
        typeof thread !== "object" ||
        thread === null ||
        typeof thread.id !== "string" ||
        thread.id.trim() === "" ||
        typeof thread.name !== "string" ||
        !isValidHexColor(thread.rgb) ||
        typeof thread.symbol !== "string" ||
        typeof thread.brand !== "string"
      ) {
        return false;
      }

      if (threadIds.has(thread.id)) {
        return false;
      }

      threadIds.add(thread.id);
    }

    if (!Array.isArray(candidate.stitches)) {
      return false;
    }

    const occupiedCells = new Set<string>();

    for (const stitch of candidate.stitches) {
      if (
        typeof stitch !== "object" ||
        stitch === null ||
        !Number.isInteger(stitch.x) ||
        !Number.isInteger(stitch.y) ||
        stitch.x < 0 ||
        stitch.y < 0 ||
        stitch.x >= candidate.width ||
        stitch.y >= candidate.height ||
        stitch.type !== "full" ||
        typeof stitch.colorId !== "string" ||
        !threadIds.has(stitch.colorId)
      ) {
        return false;
      }

      const cellKey = `${stitch.x}:${stitch.y}`;

      if (occupiedCells.has(cellKey)) {
        return false;
      }

      occupiedCells.add(cellKey);
    }

    if (
      typeof candidate.metadata !== "object" ||
      candidate.metadata === null ||
      !isValidDate(candidate.metadata.createdAt) ||
      !isValidDate(candidate.metadata.updatedAt)
    ) {
      return false;
    }

    return true;
  }

  function sanitizeFilename(value: string) {
    const sanitized = value
      .trim()
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, "-");

    return sanitized || "pattern";
  }

  function savePattern() {
    if (!pattern) {
      return;
    }

    const patternToSave: Pattern = {
      ...pattern,
      metadata: {
        ...pattern.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    setPattern(patternToSave);

    const json = JSON.stringify(patternToSave, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${sanitizeFilename(patternToSave.name)}.stitch`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function openPatternFileSelector() {
    fileInputRef.current?.click();
  }

  async function handleOpenPattern(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const data: unknown = JSON.parse(text);

      if (!isValidPattern(data)) {
        alert(
          "El archivo no es un patrón StitchDesigner válido o utiliza una versión no compatible.",
        );

        event.target.value = "";
        return;
      }

      setPattern(data);

      setSelectedColorId(
        data.palette[0]?.id ?? internalPalette[0].id,
      );

      setSelectedTool("stitch");
      setZoom(1);
      setUndoStack([]);
      setRedoStack([]);
    } catch {
      alert(
        "No se ha podido abrir el archivo. Comprueba que es un archivo .stitch válido.",
      );
    }

    event.target.value = "";
  }

  function changeZoom(amount: number) {
    if (!pattern) {
      return;
    }

    setZoom((currentZoom) => {
      const newZoom = currentZoom + amount;

      return Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Math.round(newZoom * 100) / 100),
      );
    });
  }

  function resetZoom() {
    if (!pattern) {
      return;
    }

    setZoom(1);
  }

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    if (!pattern) {
      return;
    }

    event.preventDefault();

    if (event.deltaY < 0) {
      changeZoom(0.1);
    } else {
      changeZoom(-0.1);
    }
  }

  function handlePanStart(event: React.MouseEvent<HTMLElement>) {
    if (selectedTool !== "pan") {
      return;
    }

    const workspace = workspaceRef.current;

    if (!workspace) {
      return;
    }

    setIsPanning(true);

    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: workspace.scrollLeft,
      scrollTop: workspace.scrollTop,
    };
  }

  function handlePanMove(event: React.MouseEvent<HTMLElement>) {
    if (!isPanning || selectedTool !== "pan") {
      return;
    }

    const workspace = workspaceRef.current;

    if (!workspace) {
      return;
    }

    const deltaX = event.clientX - panStartRef.current.x;
    const deltaY = event.clientY - panStartRef.current.y;

    workspace.scrollLeft =
      panStartRef.current.scrollLeft - deltaX;

    workspace.scrollTop =
      panStartRef.current.scrollTop - deltaY;
  }

  function handlePanEnd() {
    setIsPanning(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !pattern) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const canvasWidth = pattern.width * CELL_SIZE;
    const canvasHeight = pattern.height * CELL_SIZE;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = pattern.fabric.color;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    for (const stitch of pattern.stitches) {
      const thread = pattern.palette.find(
        (item) => item.id === stitch.colorId,
      );

      if (!thread) {
        continue;
      }

      context.fillStyle = thread.rgb;

      context.fillRect(
        stitch.x * CELL_SIZE + 1,
        stitch.y * CELL_SIZE + 1,
        CELL_SIZE - 1,
        CELL_SIZE - 1,
      );
    }

    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 1;

    for (let x = 0; x <= pattern.width; x += 1) {
      const pixelX = x * CELL_SIZE + 0.5;

      context.beginPath();
      context.moveTo(pixelX, 0);
      context.lineTo(pixelX, canvasHeight);
      context.stroke();
    }

    for (let y = 0; y <= pattern.height; y += 1) {
      const pixelY = y * CELL_SIZE + 0.5;

      context.beginPath();
      context.moveTo(0, pixelY);
      context.lineTo(canvasWidth, pixelY);
      context.stroke();
    }

    context.strokeStyle = "#94a3b8";
    context.lineWidth = 1.5;

    for (let x = 0; x <= pattern.width; x += 10) {
      const pixelX = x * CELL_SIZE + 0.5;

      context.beginPath();
      context.moveTo(pixelX, 0);
      context.lineTo(pixelX, canvasHeight);
      context.stroke();
    }

    for (let y = 0; y <= pattern.height; y += 10) {
      const pixelY = y * CELL_SIZE + 0.5;

      context.beginPath();
      context.moveTo(0, pixelY);
      context.lineTo(canvasWidth, pixelY);
      context.stroke();
    }
  }, [pattern]);

  const displayedWidth = pattern?.width ?? 100;
  const displayedHeight = pattern?.height ?? 80;
  const displayedStitches = pattern?.stitches.length ?? 0;

  const displayedColors = pattern
    ? new Set(
        pattern.stitches.map((stitch) => stitch.colorId),
      ).size
    : 0;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-300 bg-white px-5">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-lg font-semibold">
                StitchDesigner
              </div>

              {pattern && (
                <div className="text-xs text-slate-500">
                  {pattern.name}
                </div>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={openNewPatternDialog}
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
              >
                Nuevo
              </button>

              <button
                onClick={openPatternFileSelector}
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
              >
                Abrir
              </button>

              <button
                onClick={savePattern}
                disabled={!pattern}
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Guardar
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".stitch,application/json"
                onChange={handleOpenPattern}
                className="hidden"
              />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!pattern || undoStack.length === 0}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Undo
            </button>

            <button
              onClick={handleRedo}
              disabled={!pattern || redoStack.length === 0}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Redo
            </button>

            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700">
              Exportar PNG
            </button>
          </div>
        </header>

        <section className="grid flex-1 grid-cols-[180px_1fr_240px] overflow-hidden">
          <aside className="border-r border-slate-300 bg-white p-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Herramientas
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedTool("stitch")}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm ${
                  selectedTool === "stitch"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 hover:bg-slate-50"
                }`}
              >
                Puntada
              </button>

              <button
                onClick={() => setSelectedTool("erase")}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm ${
                  selectedTool === "erase"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 hover:bg-slate-50"
                }`}
              >
                Borrar
              </button>

              <button
                onClick={() => setSelectedTool("pan")}
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
                {selectedTool === "stitch" && "Puntada"}
                {selectedTool === "erase" && "Borrar"}
                {selectedTool === "pan" && "Mover"}
              </div>
            </div>
          </aside>

          <section
            ref={workspaceRef}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            className={`overflow-auto bg-slate-200 p-6 select-none ${
              selectedTool === "pan"
                ? isPanning
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : ""
            }`}
          >
            <div className="min-h-full min-w-full">
              {!pattern && (
                <div className="flex h-full min-h-[640px] items-center justify-center text-sm text-slate-500">
                  Crea un patrón nuevo para mostrar el Canvas.
                </div>
              )}

              {pattern && (
                <div className="inline-block overflow-hidden rounded-lg border border-slate-400 bg-white shadow-sm">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    style={{
                      width: `${pattern.width * CELL_SIZE * zoom}px`,
                      height: `${pattern.height * CELL_SIZE * zoom}px`,
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
            </div>
          </section>

          <aside className="border-l border-slate-300 bg-white p-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Paleta
            </h2>

            <div className="mb-5 rounded-lg border border-slate-300 p-3">
              <div className="mb-2 text-xs text-slate-500">
                Color seleccionado
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-md border border-slate-300"
                  style={{
                    backgroundColor: selectedThread.rgb,
                  }}
                />

                <div>
                  <div className="text-sm font-medium">
                    {selectedThread.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    Símbolo: {selectedThread.symbol}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {activePalette.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() =>
                    setSelectedColorId(thread.id)
                  }
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${
                    selectedColorId === thread.id
                      ? "border-slate-900 bg-slate-100"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded border border-slate-300"
                    style={{
                      backgroundColor: thread.rgb,
                    }}
                  />

                  <span className="flex-1 text-sm">
                    {thread.name}
                  </span>

                  <span className="text-xs text-slate-500">
                    {thread.symbol}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <footer className="flex h-10 items-center justify-between border-t border-slate-300 bg-white px-5 text-xs text-slate-600">
          <div className="flex items-center gap-6">
            <span>
              {displayedWidth} × {displayedHeight} puntadas
            </span>

            <span>{displayedStitches} puntadas</span>

            <span>{displayedColors} colores</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeZoom(-0.25)}
              disabled={!pattern || zoom <= MIN_ZOOM}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <button
              onClick={resetZoom}
              disabled={!pattern}
              className="min-w-[90px] rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
              title="Volver a 100%"
            >
              Zoom {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={() => changeZoom(0.25)}
              disabled={!pattern || zoom >= MAX_ZOOM}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        </footer>
      </div>

      {showNewPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Nuevo patrón
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Define las características básicas del patrón.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nombre
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Ancho
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={width}
                      onChange={(event) =>
                        setWidth(Number(event.target.value))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />

                    <span className="text-xs text-slate-500">
                      puntadas
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Alto
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={height}
                      onChange={(event) =>
                        setHeight(Number(event.target.value))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />

                    <span className="text-xs text-slate-500">
                      puntadas
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="mb-3 text-sm font-semibold">
                  Tela
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Tipo
                    </label>

                    <select
                      value={fabricType}
                      onChange={(event) =>
                        setFabricType(event.target.value)
                      }
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    >
                      <option value="aida">Aida</option>
                      <option value="evenweave">
                        Evenweave
                      </option>
                      <option value="other">Otra</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Count
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={fabricCount}
                      onChange={(event) =>
                        setFabricCount(Number(event.target.value))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Color
                    </label>

                    <input
                      type="color"
                      value={fabricColor}
                      onChange={(event) =>
                        setFabricColor(event.target.value)
                      }
                      className="h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowNewPattern(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                onClick={createPattern}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
              >
                Crear patrón
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}