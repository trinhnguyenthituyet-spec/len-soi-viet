import Image from "next/image";
import Link from "next/link";
import { FIBER_CATEGORY_LABELS, WEIGHT_CATEGORY_LABELS } from "@/lib/constants";
import type { YarnDetail } from "@/lib/yarn-queries";

export function YarnHero({ yarn }: { yarn: YarnDetail }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[280px_1fr]">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
        {yarn.heroImageUrl ? (
          <Image
            src={yarn.heroImageUrl}
            alt={yarn.nameVi}
            fill
            className="object-cover"
            sizes="280px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {!yarn.descriptionVi && (
          <span className="inline-flex w-fit rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            Chưa có mô tả — sợi này vừa được tự tạo từ import giá
          </span>
        )}
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{yarn.nameVi}</h1>
        {yarn.nameEn && <p className="text-sm text-muted-foreground">{yarn.nameEn}</p>}
        {yarn.fiberComposition && (
          <p className="text-sm text-foreground/80">{yarn.fiberComposition}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {yarn.fiberCategory && (
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {FIBER_CATEGORY_LABELS[yarn.fiberCategory]}
            </span>
          )}
          {yarn.weightCategory && (
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {WEIGHT_CATEGORY_LABELS[yarn.weightCategory]}
            </span>
          )}
          {yarn.texture.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>

        <Link
          href={`/compare?yarns=${yarn.slug}`}
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          So sánh sợi này
        </Link>
      </div>
    </div>
  );
}
