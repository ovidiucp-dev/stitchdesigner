"use client";

type NewPatternDialogProps = {
  open: boolean;

  name: string;
  width: number;
  height: number;

  fabricType: string;
  fabricCount: number;
  fabricColor: string;

  onNameChange: (
    value: string,
  ) => void;

  onWidthChange: (
    value: number,
  ) => void;

  onHeightChange: (
    value: number,
  ) => void;

  onFabricTypeChange: (
    value: string,
  ) => void;

  onFabricCountChange: (
    value: number,
  ) => void;

  onFabricColorChange: (
    value: string,
  ) => void;

  onCancel: () => void;
  onCreate: () => void;
};

export function NewPatternDialog({
  open,
  name,
  width,
  height,
  fabricType,
  fabricCount,
  fabricColor,
  onNameChange,
  onWidthChange,
  onHeightChange,
  onFabricTypeChange,
  onFabricCountChange,
  onFabricColorChange,
  onCancel,
  onCreate,
}: NewPatternDialogProps) {
  if (!open) {
    return null;
  }

  return (
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
                onNameChange(
                  event.target.value,
                )
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
                    onWidthChange(
                      Number(
                        event.target.value,
                      ),
                    )
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
                    onHeightChange(
                      Number(
                        event.target.value,
                      ),
                    )
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
                    onFabricTypeChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="aida">
                    Aida
                  </option>

                  <option value="evenweave">
                    Evenweave
                  </option>

                  <option value="other">
                    Otra
                  </option>
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
                    onFabricCountChange(
                      Number(
                        event.target.value,
                      ),
                    )
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
                    onFabricColorChange(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            onClick={onCreate}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Crear patrón
          </button>
        </div>
      </div>
    </div>
  );
}