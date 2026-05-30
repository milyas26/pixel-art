'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePixelArtStore } from '@/stores/pixelart-store';

const ZOOM_LEVELS = [1, 2, 4, 8] as const;

export function PreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelArtImageData = usePixelArtStore((s) => s.pixelArtImageData);
  const [zoom, setZoom] = useState<number>(4);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixelArtImageData) return;

    const ctx = canvas.getContext('2d')!;
    const scaledW = pixelArtImageData.width * zoom;
    const scaledH = pixelArtImageData.height * zoom;

    canvas.width = scaledW;
    canvas.height = scaledH;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = pixelArtImageData.width;
    tempCanvas.height = pixelArtImageData.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(pixelArtImageData, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH);
  }, [pixelArtImageData, zoom]);

  useEffect(() => {
    draw();
  }, [draw]);

  const currentZoomIndex = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number]);

  const zoomIn = useCallback(() => {
    const nextIndex = Math.min(currentZoomIndex + 1, ZOOM_LEVELS.length - 1);
    setZoom(ZOOM_LEVELS[nextIndex]);
  }, [currentZoomIndex]);

  const zoomOut = useCallback(() => {
    const prevIndex = Math.max(currentZoomIndex - 1, 0);
    setZoom(ZOOM_LEVELS[prevIndex]);
  }, [currentZoomIndex]);

  if (!pixelArtImageData) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest uppercase">Preview</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={currentZoomIndex === 0}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">
            {zoom}&times;
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={currentZoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)_50%_/_20px_20px] p-6 min-h-[200px] pixel-border-sunk">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
