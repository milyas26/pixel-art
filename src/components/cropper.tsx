'use client';

import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { X, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePixelArtStore } from '@/stores/pixelart-store';
import { generatePixelArt } from '@/lib/generator';
import { cropImageWithZoom, loadImageFromUrl, imageDataToObjectUrl } from '@/lib/image-processing';
import type { CropArea } from '@/types';

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  zoom: number,
  rotation: number,
): Promise<string> {
  const image = await loadImageFromUrl(imageSrc);
  const crop: CropArea = {
    x: pixelCrop.x,
    y: pixelCrop.y,
    width: pixelCrop.width,
    height: pixelCrop.height,
  };
  const imageData = cropImageWithZoom(
    image,
    crop,
    zoom,
    rotation,
    image.naturalWidth,
    image.naturalHeight,
  );
  return imageDataToObjectUrl(imageData);
}

export function ImageCropper() {
  const uploadedImageUrl = usePixelArtStore((s) => s.uploadedImageUrl);
  const settings = usePixelArtStore((s) => s.settings);
  const applyCrop = usePixelArtStore((s) => s.applyCrop);
  const setPixelArtResult = usePixelArtStore((s) => s.setPixelArtResult);
  const setIsGenerating = usePixelArtStore((s) => s.setIsGenerating);
  const isGenerating = usePixelArtStore((s) => s.isGenerating);
  const resetUpload = usePixelArtStore((s) => s.resetUpload);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (!croppedAreaPixels || !uploadedImageUrl) return;

    setIsGenerating(true);
    try {
      const croppedUrl = await getCroppedImg(uploadedImageUrl, croppedAreaPixels, zoom, rotation);
      applyCrop(croppedUrl);

      const image = await loadImageFromUrl(croppedUrl);
      const result = generatePixelArt(image, settings);
      setPixelArtResult(result.imageData, result.palette);
    } catch {
      setIsGenerating(false);
    }
  }, [croppedAreaPixels, uploadedImageUrl, zoom, rotation, settings, applyCrop, setIsGenerating, setPixelArtResult]);

  const handleCancel = useCallback(() => {
    resetUpload();
  }, [resetUpload]);

  if (!uploadedImageUrl) return null;

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full aspect-square max-h-[480px] bg-black/10 dark:bg-white/5 overflow-hidden pixel-border-sunk">
        <Cropper
          image={uploadedImageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid
        />
      </div>

      <div className="space-y-4 px-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-widest uppercase">Zoom</label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.01}
            onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : v)}
            aria-label="Zoom level"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="lg" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button size="lg" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Generate Pixel Art
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
