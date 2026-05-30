import type { ExportScale } from '@/types';

export function exportPixelArt(
  imageData: ImageData,
  scale: ExportScale,
  filename: string,
): void {
  const srcWidth = imageData.width;
  const srcHeight = imageData.height;
  const width = srcWidth * scale;
  const height = srcHeight * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = srcWidth;
  tempCanvas.height = srcHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, width, height);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function generateFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `pixel-art-${date}.png`;
}
