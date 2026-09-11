import type { Pattern } from "@/types/pattern";

export const CELL_SIZE = 20;

export function renderPatternToCanvas(
  canvas: HTMLCanvasElement,
  pattern: Pattern,
) {
  const context =
    canvas.getContext("2d");

  if (!context) {
    return;
  }

  const canvasWidth =
    pattern.width * CELL_SIZE;

  const canvasHeight =
    pattern.height * CELL_SIZE;

  canvas.width =
    canvasWidth;

  canvas.height =
    canvasHeight;

  context.clearRect(
    0,
    0,
    canvasWidth,
    canvasHeight,
  );

  context.fillStyle =
    pattern.fabric.color;

  context.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight,
  );

  for (
    const stitch
    of pattern.stitches
  ) {
    const thread =
      pattern.palette.find(
        (item) =>
          item.id ===
          stitch.colorId,
      );

    if (!thread) {
      continue;
    }

    context.fillStyle =
      thread.rgb;

    context.fillRect(
      stitch.x *
        CELL_SIZE +
        1,
      stitch.y *
        CELL_SIZE +
        1,
      CELL_SIZE - 1,
      CELL_SIZE - 1,
    );
  }

  context.strokeStyle =
    "#cbd5e1";

  context.lineWidth = 1;

  for (
    let x = 0;
    x <= pattern.width;
    x += 1
  ) {
    const pixelX =
      x * CELL_SIZE + 0.5;

    context.beginPath();

    context.moveTo(
      pixelX,
      0,
    );

    context.lineTo(
      pixelX,
      canvasHeight,
    );

    context.stroke();
  }

  for (
    let y = 0;
    y <= pattern.height;
    y += 1
  ) {
    const pixelY =
      y * CELL_SIZE + 0.5;

    context.beginPath();

    context.moveTo(
      0,
      pixelY,
    );

    context.lineTo(
      canvasWidth,
      pixelY,
    );

    context.stroke();
  }

  context.strokeStyle =
    "#94a3b8";

  context.lineWidth = 1.5;

  for (
    let x = 0;
    x <= pattern.width;
    x += 10
  ) {
    const pixelX =
      x * CELL_SIZE + 0.5;

    context.beginPath();

    context.moveTo(
      pixelX,
      0,
    );

    context.lineTo(
      pixelX,
      canvasHeight,
    );

    context.stroke();
  }

  for (
    let y = 0;
    y <= pattern.height;
    y += 10
  ) {
    const pixelY =
      y * CELL_SIZE + 0.5;

    context.beginPath();

    context.moveTo(
      0,
      pixelY,
    );

    context.lineTo(
      canvasWidth,
      pixelY,
    );

    context.stroke();
  }
}