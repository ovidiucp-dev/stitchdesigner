import {
  createTransparentBackgroundMask,
  removeSimpleBackground,
} from "@/lib/converter/backgroundRemoval";

import {
  matchImageToPalette,
} from "@/lib/converter/colorMatching";

import type {
  ConversionOptions,
  ConversionStatistics,
  LoadedImage,
} from "@/lib/converter/converterTypes";

import {
  resizeImageForPattern,
} from "@/lib/converter/imageResize";

import {
  quantizeMedianCut,
} from "@/lib/converter/medianCut";

import {
  buildPatternPalette,
} from "@/lib/converter/paletteBuilder";

import {
  cleanupPatternColors,
} from "@/lib/converter/patternCleanup";

import {
  buildPattern,
} from "@/lib/converter/patternBuilder";

import type {
  Pattern,
} from "@/types/pattern";

export type ImageToPatternResult = {
  pattern: Pattern;
  statistics: ConversionStatistics;
};

export function convertImageToPattern(
  image: LoadedImage,
  name: string,
  options: ConversionOptions,
): ImageToPatternResult {
  const resized =
    resizeImageForPattern(
      image,
      options.width,
      options.height,
    );

  let processedImageData =
    resized.imageData;

  let backgroundMask:
    Uint8Array;

  if (
    options.removeBackground
  ) {
    const background =
      removeSimpleBackground(
        resized,
      );

    processedImageData =
      background.imageData;

    backgroundMask =
      background.backgroundMask;
  } else {
    /*
     * Aunque la eliminación de fondo esté desactivada,
     * respetamos la transparencia que ya exista en un PNG.
     */
    backgroundMask =
      createTransparentBackgroundMask(
        resized.imageData,
      );
  }

  const quantizedPalette =
    quantizeMedianCut(
      processedImageData,
      options.maxColors,
      backgroundMask,
    );

  if (
    quantizedPalette.length ===
    0
  ) {
    throw new Error(
      "No quedan colores válidos para generar el patrón.",
    );
  }

  const matching =
    matchImageToPalette(
      processedImageData,
      quantizedPalette,
      backgroundMask,
    );

  const cleaned =
    cleanupPatternColors(
      matching.colorIndexes,
      options.width,
      options.height,
      quantizedPalette,
      options.cleanup,
    );

  const finalPalette =
    buildPatternPalette(
      quantizedPalette,
      cleaned.colorIndexes,
    );

  const pattern =
    buildPattern({
      name,

      width:
        options.width,

      height:
        options.height,

      fabric: {
        type:
          options.fabricType,

        count:
          options.fabricCount,

        color:
          options.fabricColor,
      },

      palette:
        finalPalette.threads,

      colorIndexes:
        finalPalette.colorIndexes,
    });

  const statistics:
    ConversionStatistics =
    {
      width:
        pattern.width,

      height:
        pattern.height,

      stitchCount:
        pattern.stitches.length,

      colorCount:
        pattern.palette.length,
    };

  return {
    pattern,
    statistics,
  };
}