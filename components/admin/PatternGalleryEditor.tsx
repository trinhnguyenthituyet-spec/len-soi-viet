"use client";

import Image from "next/image";
import { useState } from "react";

export function PatternGalleryEditor({ existingImages }: { existingImages: string[] }) {
  const [kept, setKept] = useState<string[]>(existingImages);

  function toggleKeep(url: string) {
    setKept((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  }

  return (
    <div className="flex flex-col gap-3">
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existingImages.map((url) => {
            const isKept = kept.includes(url);
            return (
              <label key={url} className="relative flex flex-col gap-1">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                  <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                  {isKept && <input type="hidden" name="keepImage" value={url} />}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isKept}
                    onChange={() => toggleKeep(url)}
                    className="h-3.5 w-3.5"
                  />
                  Giữ ảnh này
                </span>
              </label>
            );
          })}
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground/80">Thêm ảnh mới vào gallery</span>
        <input
          type="file"
          name="galleryImages"
          accept="image/*"
          multiple
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
