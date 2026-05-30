'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Info, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { usePixelArtStore } from '@/stores/pixelart-store';
import { generatePixelArt } from '@/lib/generator';
import { loadImageFromUrl } from '@/lib/image-processing';
import {
  RESOLUTION_OPTIONS,
  COLOR_COUNT_OPTIONS,
  DITHERING_OPTIONS,
  type Resolution,
  type ColorCount,
  type DitheringMode,
} from '@/types';

export function SettingsPanel({ onRegenerating }: { onRegenerating?: (v: boolean) => void }) {
  const settings = usePixelArtStore((s) => s.settings);
  const setResolution = usePixelArtStore((s) => s.setResolution);
  const setColorCount = usePixelArtStore((s) => s.setColorCount);
  const setDithering = usePixelArtStore((s) => s.setDithering);
  const setPixelArtResult = usePixelArtStore((s) => s.setPixelArtResult);
  const croppedImageUrl = usePixelArtStore((s) => s.croppedImageUrl);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const regeneratingRef = useRef(false);
  const [showRegenIndicator, setShowRegenIndicator] = useState(false);

  const regenerate = useCallback(async () => {
    if (regeneratingRef.current || !croppedImageUrl) return;

    regeneratingRef.current = true;
    setShowRegenIndicator(true);
    onRegenerating?.(true);
    try {
      const image = await loadImageFromUrl(croppedImageUrl);
      const result = generatePixelArt(image, usePixelArtStore.getState().settings);
      setPixelArtResult(result.imageData, result.palette);
    } catch {
    } finally {
      regeneratingRef.current = false;
      setShowRegenIndicator(false);
      onRegenerating?.(false);
    }
  }, [croppedImageUrl, setPixelArtResult, onRegenerating]);

  const scheduleRegenerate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(regenerate, 200);
  }, [regenerate]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-widest uppercase">Resolution</label>
          <Select
            value={String(settings.resolution)}
            onValueChange={(v) => {
              setResolution(Number(v) as Resolution);
              scheduleRegenerate();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Resolution" />
            </SelectTrigger>
            <SelectContent>
              {RESOLUTION_OPTIONS.map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r}&times;{r} px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            {settings.resolution}&times;{settings.resolution} pixels
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-widest uppercase">Colors</label>
          <Select
            value={String(settings.colorCount)}
            onValueChange={(v) => {
              setColorCount(Number(v) as ColorCount);
              scheduleRegenerate();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Color count" />
            </SelectTrigger>
            <SelectContent>
              {COLOR_COUNT_OPTIONS.map((c) => (
                <SelectItem key={c} value={String(c)}>
                  {c} colors
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-widest uppercase">Dithering</label>
          <Select
            value={settings.dithering}
            onValueChange={(v) => {
              setDithering(v as DitheringMode);
              scheduleRegenerate();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Dithering" />
            </SelectTrigger>
            <SelectContent>
              {DITHERING_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    {opt.label}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[240px]">
                        <p className="text-xs">{opt.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {showRegenIndicator && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Rendering...
        </div>
      )}
    </div>
  );
}
