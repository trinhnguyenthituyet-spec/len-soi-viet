import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ToggleVerifiedButton } from "@/components/admin/ToggleVerifiedButton";
import { SELLER_TYPE_LABELS } from "@/lib/constants";
import { getSellers } from "@/lib/seller-queries";

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sellers = await getSellers(search);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Shop ({sellers.length})</h1>
        <Link
          href="/admin/sellers/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Thêm shop mới
        </Link>
      </div>

      <div className="mt-4 max-w-sm">
        <SearchBar placeholder="Tìm theo tên shop..." />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
              <th className="px-4 py-3 font-medium">Tên shop</th>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{seller.name}</td>
                <td className="px-4 py-3 text-foreground/80">{SELLER_TYPE_LABELS[seller.type]}</td>
                <td className="px-4 py-3">
                  <ToggleVerifiedButton sellerId={seller.id} verified={seller.verified} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/sellers/${seller.id}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Không có shop nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
