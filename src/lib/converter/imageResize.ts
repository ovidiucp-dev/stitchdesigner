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
      "Pattern dimensions must be whole numbers.",
    );
  }

  if (
    width <
      CONVERTER_LIMITS.minPatternWidth ||
    height <
      CONVERTER_LIMITS.minPatternHeight
  ) {
    throw new Error(
      "The pattern must be at least 10 × 10 stitches.",
    );
  }

  if (
    width >
      CONVERTER_LIMITS.maxPatternWidth ||
    height >
      CONVERTER_LIMITS.maxPatternHeight
  ) {
    throw new Error(
      "The pattern can be at most 300 × 300 stitches in this version.",
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
      "The source image dimensions are not valid.",
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
      "The browser could not create the image processing canvas.",
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