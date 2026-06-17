import Image from "next/image";
import Link from "next/link";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import type { Pattern } from "@/types";

export function RelatedPatterns({ patterns }: { patterns: Pattern[] }) {
  if (patterns.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có mẫu đan/móc nào dùng sợi này.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {patterns.map((pattern) => (
        <Link
          key={pattern.id}
          href={`/patterns/${pattern.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-square w-full bg-secondary">
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
          </div>
          <div className="flex flex-1 flex-col gap-1 p-3">
            <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {pattern.title}
            </h3>
            <span className="text-xs text-muted-foreground">
              {DIFFICULTY_LABELS[pattern.difficulty]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
