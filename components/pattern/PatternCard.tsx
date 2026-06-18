import Link from "next/link";
import { FadeImage } from "@/components/ui/FadeImage";
import { CRAFT_TYPE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { PatternListItem } from "@/lib/pattern-queries";

export function PatternCard({ pattern }: { pattern: PatternListItem }) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-secondary">
        {pattern.thumbnailUrl ? (
          <FadeImage
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
        <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          {DIFFICULTY_LABELS[pattern.difficulty]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {pattern.title}
        </h3>
        <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {CRAFT_TYPE_LABELS[pattern.craftType]}
        </span>
      </div>
    </Link>
  );
}
