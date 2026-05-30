import type { PixelArtSettings, ColorSwatch } from '@/types';
import { resizeImage, imageToImageData } from './image-processing';
import { quantize } from './quantization';
import { floydSteinberg, bayerOrdered } from './dithering';

function paletteToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function extractPalette(imageData: ImageData): ColorSwatch[] {
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const key = `${r},${g},${b}`;

    const entry = colorMap.get(key);
    if (entry) {
      entry.count++;
    } else {
      colorMap.set(key, { r, g, b, count: 1 });
    }
  }

  return Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .map((c) => ({ r: c.r, g: c.g, b: c.b, hex: paletteToHex(c.r, c.g, c.b) }));
}

export interface GenerationResult {
  imageData: ImageData;
  palette: ColorSwatch[];
}

export function generatePixelArt(
  sourceImage: HTMLImageElement,
  settings: PixelArtSettings,
): GenerationResult {
  const sourceImageData = imageToImageData(sourceImage);

  const resized = resizeImage(sourceImageData, settings.resolution, settings.resolution);

  const quantized = quantize(resized, settings.colorCount);

  let finalData: Uint8ClampedArray;

  if (settings.dithering === 'floyd-steinberg') {
    const tempImageData = new ImageData(
      new Uint8ClampedArray(resized.data),
      resized.width,
      resized.height,
    );
    finalData = floydSteinberg(tempImageData, quantized.palette);
  } else if (settings.dithering === 'bayer') {
    finalData = bayerOrdered(resized, quantized.palette);
  } else {
    finalData = quantized.data;
  }

  const resultImageData = new ImageData(
    new Uint8ClampedArray(finalData),
    resized.width,
    resized.height,
  );
  const palette = extractPalette(resultImageData);

  return { imageData: resultImageData, palette };
}
