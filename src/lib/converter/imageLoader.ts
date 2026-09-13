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
      "Unsupported format. Use a JPG, JPEG, or PNG image.",
    );
  }

  if (
    file.size >
    CONVERTER_LIMITS.maxFileSizeBytes
  ) {
    throw new Error(
      `The image size is ${formatMegabytes(
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
      "The image could not be read. Check that the JPG or PNG file is not corrupted.",
    );
  }

  if (
    bitmap.width <= 0 ||
    bitmap.height <= 0
  ) {
    bitmap.close();

    throw new Error(
      "The image dimensions are not valid.",
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
      `The image dimensions are ${dimensions} píxeles. The maximum allowed in this version is 12,000 × 12,000 pixels.`,
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