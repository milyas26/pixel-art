'use client';

import { useState, useCallback } from 'react';
import { Download, RotateCcw, Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UploadZone } from '@/components/upload-zone';
import { ImageCropper } from '@/components/cropper';
import { SettingsPanel } from '@/components/settings-panel';
import { PreviewCanvas } from '@/components/preview-canvas';
import { PaletteView } from '@/components/palette-view';
import { usePixelArtStore } from '@/stores/pixelart-store';
import { exportPixelArt, generateFilename } from '@/lib/export';
import type { ExportScale } from '@/types';

export default function HomePage() {
  const step = usePixelArtStore((s) => s.step);
  const pixelArtImageData = usePixelArtStore((s) => s.pixelArtImageData);
  const uploadedImageUrl = usePixelArtStore((s) => s.uploadedImageUrl);
  const reset = usePixelArtStore((s) => s.reset);

  const [exportScale, setExportScale] = useState<ExportScale>(1);
  const [isDark, setIsDark] = useState(false);
  const [isLiveRegen, setIsLiveRegen] = useState(false);

  const handleDownload = useCallback(() => {
    if (!pixelArtImageData) return;
    exportPixelArt(pixelArtImageData, exportScale, generateFilename());
  }, [pixelArtImageData, exportScale]);

  const handleNewImage = useCallback(() => {
    reset();
  }, [reset]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b-[3px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-semibold tracking-widest uppercase">Pixel Art</h1>
          </div>
          <div className="flex items-center gap-2">
            {step !== 'upload' && (
              <Button variant="ghost" size="sm" onClick={handleNewImage}>
                <RotateCcw className="w-4 h-4 mr-1.5" />
                New
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {step === 'upload' && (
            <section>
              <div className="text-center mb-6 space-y-2">
                <h2 className="text-lg font-semibold tracking-widest uppercase">
                  Photo to Pixel Art
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload an image to convert it into pixel art
                </p>
              </div>
              <UploadZone />
            </section>
          )}

          {step === 'crop' && uploadedImageUrl && (
            <section>
              <div className="pixel-border-card bg-card">
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold tracking-widest uppercase">Crop</h2>
                    <Badge variant="secondary" className="text-[10px]">Step 2</Badge>
                  </div>
                  <ImageCropper />
                </div>
              </div>
            </section>
          )}

          {step === 'result' && (
            <>
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-5">
                    <div className="pixel-border-card bg-card">
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-sm font-semibold tracking-widest uppercase">Result</h2>
                          {isLiveRegen && (
                            <span className="text-[10px] text-muted-foreground animate-pulse">
                              Rendering...
                            </span>
                          )}
                        </div>
                        <PreviewCanvas />
                      </div>
                    </div>

                    <div className="pixel-border-card bg-card">
                      <div className="p-5 space-y-4">
                        <PaletteView />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="pixel-border-card bg-card">
                      <div className="p-5 space-y-4">
                        <h2 className="text-sm font-semibold tracking-widest uppercase">Settings</h2>
                        <SettingsPanel onRegenerating={setIsLiveRegen} />
                      </div>
                    </div>

                    <div className="pixel-border-card bg-card">
                      <div className="p-5 space-y-4">
                        <div className="space-y-3">
                          <label className="text-xs font-semibold tracking-widest uppercase">Export Scale</label>
                          <Select
                            value={String(exportScale)}
                            onValueChange={(v) => setExportScale(Number(v) as ExportScale)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Scale" />
                            </SelectTrigger>
                            <SelectContent>
                              {([1, 2, 4, 8, 16] as const).map((s) => (
                                <SelectItem key={s} value={String(s)}>
                                  {s}&times; ({pixelArtImageData!.width * s}&times;{pixelArtImageData!.height * s})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="lg" className="w-full" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PNG
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="border-t-[3px] mt-auto">
        <div className="container max-w-4xl mx-auto px-4 h-12 flex items-center justify-center">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            All processing happens locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}
