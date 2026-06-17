import { formatVnd, isPriceStale } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { YarnDetail } from "@/lib/yarn-queries";

export function PriceTable({ yarn }: { yarn: YarnDetail }) {
  const listings = yarn.priceListings;

  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có thông tin giá cho sợi này.
      </p>
    );
  }

  const cheapestId = listings
    .filter((l) => l.inStock)
    .sort((a, b) => a.pricePer100g - b.pricePer100g)[0]?.id;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
            <th className="px-4 py-3 font-medium">Shop</th>
            <th className="px-4 py-3 font-medium">Giá/100g</th>
            <th className="px-4 py-3 font-medium">Tình trạng</th>
            <th className="px-4 py-3 font-medium">Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => {
            const isCheapest = listing.id === cheapestId;
            const stale = isPriceStale(listing.lastVerified);
            return (
              <tr
                key={listing.id}
                className={cn(
                  "border-b border-border last:border-0",
                  isCheapest && "bg-accent/40",
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {listing.seller.url ? (
                      <a
                        href={listing.seller.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-medium text-foreground hover:underline"
                      >
                        {listing.seller.name}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground">{listing.seller.name}</span>
                    )}
                    {!listing.seller.verified && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        Shop mới — chưa xác minh
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("font-medium", isCheapest && "text-primary")}>
                    {formatVnd(listing.pricePer100g)}
                  </span>
                  {isCheapest && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      Rẻ nhất
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {listing.inStock ? (
                    <span className="text-foreground/80">Còn hàng</span>
                  ) : (
                    <span className="text-muted-foreground">Hết hàng</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground/80">
                  {listing.lastVerified.toLocaleDateString("vi-VN")}
                  {stale && (
                    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      Giá có thể đã cũ
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
