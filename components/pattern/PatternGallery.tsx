"use client";

import Image from "next/image";
import { useState } from "react";

export function PatternGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-secondary text-sm text-muted-foreground">
        Chưa có ảnh
      </div>
    );
  }

  function close() {
    setOpenIndex(null);
  }

  function step(delta: number) {
    setOpenIndex((i) => {
      if (i == null) return i;
      return (i + delta + images.length) % images.length;
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden rounded-xl bg-secondary"
          >
            <Image
              src={src}
              alt={`${title} — ảnh ${i + 1}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="33vw"
            />
          </button>
        ))}
      </div>

      {openIndex != null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="absolute right-4 top-4 text-2xl text-white"
          >
            ×
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Ảnh trước"
              className="absolute left-4 text-3xl text-white"
            >
              ‹
            </button>
          )}
          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${title} — ảnh ${openIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Ảnh sau"
              className="absolute right-4 text-3xl text-white"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
