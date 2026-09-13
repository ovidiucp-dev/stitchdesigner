"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  convertImageToPattern,
} from "@/lib/converter/imageToPattern";

import {
  loadImageFile,
  releaseLoadedImage,
} from "@/lib/converter/imageLoader";

import {
  calculateProportionalDimensions,
} from "@/lib/converter/imageResize";

import type {
  CleanupLevel,
  LoadedImage,
} from "@/lib/converter/converterTypes";

import type {
  Pattern,
} from "@/types/pattern";

type ImageToPatternDialogProps = {
  open: boolean;

  onCancel: () => void;

  onCreate: (
    pattern: Pattern,
  ) => void;
};

const DETAIL_OPTIONS = [
  {
    label: "Low",
    value: 80,
  },
  {
    label: "Medium",
    value: 120,
  },
  {
    label: "High",
    value: 160,
  },
] as const;

const COLOR_PRESETS = [
  8,
  16,
  24,
] as const;

const CLEANUP_OPTIONS: {
  label: string;
  value: CleanupLevel;
}[] = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Soft",
    value: "soft",
  },
  {
    label: "Balanced",
    value: "balanced",
  },
  {
    label: "High",
    value: "high",
  },
];

export function ImageToPatternDialog({
  open,
  onCancel,
  onCreate,
}: ImageToPatternDialogProps) {
  const originalCanvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const resultCanvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const [
    loadedImage,
    setLoadedImage,
  ] =
    useState<LoadedImage | null>(
      null,
    );

  const [
    patternName,
    setPatternName,
  ] =
    useState(
      "Pattern from image",
    );

  const [
    width,
    setWidth,
  ] =
    useState(120);

  const [
    height,
    setHeight,
  ] =
    useState(80);

  const [
    keepRatio,
    setKeepRatio,
  ] =
    useState(true);

  const [
    maxColors,
    setMaxColors,
  ] =
    useState(16);

  const [
    cleanup,
    setCleanup,
  ] =
    useState<CleanupLevel>(
      "balanced",
    );

  const [
    removeBackground,
    setRemoveBackground,
  ] =
    useState(false);

  const [
    fabricCount,
    setFabricCount,
  ] =
    useState(14);

  const [
    fabricColor,
    setFabricColor,
  ] =
    useState("#ffffff");

  const [
    generatedPattern,
    setGeneratedPattern,
  ] =
    useState<Pattern | null>(
      null,
    );

  const [
    view,
    setView,
  ] =
    useState<
      "original" |
      "result"
    >("result");

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    return () => {
      if (
        loadedImage
      ) {
        releaseLoadedImage(
          loadedImage,
        );
      }
    };
  }, [loadedImage]);

  /*
   * Dibujamos la imagen original después de que React haya
   * actualizado el DOM y el canvas esté disponible.
   */
  useEffect(() => {
    if (
      !loadedImage
    ) {
      return;
    }

    const canvas =
      originalCanvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width =
      loadedImage.width;

    canvas.height =
      loadedImage.height;

    const context =
      canvas.getContext(
        "2d",
      );

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.drawImage(
      loadedImage.bitmap,
      0,
      0,
    );
  }, [loadedImage]);

  /*
   * La previsualización del patrón también se dibuja después
   * de que generatedPattern haya quedado aplicado al estado.
   * Así evitamos que un render de React deje el canvas vacío.
   */
  useEffect(() => {
    if (
      !generatedPattern
    ) {
      return;
    }

    const canvas =
      resultCanvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width =
      generatedPattern.width;

    canvas.height =
      generatedPattern.height;

    const context =
      canvas.getContext(
        "2d",
      );

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.fillStyle =
      generatedPattern.fabric.color;

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const colorMap =
      new Map(
        generatedPattern.palette.map(
          (thread) => [
            thread.id,
            thread.rgb,
          ],
        ),
      );

    for (
      const stitch
      of generatedPattern.stitches
    ) {
      const color =
        colorMap.get(
          stitch.colorId,
        );

      if (!color) {
        continue;
      }

      context.fillStyle =
        color;

      context.fillRect(
        stitch.x,
        stitch.y,
        1,
        1,
      );
    }
  }, [generatedPattern]);

  function generatePreview(
    image: LoadedImage,
    nextWidth = width,
    nextHeight = height,
    nextMaxColors =
      maxColors,
    nextCleanup =
      cleanup,
    nextRemoveBackground =
      removeBackground,
    nextFabricCount =
      fabricCount,
    nextFabricColor =
      fabricColor,
  ) {
    setError(null);

    try {
      const result =
        convertImageToPattern(
          image,
          patternName,
          {
            width:
              nextWidth,

            height:
              nextHeight,

            maxColors:
              nextMaxColors,

            cleanup:
              nextCleanup,

            removeBackground:
              nextRemoveBackground,

            fabricType:
              "aida",

            fabricCount:
              nextFabricCount,

            fabricColor:
              nextFabricColor,
          },
        );

      setGeneratedPattern(
        result.pattern,
      );
    } catch (
      caughtError
    ) {
      setGeneratedPattern(
        null,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The preview could not be generated.",
      );
    }
  }

  async function handleFile(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    try {
      if (
        loadedImage
      ) {
        releaseLoadedImage(
          loadedImage,
        );
      }

      const image =
        await loadImageFile(
          file,
        );

      setLoadedImage(
        image,
      );

      const fileName =
        file.name.replace(
          /\.[^.]+$/,
          "",
        );

      setPatternName(
        fileName ||
          "Pattern from image",
      );

      const dimensions =
        calculateProportionalDimensions(
          image.width,
          image.height,
          120,
        );

      setWidth(
        dimensions.width,
      );

      setHeight(
        dimensions.height,
      );

      generatePreview(
        image,
        dimensions.width,
        dimensions.height,
      );

      setView(
        "result",
      );
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The image could not be loaded.",
      );
    }

    event.target.value =
      "";
  }

  function selectDetail(
    longSide: number,
  ) {
    if (
      !loadedImage
    ) {
      return;
    }

    const dimensions =
      calculateProportionalDimensions(
        loadedImage.width,
        loadedImage.height,
        longSide,
      );

    setWidth(
      dimensions.width,
    );

    setHeight(
      dimensions.height,
    );

    generatePreview(
      loadedImage,
      dimensions.width,
      dimensions.height,
    );
  }

  function changeWidth(
    nextWidth: number,
  ) {
    if (
      !loadedImage ||
      !Number.isInteger(
        nextWidth,
      )
    ) {
      setWidth(
        nextWidth,
      );

      return;
    }

    let nextHeight =
      height;

    if (
      keepRatio
    ) {
      nextHeight =
        Math.round(
          nextWidth *
            (
              loadedImage.height /
              loadedImage.width
            ),
        );

      nextHeight =
        Math.max(
          10,
          Math.min(
            300,
            nextHeight,
          ),
        );

      setHeight(
        nextHeight,
      );
    }

    setWidth(
      nextWidth,
    );

    if (
      nextWidth >= 10 &&
      nextWidth <= 300 &&
      nextHeight >= 10 &&
      nextHeight <= 300
    ) {
      generatePreview(
        loadedImage,
        nextWidth,
        nextHeight,
      );
    }
  }

  function changeHeight(
    nextHeight: number,
  ) {
    if (
      !loadedImage ||
      !Number.isInteger(
        nextHeight,
      )
    ) {
      setHeight(
        nextHeight,
      );

      return;
    }

    let nextWidth =
      width;

    if (
      keepRatio
    ) {
      nextWidth =
        Math.round(
          nextHeight *
            (
              loadedImage.width /
              loadedImage.height
            ),
        );

      nextWidth =
        Math.max(
          10,
          Math.min(
            300,
            nextWidth,
          ),
        );

      setWidth(
        nextWidth,
      );
    }

    setHeight(
      nextHeight,
    );

    if (
      nextWidth >= 10 &&
      nextWidth <= 300 &&
      nextHeight >= 10 &&
      nextHeight <= 300
    ) {
      generatePreview(
        loadedImage,
        nextWidth,
        nextHeight,
      );
    }
  }

  function selectColors(
    value: number,
  ) {
    setMaxColors(
      value,
    );

    if (
      loadedImage
    ) {
      generatePreview(
        loadedImage,
        width,
        height,
        value,
      );
    }
  }

  function changeCustomColors(
    value: number,
  ) {
    setMaxColors(
      value,
    );

    if (
      !loadedImage ||
      !Number.isInteger(
        value,
      ) ||
      value < 4 ||
      value > 32
    ) {
      return;
    }

    generatePreview(
      loadedImage,
      width,
      height,
      value,
    );
  }

  function selectCleanup(
    value: CleanupLevel,
  ) {
    setCleanup(
      value,
    );

    if (
      loadedImage
    ) {
      generatePreview(
        loadedImage,
        width,
        height,
        maxColors,
        value,
      );
    }
  }

  function toggleBackground(
    value: boolean,
  ) {
    setRemoveBackground(
      value,
    );

    if (
      loadedImage
    ) {
      generatePreview(
        loadedImage,
        width,
        height,
        maxColors,
        cleanup,
        value,
      );
    }
  }

  function changeFabricCount(
    value: number,
  ) {
    setFabricCount(
      value,
    );

    if (
      loadedImage &&
      value > 0
    ) {
      generatePreview(
        loadedImage,
        width,
        height,
        maxColors,
        cleanup,
        removeBackground,
        value,
        fabricColor,
      );
    }
  }

  function changeFabricColor(
    value: string,
  ) {
    setFabricColor(
      value,
    );

    if (
      loadedImage
    ) {
      generatePreview(
        loadedImage,
        width,
        height,
        maxColors,
        cleanup,
        removeBackground,
        fabricCount,
        value,
      );
    }
  }

  function handleCreate() {
    if (
      !generatedPattern
    ) {
      return;
    }

    onCreate({
      ...generatedPattern,

      name:
        patternName.trim() ||
        generatedPattern.name,
    });
  }

  if (!open) {
    return null;
  }

  const physicalWidth =
    fabricCount > 0
      ? (
          width /
          fabricCount *
          2.54
        ).toFixed(1)
      : "—";

  const physicalHeight =
    fabricCount > 0
      ? (
          height /
          fabricCount *
          2.54
        ).toFixed(1)
      : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              Image → Pattern
            </h2>

            <p className="text-sm text-slate-500">
              Adjust the result before creating the pattern.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            Close
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-slate-200 p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={
                  handleFile
                }
                className="w-full rounded border border-slate-300 p-2 text-sm"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-1 block text-sm font-medium">
                Name
              </span>

              <input
                type="text"
                value={
                  patternName
                }
                onChange={(
                  event,
                ) =>
                  setPatternName(
                    event.target.value,
                  )
                }
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="mt-6">
              <div className="text-sm font-medium">
                Detail
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {DETAIL_OPTIONS.map(
                  (option) => (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      disabled={
                        !loadedImage
                      }
                      onClick={() =>
                        selectDetail(
                          option.value,
                        )
                      }
                      className="rounded border border-slate-300 px-2 py-2 text-sm disabled:opacity-40"
                    >
                      {
                        option.label
                      }
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1 block text-xs text-slate-500">
                  Width
                </span>

                <input
                  type="number"
                  min={10}
                  max={300}
                  value={
                    width
                  }
                  onChange={(
                    event,
                  ) =>
                    changeWidth(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs text-slate-500">
                  Height
                </span>

                <input
                  type="number"
                  min={10}
                  max={300}
                  value={
                    height
                  }
                  onChange={(
                    event,
                  ) =>
                    changeHeight(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  keepRatio
                }
                onChange={(
                  event,
                ) =>
                  setKeepRatio(
                    event.target.checked,
                  )
                }
              />

              Keep aspect ratio
            </label>

            <div className="mt-6">
              <div className="text-sm font-medium">
                Maximum number of colors
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map(
                  (value) => (
                    <button
                      key={
                        value
                      }
                      type="button"
                      disabled={
                        !loadedImage
                      }
                      onClick={() =>
                        selectColors(
                          value,
                        )
                      }
                      className={`rounded border px-2 py-2 text-xs disabled:opacity-40 ${
                        maxColors ===
                        value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {value} colors
                    </button>
                  ),
                )}
              </div>

              <label className="mt-3 block">
                <span className="mb-1 block text-xs text-slate-500">
                  Custom (4–32)
                </span>

                <input
                  type="number"
                  min={4}
                  max={32}
                  step={1}
                  value={
                    maxColors
                  }
                  onChange={(
                    event,
                  ) =>
                    changeCustomColors(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium">
                Pattern cleanup
              </div>

              <select
                value={
                  cleanup
                }
                onChange={(
                  event,
                ) =>
                  selectCleanup(
                    event.target.value as CleanupLevel,
                  )
                }
                className="mt-2 w-full rounded border border-slate-300 px-3 py-2"
              >
                {CLEANUP_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <label className="mt-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  removeBackground
                }
                onChange={(
                  event,
                ) =>
                  toggleBackground(
                    event.target.checked,
                  )
                }
              />

              Remove simple background
            </label>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1 block text-xs text-slate-500">
                  Aida count
                </span>

                <input
                  type="number"
                  min={1}
                  value={
                    fabricCount
                  }
                  onChange={(
                    event,
                  ) =>
                    changeFabricCount(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs text-slate-500">
                  Fabric
                </span>

                <input
                  type="color"
                  value={
                    fabricColor
                  }
                  onChange={(
                    event,
                  ) =>
                    changeFabricColor(
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded border border-slate-300"
                />
              </label>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col bg-slate-100">
            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setView(
                      "original",
                    )
                  }
                  className={`rounded px-3 py-2 text-sm ${
                    view ===
                    "original"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300"
                  }`}
                >
                  Original
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setView(
                      "result",
                    )
                  }
                  className={`rounded px-3 py-2 text-sm ${
                    view ===
                    "result"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300"
                  }`}
                >
                  Resultado
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
              {!loadedImage && (
                <div className="text-sm text-slate-500">
                  Select a JPG or PNG image.
                </div>
              )}

              <canvas
                ref={
                  originalCanvasRef
                }
                className={`max-h-full max-w-full object-contain ${
                  view ===
                    "original" &&
                  loadedImage
                    ? "block"
                    : "hidden"
                }`}
              />

              <canvas
                ref={
                  resultCanvasRef
                }
                className={`max-h-full max-w-full [image-rendering:pixelated] ${
                  view ===
                    "result" &&
                  loadedImage
                    ? "block"
                    : "hidden"
                }`}
              />
            </div>

            {error && (
              <div className="mx-5 mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  {generatedPattern ? (
                    <>
                      <strong>
                        {
                          generatedPattern.width
                        }{" "}
                        ×{" "}
                        {
                          generatedPattern.height
                        }
                      </strong>{" "}
                      stitches ·{" "}
                      {
                        generatedPattern
                          .stitches
                          .length
                      }{" "}
                      actual stitches ·{" "}
                      {
                        generatedPattern
                          .palette
                          .length
                      }{" "}
                      colors ·{" "}
                      {
                        physicalWidth
                      }{" "}
                      ×{" "}
                      {
                        physicalHeight
                      }{" "}
                      cm
                    </>
                  ) : (
                    "No preview"
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={
                      onCancel
                    }
                    className="rounded border border-slate-300 px-4 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      !generatedPattern
                    }
                    onClick={
                      handleCreate
                    }
                    className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Create pattern
                  </button>
                </div>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
