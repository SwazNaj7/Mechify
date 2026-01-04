'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

// Client-side image compression (max 1024px width, WebP format)
async function compressImage(file: File): Promise<{ file: File; base64: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const maxWidth = 1024;
      const maxHeight = 1024;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get base64 data URL
        const base64 = canvas.toDataURL('image/webp', 0.85);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve({ file: compressedFile, base64 });
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/webp',
          0.85
        );
      }
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      setIsProcessing(true);
      try {
        const { file: compressedFile, base64 } = await compressImage(file);
        onChange(compressedFile, base64);
      } catch (error) {
        console.error('Image compression failed:', error);
        // Fallback to original file - convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null, null);
  }, [onChange]);

  if (value) {
    return (
      <div className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Trade chart preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors aspect-video cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        disabled={disabled || isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center gap-2 pointer-events-none">
        {isProcessing ? (
          <>
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-sm text-muted-foreground">
              Optimizing image...
            </span>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              {isDragging ? (
                <ImageIcon className="h-6 w-6 text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragging ? 'Drop your chart here' : 'Upload chart image'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, or WebP (auto-compressed)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
