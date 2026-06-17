import Image from "next/image";
import Link from "next/link";
import {
  ALLERGY_RISK_LABELS,
  FIBER_CATEGORY_LABELS,
  WASHABILITY_LABELS,
  WEIGHT_CATEGORY_LABELS,
} from "@/lib/constants";
import { formatVnd } from "@/lib/utils";
import type { YarnDetail } from "@/lib/yarn-queries";

function scoreLabel(value: number | null) {
  return value != null ? `${value}/5` : "—";
}

const PROPERTY_ROWS: { label: string; render: (yarn: YarnDetail) => string }[] = [
  {
    label: "Loại chất liệu",
    render: (y) => (y.fiberCategory ? FIBER_CATEGORY_LABELS[y.fiberCategory] : "—"),
  },
  {
    label: "Độ dày sợi",
    render: (y) => (y.weightCategory ? WEIGHT_CATEGORY_LABELS[y.weightCategory] : "—"),
  },
  { label: "Thành phần", render: (y) => y.fiberComposition ?? "—" },
  { label: "Độ ấm", render: (y) => scoreLabel(y.warmth) },
  { label: "Độ mềm", render: (y) => scoreLabel(y.softness) },
  { label: "Độ bền", render: (y) => scoreLabel(y.durability) },
  { label: "Độ đàn hồi", render: (y) => scoreLabel(y.stretch) },
  {
    label: "Cách giặt",
    render: (y) => (y.washability ? WASHABILITY_LABELS[y.washability] : "—"),
  },
  {
    label: "Nguy cơ dị ứng",
    render: (y) => (y.allergyRisk ? ALLERGY_RISK_LABELS[y.allergyRisk] : "—"),
  },
  { label: "Công dụng", render: (y) => (y.useCases.length ? y.useCases.join(", ") : "—") },
];

export function ComparisonTable({ yarns }: { yarns: YarnDetail[] }) {
  const sellerMap = new Map<string, string>();
  yarns.forEach((y) =>
    y.priceListings.forEach((l) => sellerMap.set(l.sellerId, l.seller.name)),
  );
  const sellers = Array.from(sellerMap.entries()).sort((a, b) => a[1].localeCompare(b[1], "vi"));

  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="sticky top-0 z-10 min-w-32 bg-card px-4 py-3 text-left font-medium text-foreground/80">
              &nbsp;
            </th>
            {yarns.map((yarn) => (
              <th
                key={yarn.id}
                className="sticky top-0 z-10 min-w-40 border-b border-border bg-card px-4 py-3 text-left"
              >
                <Link href={`/yarn/${yarn.slug}`} className="flex flex-col gap-2 hover:underline">
                  <div className="relative aspect-square w-16 overflow-hidden rounded-lg bg-secondary">
                    {yarn.heroImageUrl && (
                      <Image
                        src={yarn.heroImageUrl}
                        alt={yarn.nameVi}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <span className="font-semibold text-foreground">{yarn.nameVi}</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PROPERTY_ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border">
              <td className="px-4 py-3 font-medium text-foreground/80">{row.label}</td>
              {yarns.map((yarn) => (
                <td key={yarn.id} className="px-4 py-3 text-foreground/90">
                  {row.render(yarn)}
                </td>
              ))}
            </tr>
          ))}

          {sellers.length > 0 && (
            <tr className="border-b border-border bg-secondary/40">
              <td colSpan={yarns.length + 1} className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                Giá theo shop (/100g)
              </td>
            </tr>
          )}
          {sellers.map(([sellerId, sellerName]) => (
            <tr key={sellerId} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground/80">{sellerName}</td>
              {yarns.map((yarn) => {
                const listing = yarn.priceListings.find((l) => l.sellerId === sellerId);
                return (
                  <td key={yarn.id} className="px-4 py-3 text-foreground/90">
                    {listing ? formatVnd(listing.pricePer100g) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
