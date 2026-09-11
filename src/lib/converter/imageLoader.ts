import {
  CONVERTER_LIMITS,
  type LoadedImage,
} from "@/lib/converter/converterTypes";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
]);

function formatMegabytes(
  bytes: number,
): string {
  return (
    bytes /
    (1024 * 1024)
  ).toFixed(1);
}

export async function loadImageFile(
  file: File,
): Promise<LoadedImage> {
  if (
    !SUPPORTED_IMAGE_TYPES.has(
      file.type,
    )
  ) {
    throw new Error(
      "Formato no compatible. Utiliza una imagen JPG, JPEG o PNG.",
    );
  }

  if (
    file.size >
    CONVERTER_LIMITS.maxFileSizeBytes
  ) {
    throw new Error(
      `La imagen pesa ${formatMegabytes(
        file.size,
      )} MB. El máximo permitido en esta versión es 20 MB.`,
    );
  }

  let bitmap: ImageBitmap;

  try {
    bitmap =
      await createImageBitmap(
        file,
      );
  } catch {
    throw new Error(
      "No se ha podido leer la imagen. Comprueba que el archivo JPG o PNG no esté dañado.",
    );
  }

  if (
    bitmap.width <= 0 ||
    bitmap.height <= 0
  ) {
    bitmap.close();

    throw new Error(
      "La imagen no tiene unas dimensiones válidas.",
    );
  }

  if (
    bitmap.width >
      CONVERTER_LIMITS.maxImageWidth ||
    bitmap.height >
      CONVERTER_LIMITS.maxImageHeight
  ) {
    const dimensions =
      `${bitmap.width} × ${bitmap.height}`;

    bitmap.close();

    throw new Error(
      `La imagen mide ${dimensions} píxeles. El máximo permitido en esta versión es 12.000 × 12.000 píxeles.`,
    );
  }

  return {
    bitmap,
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
    width: bitmap.width,
    height: bitmap.height,
  };
}

export function releaseLoadedImage(
  image: LoadedImage,
): void {
  image.bitmap.close();
}