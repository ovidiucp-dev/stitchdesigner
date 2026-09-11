"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  removeSimpleBackground,
} from "@/lib/converter/backgroundRemoval";

import {
  matchImageToPalette,
  rgbToHex,
} from "@/lib/converter/colorMatching";

import type {
  CleanupLevel,
  LoadedImage,
} from "@/lib/converter/converterTypes";

import {
  convertImageToPattern,
} from "@/lib/converter/imageToPattern";

import {
  loadImageFile,
  releaseLoadedImage,
} from "@/lib/converter/imageLoader";

import {
  calculateProportionalDimensions,
  resizeImageForPattern,
} from "@/lib/converter/imageResize";

import {
  quantizeMedianCut,
  type RgbColor,
} from "@/lib/converter/medianCut";

import {
  cleanupPatternColors,
} from "@/lib/converter/patternCleanup";

import {
  isValidPattern,
} from "@/lib/patternValidation";

const TEST_COLOR_OPTIONS = [
  8,
  16,
  24,
] as const;

const CLEANUP_OPTIONS: {
  value: CleanupLevel;
  label: string;
}[] = [
  {
    value: "none",
    label: "Sin limpiar",
  },
  {
    value: "soft",
    label: "Suave",
  },
  {
    value: "balanced",
    label: "Equilibrada",
  },
  {
    value: "high",
    label: "Alta",
  },
];

export default function QuantizationTestPage() {
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
      "Patrón desde imagen",
    );

  const [
    maxColors,
    setMaxColors,
  ] =
    useState(16);

  const [
    cleanupLevel,
    setCleanupLevel,
  ] =
    useState<CleanupLevel>(
      "balanced",
    );

  const [
    removeBackground,
    setRemoveBackground,
  ] =
    useState(true);

  const [
    palette,
    setPalette,
  ] =
    useState<RgbColor[]>([]);

  const [
    usageCounts,
    setUsageCounts,
  ] =
    useState<number[]>([]);

  const [
    info,
    setInfo,
  ] =
    useState<string | null>(
      null,
    );

  const [
    validationInfo,
    setValidationInfo,
  ] =
    useState<string | null>(
      null,
    );

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

  function renderConvertedImage(
    image: LoadedImage,
    colors: number,
    shouldRemoveBackground: boolean,
    cleanup: CleanupLevel,
  ) {
    const dimensions =
      calculateProportionalDimensions(
        image.width,
        image.height,
        120,
      );

    const resized =
      resizeImageForPattern(
        image,
        dimensions.width,
        dimensions.height,
      );

    let imageData =
      resized.imageData;

    let backgroundMask:
      Uint8Array |
      undefined;

    if (
      shouldRemoveBackground
    ) {
      const background =
        removeSimpleBackground(
          resized,
        );

      imageData =
        background.imageData;

      backgroundMask =
        background.backgroundMask;
    }

    const generatedPalette =
      quantizeMedianCut(
        imageData,
        colors,
        backgroundMask,
      );

    if (
      generatedPalette.length ===
      0
    ) {
      throw new Error(
        "No quedan píxeles para convertir después del procesamiento.",
      );
    }

    const matching =
      matchImageToPalette(
        imageData,
        generatedPalette,
        backgroundMask,
      );

    const cleaned =
      cleanupPatternColors(
        matching.colorIndexes,
        dimensions.width,
        dimensions.height,
        generatedPalette,
        cleanup,
      );

    const output =
      new Uint8ClampedArray(
        dimensions.width *
          dimensions.height *
          4,
      );

    let stitchCount =
      0;

    for (
      let pixelIndex = 0;
      pixelIndex <
      cleaned.colorIndexes.length;
      pixelIndex += 1
    ) {
      const colorIndex =
        cleaned.colorIndexes[
          pixelIndex
        ];

      const dataIndex =
        pixelIndex * 4;

      if (
        colorIndex < 0
      ) {
        output[
          dataIndex + 3
        ] = 0;

        continue;
      }

      const color =
        generatedPalette[
          colorIndex
        ];

      output[
        dataIndex
      ] = color.r;

      output[
        dataIndex + 1
      ] = color.g;

      output[
        dataIndex + 2
      ] = color.b;

      output[
        dataIndex + 3
      ] = 255;

      stitchCount += 1;
    }

    const canvas =
      resultCanvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width =
      dimensions.width;

    canvas.height =
      dimensions.height;

    const context =
      canvas.getContext(
        "2d",
      );

    if (!context) {
      throw new Error(
        "No se ha podido crear el Canvas de prueba.",
      );
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.putImageData(
      new ImageData(
        output,
        dimensions.width,
        dimensions.height,
      ),
      0,
      0,
    );

    setPalette(
      generatedPalette,
    );

    setUsageCounts(
      cleaned.usageCounts,
    );

    setInfo(
      `${dimensions.width} × ${dimensions.height} · ` +
        `${stitchCount} puntadas · ` +
        `${generatedPalette.length} colores · ` +
        `${cleaned.changedCellCount} celdas limpiadas`,
    );

    setValidationInfo(
      null,
    );
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
    setValidationInfo(null);

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

      const nameWithoutExtension =
        file.name.replace(
          /\.[^.]+$/,
          "",
        );

      setPatternName(
        nameWithoutExtension ||
          "Patrón desde imagen",
      );

      renderConvertedImage(
        image,
        maxColors,
        removeBackground,
        cleanupLevel,
      );
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ha ocurrido un error inesperado.",
      );
    }

    event.target.value =
      "";
  }

  function renderAgain(
    options?: {
      colors?: number;
      removeBackground?: boolean;
      cleanup?: CleanupLevel;
    },
  ) {
    if (!loadedImage) {
      return;
    }

    try {
      renderConvertedImage(
        loadedImage,
        options?.colors ??
          maxColors,
        options?.removeBackground ??
          removeBackground,
        options?.cleanup ??
          cleanupLevel,
      );

      setError(null);
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ha ocurrido un error inesperado.",
      );
    }
  }

  function updateColors(
    value: number,
  ) {
    setMaxColors(
      value,
    );

    renderAgain({
      colors: value,
    });
  }

  function updateBackground(
    value: boolean,
  ) {
    setRemoveBackground(
      value,
    );

    renderAgain({
      removeBackground:
        value,
    });
  }

  function updateCleanup(
    value: CleanupLevel,
  ) {
    setCleanupLevel(
      value,
    );

    renderAgain({
      cleanup: value,
    });
  }

  function sanitizeFilename(
    value: string,
  ): string {
    const sanitized =
      value
        .trim()
        .replace(
          /[<>:"/\\|?*]+/g,
          "-",
        )
        .replace(
          /\s+/g,
          "-",
        );

    return (
      sanitized ||
      "pattern"
    );
  }

  function generateStitchFile() {
    if (!loadedImage) {
      setError(
        "Primero debes cargar una imagen.",
      );

      return;
    }

    setError(null);
    setValidationInfo(null);

    try {
      const dimensions =
        calculateProportionalDimensions(
          loadedImage.width,
          loadedImage.height,
          120,
        );

      const result =
        convertImageToPattern(
          loadedImage,
          patternName,
          {
            width:
              dimensions.width,

            height:
              dimensions.height,

            maxColors,

            cleanup:
              cleanupLevel,

            removeBackground,

            fabricType:
              "aida",

            fabricCount:
              14,

            fabricColor:
              "#ffffff",
          },
        );

      if (
        !isValidPattern(
          result.pattern,
        )
      ) {
        throw new Error(
          "El motor ha generado un Pattern que no supera la validación interna.",
        );
      }

      setValidationInfo(
        `Pattern válido · ` +
          `${result.statistics.width} × ${result.statistics.height} · ` +
          `${result.statistics.stitchCount} puntadas · ` +
          `${result.statistics.colorCount} colores`,
      );

      const json =
        JSON.stringify(
          result.pattern,
          null,
          2,
        );

      const blob =
        new Blob(
          [json],
          {
            type:
              "application/json",
          },
        );

      const url =
        URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href = url;

      link.download =
        `${sanitizeFilename(
          result.pattern.name,
        )}.stitch`;

      document.body.appendChild(
        link,
      );

      link.click();
      link.remove();

      URL.revokeObjectURL(
        url,
      );
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se ha podido generar el archivo .stitch.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">
          Prueba del motor Imagen → Patrón
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Conversión completa V1
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={
              handleFile
            }
            className="rounded border border-slate-300 bg-white p-2"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Colores:
            </span>

            {TEST_COLOR_OPTIONS.map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateColors(
                      value,
                    )
                  }
                  className={`rounded border px-3 py-2 text-sm ${
                    maxColors ===
                    value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {value}
                </button>
              ),
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={
                removeBackground
              }
              onChange={(
                event,
              ) =>
                updateBackground(
                  event.target
                    .checked,
                )
              }
            />

            Eliminar fondo simple
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            Limpieza:
          </span>

          {CLEANUP_OPTIONS.map(
            (option) => (
              <button
                key={
                  option.value
                }
                type="button"
                onClick={() =>
                  updateCleanup(
                    option.value,
                  )
                }
                className={`rounded border px-3 py-2 text-sm ${
                  cleanupLevel ===
                  option.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {
                  option.label
                }
              </button>
            ),
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Nombre del patrón
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
                  event.target
                    .value,
                )
              }
              className="w-72 rounded border border-slate-300 bg-white px-3 py-2"
            />
          </label>

          <button
            type="button"
            disabled={
              !loadedImage
            }
            onClick={
              generateStitchFile
            }
            className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generar .stitch
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">
            {error}
          </div>
        )}

        {validationInfo && (
          <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-green-800">
            {validationInfo}
          </div>
        )}

        {info && (
          <div className="mt-4 rounded border border-slate-300 bg-white p-3">
            {info}
          </div>
        )}

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_280px] gap-8">
          <section>
            <h2 className="mb-3 font-semibold">
              Resultado
            </h2>

            <div
              className="overflow-auto rounded border border-slate-300 p-4"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#ddd 25%,transparent 25%)," +
                  "linear-gradient(-45deg,#ddd 25%,transparent 25%)," +
                  "linear-gradient(45deg,transparent 75%,#ddd 75%)," +
                  "linear-gradient(-45deg,transparent 75%,#ddd 75%)",

                backgroundSize:
                  "20px 20px",

                backgroundPosition:
                  "0 0,0 10px,10px -10px,-10px 0px",
              }}
            >
              <canvas
                ref={
                  resultCanvasRef
                }
                className="w-full [image-rendering:pixelated]"
              />
            </div>
          </section>

          <aside>
            <h2 className="mb-3 font-semibold">
              Paleta
            </h2>

            <div className="space-y-2">
              {palette.map(
                (
                  color,
                  index,
                ) => (
                  <div
                    key={
                      `${color.r}-${color.g}-${color.b}-${index}`
                    }
                    className="flex items-center gap-3 rounded border border-slate-300 bg-white p-2"
                  >
                    <div
                      className="h-8 w-8 shrink-0 rounded border border-slate-300"
                      style={{
                        backgroundColor:
                          rgbToHex(
                            color,
                          ),
                      }}
                    />

                    <div className="min-w-0 text-sm">
                      <div className="font-medium">
                        {rgbToHex(
                          color,
                        )}
                      </div>

                      <div className="text-slate-500">
                        {usageCounts[
                          index
                        ] ?? 0}{" "}
                        celdas
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}