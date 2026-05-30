import { create } from 'zustand';
import type { AppStep, PixelArtSettings, ColorSwatch, CropArea, UploadError, Resolution, ColorCount, DitheringMode } from '@/types';

interface PixelArtStore {
  uploadedFile: File | null;
  uploadedImageUrl: string | null;
  uploadError: UploadError | null;

  cropArea: CropArea | null;
  cropZoom: number;
  croppedImageUrl: string | null;

  settings: PixelArtSettings;

  pixelArtImageData: ImageData | null;
  palette: ColorSwatch[];
  isGenerating: boolean;

  step: AppStep;

  setUploadedFile: (file: File, url: string) => void;
  setUploadError: (error: UploadError | null) => void;
  resetUpload: () => void;
  setCropArea: (area: CropArea) => void;
  setCropZoom: (zoom: number) => void;
  setCroppedImageUrl: (url: string | null) => void;
  applyCrop: (croppedUrl: string) => void;
  setResolution: (resolution: Resolution) => void;
  setColorCount: (colorCount: ColorCount) => void;
  setDithering: (dithering: DitheringMode) => void;
  setPixelArtResult: (imageData: ImageData, palette: ColorSwatch[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setStep: (step: AppStep) => void;
  reset: () => void;
}

const defaultSettings: PixelArtSettings = {
  resolution: 128,
  colorCount: 32,
  dithering: 'none',
};

export const usePixelArtStore = create<PixelArtStore>((set) => ({
  uploadedFile: null,
  uploadedImageUrl: null,
  uploadError: null,

  cropArea: null,
  cropZoom: 1,
  croppedImageUrl: null,

  settings: { ...defaultSettings },

  pixelArtImageData: null,
  palette: [],
  isGenerating: false,

  step: 'upload',

  setUploadedFile: (file, url) =>
    set({ uploadedFile: file, uploadedImageUrl: url, uploadError: null, step: 'crop' }),

  setUploadError: (error) => set({ uploadError: error }),

  resetUpload: () =>
    set({
      uploadedFile: null,
      uploadedImageUrl: null,
      uploadError: null,
      cropArea: null,
      cropZoom: 1,
      croppedImageUrl: null,
      pixelArtImageData: null,
      palette: [],
      step: 'upload',
    }),

  setCropArea: (area) => set({ cropArea: area }),

  setCropZoom: (zoom) => set({ cropZoom: zoom }),

  setCroppedImageUrl: (url) => set({ croppedImageUrl: url }),

  applyCrop: (croppedUrl) =>
    set({ croppedImageUrl: croppedUrl }),

  setResolution: (resolution) =>
    set((s) => ({ settings: { ...s.settings, resolution } })),

  setColorCount: (colorCount) =>
    set((s) => ({ settings: { ...s.settings, colorCount } })),

  setDithering: (dithering) =>
    set((s) => ({ settings: { ...s.settings, dithering } })),

  setPixelArtResult: (imageData, palette) =>
    set({ pixelArtImageData: imageData, palette, isGenerating: false, step: 'result' }),

  setIsGenerating: (generating) => set({ isGenerating: generating }),

  setStep: (step) => set({ step }),

  reset: () =>
    set({
      uploadedFile: null,
      uploadedImageUrl: null,
      uploadError: null,
      cropArea: null,
      cropZoom: 1,
      croppedImageUrl: null,
      settings: { ...defaultSettings },
      pixelArtImageData: null,
      palette: [],
      isGenerating: false,
      step: 'upload',
    }),
}));
