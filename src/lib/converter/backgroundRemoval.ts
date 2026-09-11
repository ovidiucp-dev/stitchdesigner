import type {
  ResizedImage,
} from "@/lib/converter/converterTypes";

export type BackgroundRemovalOptions = {
  tolerance: number;

  /**
   * Tamaño mínimo de una región interior para considerarla fondo.
   * Si no se indica, se calcula automáticamente según el tamaño
   * de la imagen procesada.
   */
  minInteriorRegionSize?: number;
};

export type BackgroundRemovalResult = {
  imageData: ImageData;
  backgroundMask: Uint8Array;
  backgroundPixelCount: number;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type Region = {
  pixels: number[];
  touchesEdge: boolean;
};

const DEFAULT_BACKGROUND_TOLERANCE =
  36;

function getPixelColor(
  data: Uint8ClampedArray,
  dataIndex: number,
): Rgb {
  return {
    r: data[dataIndex],
    g: data[dataIndex + 1],
    b: data[dataIndex + 2],
  };
}

function colorDistance(
  a: Rgb,
  b: Rgb,
): number {
  const dr =
    a.r - b.r;

  const dg =
    a.g - b.g;

  const db =
    a.b - b.b;

  return Math.sqrt(
    dr * dr +
      dg * dg +
      db * db,
  );
}

function isSimilarColor(
  a: Rgb,
  b: Rgb,
  tolerance: number,
): boolean {
  return (
    colorDistance(
      a,
      b,
    ) <= tolerance
  );
}

function median(
  values: number[],
): number {
  if (
    values.length === 0
  ) {
    return 255;
  }

  const sorted =
    [...values].sort(
      (a, b) => a - b,
    );

  const middle =
    Math.floor(
      sorted.length / 2,
    );

  if (
    sorted.length % 2 === 0
  ) {
    return Math.round(
      (
        sorted[middle - 1] +
        sorted[middle]
      ) / 2,
    );
  }

  return sorted[middle];
}

function getEdgeBackgroundColor(
  imageData: ImageData,
): Rgb {
  const {
    data,
    width,
    height,
  } = imageData;

  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];

  function addPixel(
    x: number,
    y: number,
  ) {
    const dataIndex =
      (
        y * width +
        x
      ) * 4;

    const alpha =
      data[
        dataIndex + 3
      ];

    if (
      alpha === 0
    ) {
      return;
    }

    reds.push(
      data[dataIndex],
    );

    greens.push(
      data[dataIndex + 1],
    );

    blues.push(
      data[dataIndex + 2],
    );
  }

  for (
    let x = 0;
    x < width;
    x += 1
  ) {
    addPixel(
      x,
      0,
    );

    if (
      height > 1
    ) {
      addPixel(
        x,
        height - 1,
      );
    }
  }

  for (
    let y = 1;
    y < height - 1;
    y += 1
  ) {
    addPixel(
      0,
      y,
    );

    if (
      width > 1
    ) {
      addPixel(
        width - 1,
        y,
      );
    }
  }

  return {
    r: median(reds),
    g: median(greens),
    b: median(blues),
  };
}

function calculateAutomaticInteriorRegionSize(
  width: number,
  height: number,
): number {
  const totalPixels =
    width * height;

  /*
   * Eliminamos regiones interiores suficientemente grandes
   * para ser probablemente fondo.
   *
   * El mínimo evita borrar pequeños huecos claros
   * dentro de flores, letras o detalles.
   */
  return Math.max(
    12,
    Math.round(
      totalPixels * 0.002,
    ),
  );
}

export function createTransparentBackgroundMask(
  imageData: ImageData,
): Uint8Array {
  const {
    data,
    width,
    height,
  } = imageData;

  const mask =
    new Uint8Array(
      width * height,
    );

  for (
    let pixelIndex = 0;
    pixelIndex <
    width * height;
    pixelIndex += 1
  ) {
    const dataIndex =
      pixelIndex * 4;

    if (
      data[
        dataIndex + 3
      ] === 0
    ) {
      mask[
        pixelIndex
      ] = 1;
    }
  }

  return mask;
}

function createBackgroundCandidateMask(
  imageData: ImageData,
  backgroundColor: Rgb,
  tolerance: number,
): Uint8Array {
  const {
    data,
    width,
    height,
  } = imageData;

  const candidateMask =
    new Uint8Array(
      width * height,
    );

  for (
    let pixelIndex = 0;
    pixelIndex <
    width * height;
    pixelIndex += 1
  ) {
    const dataIndex =
      pixelIndex * 4;

    const alpha =
      data[
        dataIndex + 3
      ];

    if (
      alpha === 0
    ) {
      candidateMask[
        pixelIndex
      ] = 1;

      continue;
    }

    const color =
      getPixelColor(
        data,
        dataIndex,
      );

    if (
      isSimilarColor(
        color,
        backgroundColor,
        tolerance,
      )
    ) {
      candidateMask[
        pixelIndex
      ] = 1;
    }
  }

  return candidateMask;
}

function findCandidateRegions(
  candidateMask: Uint8Array,
  width: number,
  height: number,
): Region[] {
  const visited =
    new Uint8Array(
      width * height,
    );

  const regions: Region[] =
    [];

  const queue =
    new Int32Array(
      width * height,
    );

  for (
    let startPixel = 0;
    startPixel <
    candidateMask.length;
    startPixel += 1
  ) {
    if (
      candidateMask[
        startPixel
      ] !== 1 ||
      visited[
        startPixel
      ] === 1
    ) {
      continue;
    }

    const pixels: number[] =
      [];

    let touchesEdge =
      false;

    let queueStart = 0;
    let queueEnd = 0;

    queue[
      queueEnd
    ] = startPixel;

    queueEnd += 1;

    visited[
      startPixel
    ] = 1;

    while (
      queueStart <
      queueEnd
    ) {
      const pixelIndex =
        queue[
          queueStart
        ];

      queueStart += 1;

      pixels.push(
        pixelIndex,
      );

      const x =
        pixelIndex %
        width;

      const y =
        Math.floor(
          pixelIndex /
            width,
        );

      if (
        x === 0 ||
        y === 0 ||
        x === width - 1 ||
        y === height - 1
      ) {
        touchesEdge =
          true;
      }

      const neighbors = [
        {
          x: x - 1,
          y,
        },
        {
          x: x + 1,
          y,
        },
        {
          x,
          y: y - 1,
        },
        {
          x,
          y: y + 1,
        },
      ];

      for (
        const neighbor
        of neighbors
      ) {
        if (
          neighbor.x < 0 ||
          neighbor.y < 0 ||
          neighbor.x >=
            width ||
          neighbor.y >=
            height
        ) {
          continue;
        }

        const neighborIndex =
          neighbor.y *
            width +
          neighbor.x;

        if (
          candidateMask[
            neighborIndex
          ] !== 1 ||
          visited[
            neighborIndex
          ] === 1
        ) {
          continue;
        }

        visited[
          neighborIndex
        ] = 1;

        queue[
          queueEnd
        ] = neighborIndex;

        queueEnd += 1;
      }
    }

    regions.push({
      pixels,
      touchesEdge,
    });
  }

  return regions;
}

export function removeSimpleBackground(
  resizedImage: ResizedImage,
  options?: Partial<BackgroundRemovalOptions>,
): BackgroundRemovalResult {
  const tolerance =
    options?.tolerance ??
    DEFAULT_BACKGROUND_TOLERANCE;

  if (
    tolerance < 0 ||
    tolerance > 441
  ) {
    throw new Error(
      "La tolerancia de fondo debe estar entre 0 y 441.",
    );
  }

  const {
    imageData,
    width,
    height,
  } = resizedImage;

  const minimumInteriorRegionSize =
    options
      ?.minInteriorRegionSize ??
    calculateAutomaticInteriorRegionSize(
      width,
      height,
    );

  if (
    !Number.isInteger(
      minimumInteriorRegionSize,
    ) ||
    minimumInteriorRegionSize <
      1
  ) {
    throw new Error(
      "El tamaño mínimo de región interior debe ser un número entero positivo.",
    );
  }

  const backgroundColor =
    getEdgeBackgroundColor(
      imageData,
    );

  const candidateMask =
    createBackgroundCandidateMask(
      imageData,
      backgroundColor,
      tolerance,
    );

  const regions =
    findCandidateRegions(
      candidateMask,
      width,
      height,
    );

  const backgroundMask =
    createTransparentBackgroundMask(
      imageData,
    );

  for (
    const region
    of regions
  ) {
    const shouldRemove =
      region.touchesEdge ||
      region.pixels.length >=
        minimumInteriorRegionSize;

    if (
      !shouldRemove
    ) {
      continue;
    }

    for (
      const pixelIndex
      of region.pixels
    ) {
      backgroundMask[
        pixelIndex
      ] = 1;
    }
  }

  const outputData =
    new Uint8ClampedArray(
      imageData.data,
    );

  let backgroundPixelCount =
    0;

  for (
    let pixelIndex = 0;
    pixelIndex <
    backgroundMask.length;
    pixelIndex += 1
  ) {
    if (
      backgroundMask[
        pixelIndex
      ] !== 1
    ) {
      continue;
    }

    backgroundPixelCount +=
      1;

    const dataIndex =
      pixelIndex * 4;

    outputData[
      dataIndex + 3
    ] = 0;
  }

  return {
    imageData:
      new ImageData(
        outputData,
        width,
        height,
      ),

    backgroundMask,
    backgroundPixelCount,
  };
}