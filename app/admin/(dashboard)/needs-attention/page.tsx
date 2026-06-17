import Link from "next/link";
import { getNeedsAttentionSellers, getNeedsAttentionYarns } from "@/lib/price-queries";

export default async function NeedsAttentionPage() {
  const [yarns, sellers] = await Promise.all([
    getNeedsAttentionYarns(),
    getNeedsAttentionSellers(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cần hoàn thiện</h1>
        <p className="mt-1 text-muted-foreground">
          Sợi/shop được tự tạo từ import Excel còn thiếu thông tin.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Sợi chưa có mô tả ({yarns.length})
        </h2>
        {yarns.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tất cả sợi đã có mô tả.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {yarns.map((yarn) => (
              <li key={yarn.id}>
                <Link href={`/admin/yarn/${yarn.id}/edit`} className="text-sm text-primary hover:underline">
                  {yarn.nameVi} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Shop chưa xác minh ({sellers.length})
        </h2>
        {sellers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tất cả shop đã được xác minh.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {sellers.map((seller) => (
              <li key={seller.id}>
                <Link
                  href={`/admin/sellers/${seller.id}/edit`}
                  className="text-sm text-primary hover:underline"
                >
                  {seller.name} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
