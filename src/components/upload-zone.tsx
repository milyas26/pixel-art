'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePixelArtStore } from '@/stores/pixelart-store';
import { ACCEPTED_FORMATS, MAX_FILE_SIZE, type UploadError } from '@/types';

const FORMAT_LABELS = ['PNG', 'JPG', 'JPEG', 'WEBP'].join(', ');

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setUploadedFile = usePixelArtStore((s) => s.setUploadedFile);
  const setUploadError = usePixelArtStore((s) => s.setUploadError);
  const uploadError = usePixelArtStore((s) => s.uploadError);

  const validateFile = useCallback((file: File): UploadError | null => {
    if (!ACCEPTED_FORMATS.includes(file.type as (typeof ACCEPTED_FORMATS)[number])) {
      return {
        type: 'invalid-format',
        message: `Invalid format. Accepted: ${FORMAT_LABELS}`,
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        type: 'too-large',
        message: `File too large. Maximum size: 20MB`,
      };
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      const url = URL.createObjectURL(file);
      setUploadedFile(file, url);
    },
    [validateFile, setUploadError, setUploadedFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    setUploadError(null);
    inputRef.current?.click();
  }, [setUploadError]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          w-full p-16 flex flex-col items-center justify-center gap-5
          border-[3px] border-dashed
          transition-colors
          ${isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border bg-muted/40 hover:border-primary/60 hover:bg-muted'
          }
        `}
      >
        <div className={`p-5 ${isDragging ? 'bg-primary/15' : 'bg-muted'}`} style={{ imageRendering: 'pixelated' }}>
          {isDragging ? (
            <Upload className="w-10 h-10 text-primary" />
          ) : (
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold tracking-widest uppercase">
            {isDragging ? 'Drop it!' : 'Upload Image'}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag &amp; drop or click to browse
          </p>
          <p className="text-[10px] text-muted-foreground">
            {FORMAT_LABELS} &middot; Up to 20MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload image file"
        />
      </button>

      {uploadError && (
        <div className="mt-4 flex items-center gap-3 p-4 border-[3px] border-destructive bg-destructive/10 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase">{uploadError.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto shrink-0"
            onClick={() => setUploadError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
