export type CleanupLevel =
  | "none"
  | "soft"
  | "balanced"
  | "high";

export type ConversionOptions = {
  width: number;
  height: number;
  maxColors: number;
  cleanup: CleanupLevel;
  removeBackground: boolean;
  fabricType: string;
  fabricCount: number;
  fabricColor: string;
};

export type LoadedImage = {
  bitmap: ImageBitmap;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
};

export type ResizedImage = {
  imageData: ImageData;
  width: number;
  height: number;
};

export type ConversionStatistics = {
  width: number;
  height: number;
  stitchCount: number;
  colorCount: number;
};

export const CONVERTER_LIMITS = {
  maxFileSizeBytes: 20 * 1024 * 1024,
  maxImageWidth: 12_000,
  maxImageHeight: 12_000,
  minPatternWidth: 10,
  minPatternHeight: 10,
  maxPatternWidth: 300,
  maxPatternHeight: 300,
  minColors: 4,
  maxColors: 32,
} as const;

export const DEFAULT_CONVERSION_OPTIONS = {
  longSide: 120,
  maxColors: 16,
  cleanup: "balanced" as CleanupLevel,
  removeBackground: false,
  fabricType: "aida",
  fabricCount: 14,
  fabricColor: "#ffffff",
} as const;