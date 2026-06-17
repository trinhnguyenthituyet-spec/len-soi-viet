"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CRAFT_TYPE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { PatternListItem } from "@/lib/pattern-queries";
import type { SavedPatternEntry } from "@/lib/use-saved-patterns";

export function SavedPatternCard({
  pattern,
  entry,
  onRemove,
  onNotesChange,
}: {
  pattern: PatternListItem;
  entry: SavedPatternEntry;
  onRemove: (patternId: string) => void;
  onNotesChange: (patternId: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(entry.notes);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Link href={`/patterns/${pattern.slug}`} className="relative aspect-square w-full bg-secondary">
        {pattern.thumbnailUrl ? (
          <Image
            src={pattern.thumbnailUrl}
            alt={pattern.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/patterns/${pattern.slug}`} className="font-semibold text-card-foreground hover:text-primary">
          {pattern.title}
        </Link>
        <div className="flex gap-2">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {DIFFICULTY_LABELS[pattern.difficulty]}
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {CRAFT_TYPE_LABELS[pattern.craftType]}
          </span>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onNotesChange(pattern.id, notes)}
          placeholder="Ghi chú cá nhân..."
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="button"
          onClick={() => onRemove(pattern.id)}
          className="mt-auto self-start text-sm text-muted-foreground hover:text-destructive"
        >
          Bỏ lưu
        </button>
      </div>
    </div>
  );
}
