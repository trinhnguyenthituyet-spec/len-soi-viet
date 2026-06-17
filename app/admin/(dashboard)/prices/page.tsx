import Link from "next/link";
import { PriceRowActions } from "@/components/admin/PriceRowActions";
import { formatVnd, isPriceStale } from "@/lib/utils";
import { getAllPriceListings } from "@/lib/price-queries";

export default async function AdminPricesPage() {
  const listings = await getAllPriceListings();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Bảng giá ({listings.length})</h1>
        <Link
          href="/admin/prices/import"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Import Excel
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
              <th className="px-4 py-3 font-medium">Sợi</th>
              <th className="px-4 py-3 font-medium">Shop</th>
              <th className="px-4 py-3 font-medium">Giá/100g</th>
              <th className="px-4 py-3 font-medium">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => {
              const stale = isPriceStale(listing.lastVerified);
              return (
                <tr key={listing.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/admin/yarn/${listing.yarnTypeId}/edit`} className="hover:underline">
                      {listing.yarnType.nameVi}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/80">{listing.seller.name}</td>
                  <td className="px-4 py-3">
                    <PriceRowActions
                      id={listing.id}
                      price={listing.pricePer100g}
                      inStock={listing.inStock}
                    />
                  </td>
                  <td className="px-4 py-3 text-foreground/80">
                    {listing.lastVerified.toLocaleDateString("vi-VN")}
                    {stale && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                        Giá đã cũ
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {listings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có giá nào. Import file Excel để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Định dạng: {formatVnd(0).replace("0", "X")} — sửa giá bằng cách gõ số mới và click ra ngoài ô.
      </p>
    </div>
  );
}
