'use client';

import { usePixelArtStore } from '@/stores/pixelart-store';
import { Badge } from '@/components/ui/badge';

export function PaletteView() {
  const palette = usePixelArtStore((s) => s.palette);

  if (palette.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest uppercase">Color Palette</h3>
        <Badge variant="secondary" className="text-[10px]">
          {palette.length} colors
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {palette.map((color) => (
          <div
            key={color.hex}
            className="group relative flex flex-col items-center gap-1"
          >
            <div
              className="w-9 h-9 border-[3px] border-border transition-transform group-hover:scale-125"
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap font-mono">
              {color.hex}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
