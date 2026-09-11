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
  calculateProportionalDimensions,
  resizeImageForPattern,
} from "@/lib/converter/imageResize";

import {
  loadImageFile,
  releaseLoadedImage,
} from "@/lib/converter/imageLoader";

import type {
  LoadedImage,
} from "@/lib/converter/converterTypes";

export default function BackgroundTestPage() {
  const originalCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const resultCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [
    loadedImage,
    setLoadedImage,
  ] =
    useState<LoadedImage | null>(null);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  const [
    info,
    setInfo,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (loadedImage) {
        releaseLoadedImage(
          loadedImage,
        );
      }
    };
  }, [loadedImage]);

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
    setInfo(null);

    if (loadedImage) {
      releaseLoadedImage(
        loadedImage,
      );
    }

    try {
      const image =
        await loadImageFile(
          file,
        );

      setLoadedImage(
        image,
      );

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

      const result =
        removeSimpleBackground(
          resized,
        );

      const originalCanvas =
        originalCanvasRef.current;

      const resultCanvas =
        resultCanvasRef.current;

      if (
        !originalCanvas ||
        !resultCanvas
      ) {
        return;
      }

      originalCanvas.width =
        dimensions.width;

      originalCanvas.height =
        dimensions.height;

      resultCanvas.width =
        dimensions.width;

      resultCanvas.height =
        dimensions.height;

      const originalContext =
        originalCanvas.getContext(
          "2d",
        );

      const resultContext =
        resultCanvas.getContext(
          "2d",
        );

      if (
        !originalContext ||
        !resultContext
      ) {
        throw new Error(
          "No se han podido crear los Canvas de prueba.",
        );
      }

      originalContext.putImageData(
        resized.imageData,
        0,
        0,
      );

      resultContext.clearRect(
        0,
        0,
        dimensions.width,
        dimensions.height,
      );

      resultContext.putImageData(
        result.imageData,
        0,
        0,
      );

      const totalPixels =
        dimensions.width *
        dimensions.height;

      const percentage =
        (
          result.backgroundPixelCount /
          totalPixels *
          100
        ).toFixed(1);

      setInfo(
        `${dimensions.width} × ${dimensions.height} · ` +
          `${result.backgroundPixelCount} celdas eliminadas · ` +
          `${percentage}% del área`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ha ocurrido un error inesperado.",
      );
    }

    event.target.value =
      "";
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">
          Prueba de eliminación de fondo
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Página temporal de validación del motor Imagen → Patrón.
        </p>

        <div className="mt-6">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFile}
            className="rounded border border-slate-300 bg-white p-2"
          />
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {info && (
          <div className="mt-4 rounded border border-slate-300 bg-white p-3 text-sm">
            {info}
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-8">
          <section>
            <h2 className="mb-3 font-semibold">
              Imagen reducida original
            </h2>

            <div className="overflow-auto rounded border border-slate-300 bg-white p-4">
              <canvas
                ref={originalCanvasRef}
                className="w-full max-w-lg border border-slate-200 [image-rendering:pixelated]"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-semibold">
              Fondo eliminado
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
                ref={resultCanvasRef}
                className="w-full max-w-lg [image-rendering:pixelated]"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}