import {
  CONVERTER_LIMITS,
} from "@/lib/converter/converterTypes";

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type ColorBucket = {
  colors: RgbColor[];
};

type ColorChannel =
  | "r"
  | "g"
  | "b";

function validateMaxColors(
  maxColors: number,
): void {
  if (
    !Number.isInteger(maxColors) ||
    maxColors <
      CONVERTER_LIMITS.minColors ||
    maxColors >
      CONVERTER_LIMITS.maxColors
  ) {
    throw new Error(
      `El número máximo de colores debe estar entre ${CONVERTER_LIMITS.minColors} y ${CONVERTER_LIMITS.maxColors}.`,
    );
  }
}

function getChannelRange(
  colors: RgbColor[],
  channel: ColorChannel,
): number {
  let minimum = 255;
  let maximum = 0;

  for (
    const color
    of colors
  ) {
    const value =
      color[channel];

    if (
      value < minimum
    ) {
      minimum =
        value;
    }

    if (
      value > maximum
    ) {
      maximum =
        value;
    }
  }

  return (
    maximum -
    minimum
  );
}

function getLargestRangeChannel(
  colors: RgbColor[],
): {
  channel: ColorChannel;
  range: number;
} {
  const redRange =
    getChannelRange(
      colors,
      "r",
    );

  const greenRange =
    getChannelRange(
      colors,
      "g",
    );

  const blueRange =
    getChannelRange(
      colors,
      "b",
    );

  if (
    redRange >= greenRange &&
    redRange >= blueRange
  ) {
    return {
      channel: "r",
      range: redRange,
    };
  }

  if (
    greenRange >= redRange &&
    greenRange >= blueRange
  ) {
    return {
      channel: "g",
      range: greenRange,
    };
  }

  return {
    channel: "b",
    range: blueRange,
  };
}

function compareColors(
  channel: ColorChannel,
) {
  const secondaryChannels: ColorChannel[] =
    channel === "r"
      ? ["g", "b"]
      : channel === "g"
        ? ["r", "b"]
        : ["r", "g"];

  return (
    a: RgbColor,
    b: RgbColor,
  ): number => {
    const primaryDifference =
      a[channel] -
      b[channel];

    if (
      primaryDifference !== 0
    ) {
      return primaryDifference;
    }

    const firstDifference =
      a[
        secondaryChannels[0]
      ] -
      b[
        secondaryChannels[0]
      ];

    if (
      firstDifference !== 0
    ) {
      return firstDifference;
    }

    return (
      a[
        secondaryChannels[1]
      ] -
      b[
        secondaryChannels[1]
      ]
    );
  };
}

function splitBucket(
  bucket: ColorBucket,
): [
  ColorBucket,
  ColorBucket,
] | null {
  if (
    bucket.colors.length <
    2
  ) {
    return null;
  }

  const {
    channel,
    range,
  } =
    getLargestRangeChannel(
      bucket.colors,
    );

  if (
    range === 0
  ) {
    return null;
  }

  const sorted =
    [...bucket.colors].sort(
      compareColors(
        channel,
      ),
    );

  const middle =
    Math.floor(
      sorted.length / 2,
    );

  if (
    middle <= 0 ||
    middle >=
      sorted.length
  ) {
    return null;
  }

  return [
    {
      colors:
        sorted.slice(
          0,
          middle,
        ),
    },
    {
      colors:
        sorted.slice(
          middle,
        ),
    },
  ];
}

function calculateBucketPriority(
  bucket: ColorBucket,
): {
  range: number;
  population: number;
} {
  return {
    range:
      getLargestRangeChannel(
        bucket.colors,
      ).range,

    population:
      bucket.colors.length,
  };
}

function chooseBucketToSplit(
  buckets: ColorBucket[],
): number {
  let bestIndex =
    -1;

  let bestRange =
    -1;

  let bestPopulation =
    -1;

  for (
    let index = 0;
    index <
    buckets.length;
    index += 1
  ) {
    const bucket =
      buckets[index];

    if (
      bucket.colors.length <
      2
    ) {
      continue;
    }

    const priority =
      calculateBucketPriority(
        bucket,
      );

    if (
      priority.range >
        bestRange ||
      (
        priority.range ===
          bestRange &&
        priority.population >
          bestPopulation
      )
    ) {
      bestIndex =
        index;

      bestRange =
        priority.range;

      bestPopulation =
        priority.population;
    }
  }

  return bestIndex;
}

function averageBucketColor(
  colors: RgbColor[],
): RgbColor {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;

  for (
    const color
    of colors
  ) {
    totalR +=
      color.r;

    totalG +=
      color.g;

    totalB +=
      color.b;
  }

  const count =
    colors.length;

  return {
    r:
      Math.round(
        totalR /
          count,
      ),

    g:
      Math.round(
        totalG /
          count,
      ),

    b:
      Math.round(
        totalB /
          count,
      ),
  };
}

function extractValidPixels(
  imageData: ImageData,
  backgroundMask?: Uint8Array,
): RgbColor[] {
  const {
    data,
    width,
    height,
  } = imageData;

  const pixelCount =
    width *
    height;

  if (
    backgroundMask &&
    backgroundMask.length !==
      pixelCount
  ) {
    throw new Error(
      "La máscara de fondo no coincide con las dimensiones de la imagen.",
    );
  }

  const colors:
    RgbColor[] = [];

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

    colors.push({
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
    });
  }

  return colors;
}

export function quantizeMedianCut(
  imageData: ImageData,
  maxColors: number,
  backgroundMask?: Uint8Array,
): RgbColor[] {
  validateMaxColors(
    maxColors,
  );

  const colors =
    extractValidPixels(
      imageData,
      backgroundMask,
    );

  if (
    colors.length === 0
  ) {
    return [];
  }

  let buckets:
    ColorBucket[] = [
      {
        colors,
      },
    ];

  while (
    buckets.length <
    maxColors
  ) {
    const bucketIndex =
      chooseBucketToSplit(
        buckets,
      );

    if (
      bucketIndex === -1
    ) {
      break;
    }

    const split =
      splitBucket(
        buckets[
          bucketIndex
        ],
      );

    if (
      !split
    ) {
      break;
    }

    buckets = [
      ...buckets.slice(
        0,
        bucketIndex,
      ),

      split[0],
      split[1],

      ...buckets.slice(
        bucketIndex + 1,
      ),
    ];
  }

  return buckets.map(
    (bucket) =>
      averageBucketColor(
        bucket.colors,
      ),
  );
}