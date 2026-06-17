import Image from "next/image";
import Link from "next/link";
import { formatVnd } from "@/lib/utils";
import type { PatternDetail } from "@/lib/pattern-queries";

export function SuitableYarns({ yarns }: { yarns: PatternDetail["suitableYarns"] }) {
  if (yarns.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có thông tin sợi phù hợp cho mẫu này.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {yarns.map((yarn) => {
        const prices = yarn.priceListings.map((p) => p.pricePer100g);
        const minPrice = prices.length ? Math.min(...prices) : null;
        return (
          <Link
            key={yarn.id}
            href={`/yarn/${yarn.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square w-full bg-secondary">
              {yarn.heroImageUrl && (
                <Image
                  src={yarn.heroImageUrl}
                  alt={yarn.nameVi}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              )}
            </div>
            <div className="flex flex-col gap-1 p-3">
              <span className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {yarn.nameVi}
              </span>
              <span className="text-xs text-muted-foreground">
                {minPrice != null ? `từ ${formatVnd(minPrice)}/100g` : "Chưa có giá"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
