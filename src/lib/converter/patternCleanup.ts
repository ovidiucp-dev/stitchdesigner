import type {
  CleanupLevel,
} from "@/lib/converter/converterTypes";

import type {
  RgbColor,
} from "@/lib/converter/medianCut";

export type PatternCleanupResult = {
  colorIndexes: Int16Array;
  usageCounts: number[];
  changedCellCount: number;
};

type CleanupConfiguration = {
  maxRegionSize: number;
  minimumDominance: number;
  maximumColorDistance: number;
  passes: number;
};

type Region = {
  colorIndex: number;
  pixels: number[];
};

const CLEANUP_CONFIG: Record<
  Exclude<CleanupLevel, "none">,
  CleanupConfiguration
> = {
  soft: {
    maxRegionSize: 1,
    minimumDominance: 0.8,
    maximumColorDistance: 12_000,
    passes: 1,
  },

  balanced: {
    maxRegionSize: 2,
    minimumDominance: 0.65,
    maximumColorDistance: 22_000,
    passes: 2,
  },

  high: {
    maxRegionSize: 4,
    minimumDominance: 0.55,
    maximumColorDistance: 36_000,
    passes: 3,
  },
};

function colorDistanceSquared(
  first: RgbColor,
  second: RgbColor,
): number {
  const redDifference =
    first.r - second.r;

  const greenDifference =
    first.g - second.g;

  const blueDifference =
    first.b - second.b;

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

function findRegions(
  colorIndexes: Int16Array,
  width: number,
  height: number,
): Region[] {
  const visited =
    new Uint8Array(
      colorIndexes.length,
    );

  const queue =
    new Int32Array(
      colorIndexes.length,
    );

  const regions: Region[] =
    [];

  for (
    let startIndex = 0;
    startIndex <
    colorIndexes.length;
    startIndex += 1
  ) {
    if (
      visited[startIndex] === 1 ||
      colorIndexes[startIndex] < 0
    ) {
      continue;
    }

    const colorIndex =
      colorIndexes[
        startIndex
      ];

    const pixels: number[] =
      [];

    let queueStart = 0;
    let queueEnd = 0;

    queue[
      queueEnd
    ] = startIndex;

    queueEnd += 1;

    visited[
      startIndex
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
          visited[
            neighborIndex
          ] === 1
        ) {
          continue;
        }

        if (
          colorIndexes[
            neighborIndex
          ] !== colorIndex
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
      colorIndex,
      pixels,
    });
  }

  return regions;
}

function getNeighborCounts(
  region: Region,
  colorIndexes: Int16Array,
  width: number,
  height: number,
): Map<number, number> {
  const regionPixels =
    new Set(
      region.pixels,
    );

  const counts =
    new Map<
      number,
      number
    >();

  for (
    const pixelIndex
    of region.pixels
  ) {
    const x =
      pixelIndex %
      width;

    const y =
      Math.floor(
        pixelIndex /
          width,
      );

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
        regionPixels.has(
          neighborIndex,
        )
      ) {
        continue;
      }

      const neighborColor =
        colorIndexes[
          neighborIndex
        ];

      if (
        neighborColor < 0 ||
        neighborColor ===
          region.colorIndex
      ) {
        continue;
      }

      counts.set(
        neighborColor,
        (
          counts.get(
            neighborColor,
          ) ?? 0
        ) + 1,
      );
    }
  }

  return counts;
}

function chooseDominantNeighbor(
  counts: Map<
    number,
    number
  >,
): {
  colorIndex: number;
  dominance: number;
} | null {
  let total = 0;

  let dominantColor =
    -1;

  let dominantCount =
    0;

  for (
    const [
      colorIndex,
      count,
    ] of counts
  ) {
    total += count;

    if (
      count >
        dominantCount ||
      (
        count ===
          dominantCount &&
        (
          dominantColor ===
            -1 ||
          colorIndex <
            dominantColor
        )
      )
    ) {
      dominantColor =
        colorIndex;

      dominantCount =
        count;
    }
  }

  if (
    total === 0 ||
    dominantColor < 0
  ) {
    return null;
  }

  return {
    colorIndex:
      dominantColor,

    dominance:
      dominantCount /
      total,
  };
}

function calculateUsageCounts(
  colorIndexes: Int16Array,
  paletteSize: number,
): number[] {
  const counts =
    new Array<number>(
      paletteSize,
    ).fill(0);

  for (
    const colorIndex
    of colorIndexes
  ) {
    if (
      colorIndex >= 0 &&
      colorIndex <
        paletteSize
    ) {
      counts[
        colorIndex
      ] += 1;
    }
  }

  return counts;
}

function performCleanupPass(
  source: Int16Array,
  width: number,
  height: number,
  palette: RgbColor[],
  configuration:
    CleanupConfiguration,
): {
  result: Int16Array;
  changedCellCount: number;
} {
  const result =
    new Int16Array(
      source,
    );

  const regions =
    findRegions(
      source,
      width,
      height,
    );

  let changedCellCount =
    0;

  for (
    const region
    of regions
  ) {
    if (
      region.pixels.length >
        configuration.maxRegionSize
    ) {
      continue;
    }

    const neighborCounts =
      getNeighborCounts(
        region,
        source,
        width,
        height,
      );

    const dominant =
      chooseDominantNeighbor(
        neighborCounts,
      );

    if (
      !dominant ||
      dominant.dominance <
        configuration.minimumDominance
    ) {
      continue;
    }

    const sourceColor =
      palette[
        region.colorIndex
      ];

    const replacementColor =
      palette[
        dominant.colorIndex
      ];

    if (
      !sourceColor ||
      !replacementColor
    ) {
      continue;
    }

    const distance =
      colorDistanceSquared(
        sourceColor,
        replacementColor,
      );

    if (
      distance >
      configuration.maximumColorDistance
    ) {
      /*
       * El contraste es demasiado fuerte.
       * Probablemente es un detalle real,
       * por lo que se conserva.
       */
      continue;
    }

    for (
      const pixelIndex
      of region.pixels
    ) {
      result[
        pixelIndex
      ] =
        dominant.colorIndex;

      changedCellCount +=
        1;
    }
  }

  return {
    result,
    changedCellCount,
  };
}

export function cleanupPatternColors(
  colorIndexes: Int16Array,
  width: number,
  height: number,
  palette: RgbColor[],
  level: CleanupLevel,
): PatternCleanupResult {
  if (
    colorIndexes.length !==
    width * height
  ) {
    throw new Error(
      "The color matrix does not match the pattern dimensions.",
    );
  }

  if (
    level === "none"
  ) {
    return {
      colorIndexes:
        new Int16Array(
          colorIndexes,
        ),

      usageCounts:
        calculateUsageCounts(
          colorIndexes,
          palette.length,
        ),

      changedCellCount:
        0,
    };
  }

  const configuration =
    CLEANUP_CONFIG[
      level
    ];

 let current: Int16Array =
  new Int16Array(
    colorIndexes,
  );

  let totalChanged =
    0;

  for (
    let pass = 0;
    pass <
    configuration.passes;
    pass += 1
  ) {
    const cleanup =
      performCleanupPass(
        current,
        width,
        height,
        palette,
        configuration,
      );

    current =
      cleanup.result;

    totalChanged +=
      cleanup.changedCellCount;

    if (
      cleanup.changedCellCount ===
      0
    ) {
      break;
    }
  }

  return {
    colorIndexes:
      current,

    usageCounts:
      calculateUsageCounts(
        current,
        palette.length,
      ),

    changedCellCount:
      totalChanged,
  };
}