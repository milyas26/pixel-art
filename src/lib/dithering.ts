import type { PaletteColor } from './quantization';

function findNearest(r: number, g: number, b: number, palette: PaletteColor[]): PaletteColor {
  let minDist = Infinity;
  let nearest = palette[0];

  for (const pc of palette) {
    const dr = r - pc.r;
    const dg = g - pc.g;
    const db = b - pc.b;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < minDist) {
      minDist = dist;
      nearest = pc;
    }
  }

  return nearest;
}

export function floydSteinberg(
  imageData: ImageData,
  palette: PaletteColor[],
): Uint8ClampedArray {
  const { data, width, height } = imageData;
  const floats = new Float32Array(data.length);

  for (let i = 0; i < data.length; i++) {
    floats[i] = data[i];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const oldR = floats[idx];
      const oldG = floats[idx + 1];
      const oldB = floats[idx + 2];

      const nearest = findNearest(
        Math.max(0, Math.min(255, oldR)),
        Math.max(0, Math.min(255, oldG)),
        Math.max(0, Math.min(255, oldB)),
        palette,
      );

      floats[idx] = nearest.r;
      floats[idx + 1] = nearest.g;
      floats[idx + 2] = nearest.b;

      const errR = oldR - nearest.r;
      const errG = oldG - nearest.g;
      const errB = oldB - nearest.b;

      const right = idx + 4;
      if (x + 1 < width) {
        floats[right] += errR * (7 / 16);
        floats[right + 1] += errG * (7 / 16);
        floats[right + 2] += errB * (7 / 16);
      }

      if (x > 0 && y + 1 < height) {
        const bl = ((y + 1) * width + x - 1) * 4;
        floats[bl] += errR * (3 / 16);
        floats[bl + 1] += errG * (3 / 16);
        floats[bl + 2] += errB * (3 / 16);
      }

      if (y + 1 < height) {
        const b = ((y + 1) * width + x) * 4;
        floats[b] += errR * (5 / 16);
        floats[b + 1] += errG * (5 / 16);
        floats[b + 2] += errB * (5 / 16);
      }

      if (x + 1 < width && y + 1 < height) {
        const br = ((y + 1) * width + x + 1) * 4;
        floats[br] += errR * (1 / 16);
        floats[br + 1] += errG * (1 / 16);
        floats[br + 2] += errB * (1 / 16);
      }
    }
  }

  const result = new Uint8ClampedArray(floats.length);
  for (let i = 0; i < floats.length; i++) {
    result[i] = Math.max(0, Math.min(255, Math.round(floats[i])));
  }

  return result;
}

const BAYER_2X2 = [
  [0, 2],
  [3, 1],
];

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function getBayerThreshold(x: number, y: number, size: number): number {
  let matrix: number[][];
  let n: number;

  if (size <= 2) {
    matrix = BAYER_2X2;
    n = 2;
  } else {
    matrix = BAYER_4X4;
    n = 4;
  }

  const value = matrix[y % n][x % n];
  return (value + 0.5) / (n * n);
}

export function bayerOrdered(
  imageData: ImageData,
  palette: PaletteColor[],
): Uint8ClampedArray {
  const { data, width, height } = imageData;
  const size = Math.max(width, height);
  const result = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const threshold = getBayerThreshold(x, y, size);

      const offset = (threshold - 0.5) * 128;

      const r = Math.max(0, Math.min(255, data[idx] + offset));
      const g = Math.max(0, Math.min(255, data[idx + 1] + offset));
      const b = Math.max(0, Math.min(255, data[idx + 2] + offset));

      const nearest = findNearest(r, g, b, palette);
      result[idx] = nearest.r;
      result[idx + 1] = nearest.g;
      result[idx + 2] = nearest.b;
      result[idx + 3] = data[idx + 3];
    }
  }

  return result;
}
