import type {
  Thread,
} from "@/types/pattern";

import {
  rgbToHex,
} from "@/lib/converter/colorMatching";

import type {
  RgbColor,
} from "@/lib/converter/medianCut";

export type PaletteBuildResult = {
  threads: Thread[];
  colors: RgbColor[];
  colorIndexes: Int16Array;
  usageCounts: number[];
};

const THREAD_SYMBOLS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

type PaletteEntry = {
  oldIndex: number;
  color: RgbColor;
  usageCount: number;
  hex: string;
};

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

function comparePaletteEntries(
  first: PaletteEntry,
  second: PaletteEntry,
): number {
  if (
    first.usageCount !==
    second.usageCount
  ) {
    return (
      second.usageCount -
      first.usageCount
    );
  }

  return first.hex.localeCompare(
    second.hex,
  );
}

function createThreadId(
  index: number,
): string {
  return `img-${String(
    index + 1,
  ).padStart(
    3,
    "0",
  )}`;
}

function createThreadName(
  index: number,
): string {
  return `Color ${String(
    index + 1,
  ).padStart(
    2,
    "0",
  )}`;
}

export function buildPatternPalette(
  sourcePalette: RgbColor[],
  sourceColorIndexes: Int16Array,
): PaletteBuildResult {
  if (
    sourcePalette.length >
    THREAD_SYMBOLS.length
  ) {
    throw new Error(
      `La paleta contiene más de ${THREAD_SYMBOLS.length} colores y no hay suficientes símbolos disponibles.`,
    );
  }

  const sourceUsageCounts =
    calculateUsageCounts(
      sourceColorIndexes,
      sourcePalette.length,
    );

  const entries:
    PaletteEntry[] =
    sourcePalette
      .map(
        (
          color,
          oldIndex,
        ) => ({
          oldIndex,
          color,
          usageCount:
            sourceUsageCounts[
              oldIndex
            ],
          hex:
            rgbToHex(
              color,
            ),
        }),
      )
      .filter(
        (entry) =>
          entry.usageCount >
          0,
      )
      .sort(
        comparePaletteEntries,
      );

  if (
    entries.length === 0
  ) {
    throw new Error(
      "El patrón generado no contiene ningún color utilizado.",
    );
  }

  const oldToNewIndex =
    new Int16Array(
      sourcePalette.length,
    );

  oldToNewIndex.fill(
    -1,
  );

  entries.forEach(
    (
      entry,
      newIndex,
    ) => {
      oldToNewIndex[
        entry.oldIndex
      ] = newIndex;
    },
  );

  const remappedColorIndexes =
    new Int16Array(
      sourceColorIndexes.length,
    );

  remappedColorIndexes.fill(
    -1,
  );

  for (
    let pixelIndex = 0;
    pixelIndex <
    sourceColorIndexes.length;
    pixelIndex += 1
  ) {
    const oldIndex =
      sourceColorIndexes[
        pixelIndex
      ];

    if (
      oldIndex < 0
    ) {
      continue;
    }

    const newIndex =
      oldToNewIndex[
        oldIndex
      ];

    if (
      newIndex < 0
    ) {
      throw new Error(
        "Se ha encontrado una celda asociada a un color no utilizado.",
      );
    }

    remappedColorIndexes[
      pixelIndex
    ] = newIndex;
  }

  const threads:
    Thread[] =
    entries.map(
      (
        entry,
        index,
      ) => ({
        id:
          createThreadId(
            index,
          ),

        name:
          createThreadName(
            index,
          ),

        rgb:
          entry.hex,

        symbol:
          THREAD_SYMBOLS[
            index
          ],

        brand:
          "internal",
      }),
    );

  return {
    threads,

    colors:
      entries.map(
        (entry) =>
          entry.color,
      ),

    colorIndexes:
      remappedColorIndexes,

    usageCounts:
      entries.map(
        (entry) =>
          entry.usageCount,
      ),
  };
}