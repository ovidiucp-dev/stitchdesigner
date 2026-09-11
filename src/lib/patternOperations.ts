import type {
  Pattern,
  Stitch,
} from "@/types/pattern";

export function getStitchAt(
  pattern: Pattern,
  x: number,
  y: number,
): Stitch | null {
  return (
    pattern.stitches.find(
      (stitch) =>
        stitch.x === x &&
        stitch.y === y,
    ) ?? null
  );
}

export function updatePatternCell(
  pattern: Pattern,
  x: number,
  y: number,
  stitch: Stitch | null,
): Pattern {
  const remainingStitches =
    pattern.stitches.filter(
      (item) =>
        !(
          item.x === x &&
          item.y === y
        ),
    );

  return {
    ...pattern,
    stitches: stitch
      ? [
          ...remainingStitches,
          stitch,
        ]
      : remainingStitches,
    metadata: {
      ...pattern.metadata,
      updatedAt:
        new Date().toISOString(),
    },
  };
}