import {
  CONVERTER_LIMITS,
  type LoadedImage,
  type ResizedImage,
} from "@/lib/converter/converterTypes";

type PatternDimensions = {
  width: number;
  height: number;
};

function validatePatternDimensions(
  width: number,
  height: number,
): void {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height)
  ) {
    throw new Error(
      "Las dimensiones del patrón deben ser números enteros.",
    );
  }

  if (
    width <
      CONVERTER_LIMITS.minPatternWidth ||
    height <
      CONVERTER_LIMITS.minPatternHeight
  ) {
    throw new Error(
      "El patrón debe tener como mínimo 10 × 10 puntadas.",
    );
  }

  if (
    width >
      CONVERTER_LIMITS.maxPatternWidth ||
    height >
      CONVERTER_LIMITS.maxPatternHeight
  ) {
    throw new Error(
      "El patrón puede tener como máximo 300 × 300 puntadas en esta versión.",
    );
  }
}

export function calculateProportionalDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetLongSide = 120,
): PatternDimensions {
  if (
    sourceWidth <= 0 ||
    sourceHeight <= 0
  ) {
    throw new Error(
      "Las dimensiones de la imagen de origen no son válidas.",
    );
  }

  if (
    !Number.isInteger(
      targetLongSide,
    ) ||
    targetLongSide <= 0
  ) {
    throw new Error(
      "El tamaño objetivo debe ser un número entero positivo.",
    );
  }

  let width: number;
  let height: number;

  if (
    sourceWidth >=
    sourceHeight
  ) {
    width =
      targetLongSide;

    height = Math.max(
      1,
      Math.round(
        targetLongSide *
          (
            sourceHeight /
            sourceWidth
          ),
      ),
    );
  } else {
    height =
      targetLongSide;

    width = Math.max(
      1,
      Math.round(
        targetLongSide *
          (
            sourceWidth /
            sourceHeight
          ),
      ),
    );
  }

  return {
    width,
    height,
  };
}

export function resizeImageForPattern(
  image: LoadedImage,
  targetWidth: number,
  targetHeight: number,
): ResizedImage {
  validatePatternDimensions(
    targetWidth,
    targetHeight,
  );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    targetWidth;

  canvas.height =
    targetHeight;

  const context =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      },
    );

  if (!context) {
    throw new Error(
      "El navegador no ha podido crear el área de procesamiento de imagen.",
    );
  }

  context.clearRect(
    0,
    0,
    targetWidth,
    targetHeight,
  );

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  context.drawImage(
    image.bitmap,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  const imageData =
    context.getImageData(
      0,
      0,
      targetWidth,
      targetHeight,
    );

  return {
    imageData,
    width: targetWidth,
    height: targetHeight,
  };
}