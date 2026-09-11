export default function Home() {
  const palette = [
    { name: "Black", color: "#111111" },
    { name: "Dark Red", color: "#A92332" },
    { name: "Green", color: "#2E7D32" },
    { name: "Blue", color: "#2563EB" },
    { name: "Gold", color: "#D4A017" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-300 bg-white px-5">
          <div className="flex items-center gap-6">
            <div className="text-lg font-semibold">StitchDesigner</div>

            <nav className="flex items-center gap-2">
              <button className="rounded-md px-3 py-2 text-sm hover:bg-slate-100">
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
            <div className="flex min-h-full items-center justify-center">
              <div className="relative h-[640px] w-[900px] overflow-hidden rounded-lg border border-slate-400 bg-white shadow-sm">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-2 text-xs text-slate-500 shadow-sm">
                  Canvas del patrón
                </div>
              </div>
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
                  style={{ backgroundColor: palette[0].color }}
                />
                <div className="text-sm font-medium">{palette[0].name}</div>
              </div>
            </div>

            <div className="space-y-2">
              {palette.map((thread) => (
                <button
                  key={thread.name}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span
                    className="h-6 w-6 rounded border border-slate-300"
                    style={{ backgroundColor: thread.color }}
                  />

                  <span className="text-sm">{thread.name}</span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <footer className="flex h-10 items-center justify-between border-t border-slate-300 bg-white px-5 text-xs text-slate-600">
          <div className="flex items-center gap-6">
            <span>100 × 80 puntadas</span>
            <span>0 puntadas</span>
            <span>5 colores</span>
          </div>

          <div>Zoom 100%</div>
        </footer>
      </div>
    </main>
  );
}