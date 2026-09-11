import type {
  Pattern,
  Stitch,
  Thread,
} from "@/types/pattern";

type PatternBuilderOptions = {
  name: string;
  width: number;
  height: number;

  fabric: {
    type: string;
    count: number;
    color: string;
  };

  palette: Thread[];
  colorIndexes: Int16Array;
};

export function buildPattern(
  options: PatternBuilderOptions,
): Pattern {
  const {
    name,
    width,
    height,
    fabric,
    palette,
    colorIndexes,
  } = options;

  if (
    width <= 0 ||
    height <= 0 ||
    !Number.isInteger(width) ||
    !Number.isInteger(height)
  ) {
    throw new Error(
      "Las dimensiones del patrón no son válidas.",
    );
  }

  if (
    colorIndexes.length !==
    width * height
  ) {
    throw new Error(
      "La matriz de colores no coincide con las dimensiones del patrón.",
    );
  }

  if (
    palette.length === 0
  ) {
    throw new Error(
      "No se puede crear un patrón sin colores.",
    );
  }

  const stitches:
    Stitch[] = [];

  for (
    let pixelIndex = 0;
    pixelIndex <
    colorIndexes.length;
    pixelIndex += 1
  ) {
    const colorIndex =
      colorIndexes[
        pixelIndex
      ];

    if (
      colorIndex < 0
    ) {
      continue;
    }

    const thread =
      palette[
        colorIndex
      ];

    if (!thread) {
      throw new Error(
        "Se ha encontrado una celda asociada a un color inexistente.",
      );
    }

    const x =
      pixelIndex %
      width;

    const y =
      Math.floor(
        pixelIndex /
          width,
      );

    stitches.push({
      x,
      y,
      colorId:
        thread.id,
      type: "full",
    });
  }

  const now =
    new Date().toISOString();

  return {
    version: "1.0",

    id:
      crypto.randomUUID(),

    name:
      name.trim() ||
      "Patrón desde imagen",

    width,
    height,

    fabric: {
      type:
        fabric.type,

      count:
        fabric.count,

      color:
        fabric.color,
    },

    palette,

    stitches,

    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };
}