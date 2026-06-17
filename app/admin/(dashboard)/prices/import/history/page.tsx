import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  completed_with_errors: "Hoàn thành (có lỗi)",
  failed: "Thất bại",
};

export default async function PriceImportHistoryPage() {
  const batches = await prisma.priceImportBatch.findMany({
    orderBy: { uploadedAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Lịch sử import giá</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium">Ngày</th>
              <th className="px-4 py-3 font-medium">Người upload</th>
              <th className="px-4 py-3 font-medium">Dòng / Thành công</th>
              <th className="px-4 py-3 font-medium">Sợi mới / Shop mới</th>
              <th className="px-4 py-3 font-medium">Lỗi</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{batch.fileName}</td>
                <td className="px-4 py-3 text-foreground/80">
                  {batch.uploadedAt.toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-foreground/80">{batch.uploadedBy}</td>
                <td className="px-4 py-3 text-foreground/80">
                  {batch.rowCount} / {batch.successCount}
                </td>
                <td className="px-4 py-3 text-foreground/80">
                  {batch.newYarnCount} / {batch.newSellerCount}
                </td>
                <td className="px-4 py-3 text-foreground/80">{batch.errorCount}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {STATUS_LABELS[batch.status]}
                  </span>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có lần import nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
