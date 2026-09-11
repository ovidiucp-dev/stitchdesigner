"use client";

import { useEffect, useRef, useState } from "react";

type StitchType = "full";

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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const selectedThread =
    internalPalette.find((thread) => thread.id === selectedColorId) ??
    internalPalette[0];

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
    setShowNewPattern(false);
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
  const displayedColors = pattern?.palette.length ?? internalPalette.length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-300 bg-white px-5">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-lg font-semibold">StitchDesigner</div>

              {pattern && (
                <div className="text-xs text-slate-500">{pattern.name}</div>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={openNewPatternDialog}
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
              >
                Nuevo
              </button>

              <button className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">
                Abrir
              </button>

              <button className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">
                Guardar
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100">
              Undo
            </button>

            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100">
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
              <button className="w-full rounded-lg bg-slate-900 px-3 py-3 text-left text-sm text-white">
                Puntada
              </button>

              <button className="w-full rounded-lg border border-slate-300 px-3 py-3 text-left text-sm hover:bg-slate-50">
                Borrar
              </button>

              <button className="w-full rounded-lg border border-slate-300 px-3 py-3 text-left text-sm hover:bg-slate-50">
                Mover
              </button>
            </div>
          </aside>

          <section className="overflow-auto bg-slate-200 p-6">
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
                    className="block"
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
                  style={{ backgroundColor: selectedThread.rgb }}
                />

                <div className="text-sm font-medium">
                  {selectedThread.name}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {internalPalette.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedColorId(thread.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${
                    selectedColorId === thread.id
                      ? "border-slate-900 bg-slate-100"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded border border-slate-300"
                    style={{ backgroundColor: thread.rgb }}
                  />

                  <span className="flex-1 text-sm">{thread.name}</span>

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

          <div>Zoom 100%</div>
        </footer>
      </div>

      {showNewPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Nuevo patrón</h2>

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
                  onChange={(event) => setName(event.target.value)}
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
                <div className="mb-3 text-sm font-semibold">Tela</div>

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
                      <option value="evenweave">Evenweave</option>
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