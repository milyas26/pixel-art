interface ColorBucketEntry {
  r: number;
  g: number;
  b: number;
  count: number;
}

interface ColorBucket {
  entries: ColorBucketEntry[];
  minR: number;
  maxR: number;
  minG: number;
  maxG: number;
  minB: number;
  maxB: number;
  totalCount: number;
}

function makeBucket(entries: ColorBucketEntry[]): ColorBucket {
  let minR = 255, maxR = 0;
  let minG = 255, maxG = 0;
  let minB = 255, maxB = 0;
  let totalCount = 0;

  for (const e of entries) {
    if (e.r < minR) minR = e.r;
    if (e.r > maxR) maxR = e.r;
    if (e.g < minG) minG = e.g;
    if (e.g > maxG) maxG = e.g;
    if (e.b < minB) minB = e.b;
    if (e.b > maxB) maxB = e.b;
    totalCount += e.count;
  }

  return { entries, minR, maxR, minG, maxG, minB, maxB, totalCount };
}

function buildHistogram(data: Uint8ClampedArray): Map<number, { rSum: number; gSum: number; bSum: number; count: number }> {
  const BITS = 5;
  const SHIFT = 8 - BITS;
  const histogram = new Map<number, { rSum: number; gSum: number; bSum: number; count: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> SHIFT) << 10) | ((g >> SHIFT) << 5) | (b >> SHIFT);

    const entry = histogram.get(key);
    if (entry) {
      entry.rSum += r;
      entry.gSum += g;
      entry.bSum += b;
      entry.count++;
    } else {
      histogram.set(key, { rSum: r, gSum: g, bSum: b, count: 1 });
    }
  }

  return histogram;
}

export interface PaletteColor {
  r: number;
  g: number;
  b: number;
}

export function quantize(imageData: ImageData, colorCount: number): {
  data: Uint8ClampedArray;
  palette: PaletteColor[];
} {
  const { data } = imageData;
  const histogram = buildHistogram(data);

  const entries: ColorBucketEntry[] = Array.from(histogram.entries()).map(([, val]) => ({
    r: Math.round(val.rSum / val.count),
    g: Math.round(val.gSum / val.count),
    b: Math.round(val.bSum / val.count),
    count: val.count,
  }));

  if (entries.length <= colorCount) {
    const palette: PaletteColor[] = entries.map(e => ({ r: e.r, g: e.g, b: e.b }));
    const result = copyPixelData(data);
    return { data: result, palette };
  }

  const buckets: ColorBucket[] = [makeBucket(entries)];

  while (buckets.length < colorCount) {
    let maxRange = 0;
    let maxIdx = 0;

    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[i];
      const range = Math.max(b.maxR - b.minR, b.maxG - b.minG, b.maxB - b.minB);
      if (range > maxRange) {
        maxRange = range;
        maxIdx = i;
      }
    }

    if (maxRange === 0) break;

    const bucket = buckets[maxIdx];
    const rRange = bucket.maxR - bucket.minR;
    const gRange = bucket.maxG - bucket.minG;
    const bRange = bucket.maxB - bucket.minB;

    let dim: 'r' | 'g' | 'b';
    if (rRange >= gRange && rRange >= bRange) dim = 'r';
    else if (gRange >= rRange && gRange >= bRange) dim = 'g';
    else dim = 'b';

    bucket.entries.sort((a, b) => a[dim] - b[dim]);

    const halfCount = bucket.totalCount / 2;
    let accumCount = 0;
    let splitIdx = 0;

    for (let i = 0; i < bucket.entries.length; i++) {
      accumCount += bucket.entries[i].count;
      if (accumCount >= halfCount) {
        splitIdx = i + 1;
        break;
      }
    }

    if (splitIdx === 0 || splitIdx >= bucket.entries.length) break;

    const leftEntries = bucket.entries.slice(0, splitIdx);
    const rightEntries = bucket.entries.slice(splitIdx);

    buckets.splice(maxIdx, 1, makeBucket(leftEntries), makeBucket(rightEntries));
  }

  const palette: PaletteColor[] = buckets.map(bucket => {
    let rSum = 0, gSum = 0, bSum = 0, total = 0;
    for (const e of bucket.entries) {
      rSum += e.r * e.count;
      gSum += e.g * e.count;
      bSum += e.b * e.count;
      total += e.count;
    }
    return {
      r: Math.round(rSum / total),
      g: Math.round(gSum / total),
      b: Math.round(bSum / total),
    };
  });

  const lut = buildLUT(palette);
  const result = applyLUT(data, lut, palette);

  return { data: result, palette };
}

function buildLUT(palette: PaletteColor[]): Uint8Array {
  const BITS = 5;
  const LEVELS = 1 << BITS;
  const SHIFT = 8 - BITS;
  const lut = new Uint8Array(LEVELS * LEVELS * LEVELS);

  for (let r5 = 0; r5 < LEVELS; r5++) {
    const r = (r5 << SHIFT) + (1 << (SHIFT - 1));
    for (let g5 = 0; g5 < LEVELS; g5++) {
      const g = (g5 << SHIFT) + (1 << (SHIFT - 1));
      for (let b5 = 0; b5 < LEVELS; b5++) {
        const b = (b5 << SHIFT) + (1 << (SHIFT - 1));
        const idx = (r5 << 10) | (g5 << 5) | b5;

        let minDist = Infinity;
        let nearestIdx = 0;

        for (let pi = 0; pi < palette.length; pi++) {
          const dr = r - palette[pi].r;
          const dg = g - palette[pi].g;
          const db = b - palette[pi].b;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = pi;
          }
        }

        lut[idx] = nearestIdx;
      }
    }
  }

  return lut;
}

function applyLUT(
  data: Uint8ClampedArray,
  lut: Uint8Array,
  palette: PaletteColor[],
): Uint8ClampedArray {
  const SHIFT = 3;
  const result = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r5 = data[i] >> SHIFT;
    const g5 = data[i + 1] >> SHIFT;
    const b5 = data[i + 2] >> SHIFT;
    const lutIdx = (r5 << 10) | (g5 << 5) | b5;
    const pi = lut[lutIdx];
    result[i] = palette[pi].r;
    result[i + 1] = palette[pi].g;
    result[i + 2] = palette[pi].b;
    result[i + 3] = data[i + 3];
  }

  return result;
}

function copyPixelData(data: Uint8ClampedArray): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length);
  result.set(data);
  return result;
}
