import type { Pattern } from "@/types/pattern";

function isValidHexColor(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(value)
  );
}

function isValidDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value))
  );
}

export function isValidPattern(value: unknown): value is Pattern {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Pattern>;

  if (
    candidate.version !== "1.0" ||
    typeof candidate.id !== "string" ||
    candidate.id.trim() === "" ||
    typeof candidate.name !== "string" ||
    candidate.name.trim() === "" ||
    !Number.isInteger(candidate.width) ||
    !candidate.width ||
    candidate.width <= 0 ||
    !Number.isInteger(candidate.height) ||
    !candidate.height ||
    candidate.height <= 0
  ) {
    return false;
  }

  if (
    typeof candidate.fabric !== "object" ||
    candidate.fabric === null ||
    typeof candidate.fabric.type !== "string" ||
    typeof candidate.fabric.count !== "number" ||
    candidate.fabric.count <= 0 ||
    !isValidHexColor(candidate.fabric.color)
  ) {
    return false;
  }

  if (!Array.isArray(candidate.palette)) {
    return false;
  }

  const threadIds = new Set<string>();

  for (const thread of candidate.palette) {
    if (
      typeof thread !== "object" ||
      thread === null ||
      typeof thread.id !== "string" ||
      thread.id.trim() === "" ||
      typeof thread.name !== "string" ||
      !isValidHexColor(thread.rgb) ||
      typeof thread.symbol !== "string" ||
      typeof thread.brand !== "string"
    ) {
      return false;
    }

    if (threadIds.has(thread.id)) {
      return false;
    }

    threadIds.add(thread.id);
  }

  if (!Array.isArray(candidate.stitches)) {
    return false;
  }

  const occupiedCells = new Set<string>();

  for (const stitch of candidate.stitches) {
    if (
      typeof stitch !== "object" ||
      stitch === null ||
      !Number.isInteger(stitch.x) ||
      !Number.isInteger(stitch.y) ||
      stitch.x < 0 ||
      stitch.y < 0 ||
      stitch.x >= candidate.width ||
      stitch.y >= candidate.height ||
      stitch.type !== "full" ||
      typeof stitch.colorId !== "string" ||
      !threadIds.has(stitch.colorId)
    ) {
      return false;
    }

    const cellKey = `${stitch.x}:${stitch.y}`;

    if (occupiedCells.has(cellKey)) {
      return false;
    }

    occupiedCells.add(cellKey);
  }

  if (
    typeof candidate.metadata !== "object" ||
    candidate.metadata === null ||
    !isValidDate(candidate.metadata.createdAt) ||
    !isValidDate(candidate.metadata.updatedAt)
  ) {
    return false;
  }

  return true;
}