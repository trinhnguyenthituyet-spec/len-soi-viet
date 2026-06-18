import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTopSavedPatterns } from "@/lib/pattern-queries";

export default async function AdminDashboardPage() {
  const [yarnCount, patternCount, sellerCount, topPatterns] = await Promise.all([
    prisma.yarnType.count({ where: { deletedAt: null } }),
    prisma.pattern.count({ where: { deletedAt: null } }),
    prisma.seller.count({ where: { deletedAt: null } }),
    getTopSavedPatterns(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Tổng quan dữ liệu hiện có.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-secondary/50 p-5">
          <p className="text-3xl font-bold text-foreground">{yarnCount}</p>
          <p className="text-sm text-muted-foreground">Loại sợi</p>
        </div>
        <div className="rounded-2xl bg-secondary/50 p-5">
          <p className="text-3xl font-bold text-foreground">{patternCount}</p>
          <p className="text-sm text-muted-foreground">Mẫu đan/móc</p>
        </div>
        <div className="rounded-2xl bg-secondary/50 p-5">
          <p className="text-3xl font-bold text-foreground">{sellerCount}</p>
          <p className="text-sm text-muted-foreground">Shop</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Mẫu được lưu nhiều nhất</h2>
        {topPatterns.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có mẫu nào được lưu. Số liệu này tăng khi khách bấm &quot;Lưu mẫu này&quot;
            ở trang công khai.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
            {topPatterns.map((pattern) => (
              <li key={pattern.id} className="flex items-center justify-between px-4 py-3">
                <Link
                  href={`/admin/patterns/${pattern.id}/edit`}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {pattern.title}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {pattern.savedCount} lượt lưu
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
