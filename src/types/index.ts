export type DitheringMode = 'none' | 'floyd-steinberg' | 'bayer';

export type Resolution = 16 | 32 | 48 | 64 | 96 | 128 | 256;

export type ColorCount = 8 | 16 | 32 | 64 | 128 | 256;

export type ExportScale = 1 | 2 | 4 | 8 | 16;

export type AppStep = 'upload' | 'crop' | 'result';

export interface ColorSwatch {
  hex: string;
  r: number;
  g: number;
  b: number;
}

export interface PixelArtSettings {
  resolution: Resolution;
  colorCount: ColorCount;
  dithering: DitheringMode;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type UploadErrorType = 'invalid-format' | 'too-large';

export interface UploadError {
  type: UploadErrorType;
  message: string;
}

export const RESOLUTION_OPTIONS: Resolution[] = [16, 32, 48, 64, 96, 128, 256];

export const COLOR_COUNT_OPTIONS: ColorCount[] = [8, 16, 32, 64, 128, 256];

export const EXPORT_SCALES: ExportScale[] = [1, 2, 4, 8, 16];

export const DITHERING_OPTIONS: { value: DitheringMode; label: string; description: string }[] = [
  {
    value: 'none',
    label: 'None',
    description: 'No dithering. Solid blocks of color with sharp transitions.',
  },
  {
    value: 'floyd-steinberg',
    label: 'Floyd-Steinberg',
    description: 'Error diffusion dithering that distributes quantization error to neighboring pixels, creating smooth gradients with limited colors.',
  },
  {
    value: 'bayer',
    label: 'Bayer Ordered',
    description: 'Pattern-based dithering using a Bayer matrix, creating a distinctive crosshatch texture.',
  },
];

export const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
