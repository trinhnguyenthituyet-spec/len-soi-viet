import Image from "next/image";
import Link from "next/link";
import { FIBER_CATEGORY_LABELS, WEIGHT_CATEGORY_LABELS } from "@/lib/constants";
import { formatVnd } from "@/lib/utils";
import type { YarnListItem } from "@/lib/yarn-queries";

export function YarnCard({ yarn }: { yarn: YarnListItem }) {
  return (
    <Link
      href={`/yarn/${yarn.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-secondary">
        {yarn.heroImageUrl ? (
          <Image
            src={yarn.heroImageUrl}
            alt={yarn.nameVi}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có ảnh
          </div>
        )}
        {!yarn.descriptionVi && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            Chưa có mô tả
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {yarn.nameVi}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {yarn.fiberCategory && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {FIBER_CATEGORY_LABELS[yarn.fiberCategory]}
            </span>
          )}
          {yarn.weightCategory && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {WEIGHT_CATEGORY_LABELS[yarn.weightCategory]}
            </span>
          )}
        </div>

        <p className="mt-auto text-sm font-medium text-foreground">
          {yarn.minPrice != null ? (
            <>
              từ <span className="text-primary">{formatVnd(yarn.minPrice)}</span>/100g
            </>
          ) : (
            <span className="text-muted-foreground">Chưa có giá</span>
          )}
        </p>
      </div>
    </Link>
  );
}
