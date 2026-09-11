import type {
  RgbColor,
} from "@/lib/converter/medianCut";

export type ColorMatchingResult = {
  colorIndexes: Int16Array;
  usageCounts: number[];
};

function colorDistanceSquared(
  first: RgbColor,
  second: RgbColor,
): number {
  const redDifference =
    first.r -
    second.r;

  const greenDifference =
    first.g -
    second.g;

  const blueDifference =
    first.b -
    second.b;

  /*
   * Distancia RGB ponderada.
   * Da más importancia perceptual al verde
   * que a rojo y azul.
   */
  return (
    3 *
      redDifference *
      redDifference +
    6 *
      greenDifference *
      greenDifference +
    2 *
      blueDifference *
      blueDifference
  );
}

function findClosestColorIndex(
  color: RgbColor,
  palette: RgbColor[],
): number {
  let bestIndex =
    0;

  let bestDistance =
    Number.POSITIVE_INFINITY;

  for (
    let index = 0;
    index <
    palette.length;
    index += 1
  ) {
    const distance =
      colorDistanceSquared(
        color,
        palette[index],
      );

    if (
      distance <
      bestDistance
    ) {
      bestDistance =
        distance;

      bestIndex =
        index;
    }
  }

  return bestIndex;
}

export function matchImageToPalette(
  imageData: ImageData,
  palette: RgbColor[],
  backgroundMask?: Uint8Array,
): ColorMatchingResult {
  const {
    data,
    width,
    height,
  } = imageData;

  const pixelCount =
    width *
    height;

  if (
    palette.length === 0
  ) {
    throw new Error(
      "No existe una paleta de colores para realizar la conversión.",
    );
  }

  if (
    backgroundMask &&
    backgroundMask.length !==
      pixelCount
  ) {
    throw new Error(
      "La máscara de fondo no coincide con las dimensiones de la imagen.",
    );
  }

  const colorIndexes =
    new Int16Array(
      pixelCount,
    );

  colorIndexes.fill(
    -1,
  );

  const usageCounts =
    new Array<number>(
      palette.length,
    ).fill(0);

  for (
    let pixelIndex = 0;
    pixelIndex <
    pixelCount;
    pixelIndex += 1
  ) {
    if (
      backgroundMask?.[
        pixelIndex
      ] === 1
    ) {
      continue;
    }

    const dataIndex =
      pixelIndex * 4;

    if (
      data[
        dataIndex + 3
      ] === 0
    ) {
      continue;
    }

    const color:
      RgbColor = {
        r:
          data[
            dataIndex
          ],

        g:
          data[
            dataIndex + 1
          ],

        b:
          data[
            dataIndex + 2
          ],
      };

    const paletteIndex =
      findClosestColorIndex(
        color,
        palette,
      );

    colorIndexes[
      pixelIndex
    ] = paletteIndex;

    usageCounts[
      paletteIndex
    ] += 1;
  }

  return {
    colorIndexes,
    usageCounts,
  };
}

export function rgbToHex(
  color: RgbColor,
): string {
  const toHex = (
    value: number,
  ) =>
    value
      .toString(16)
      .padStart(
        2,
        "0",
      )
      .toUpperCase();

  return (
    "#" +
    toHex(color.r) +
    toHex(color.g) +
    toHex(color.b)
  );
}