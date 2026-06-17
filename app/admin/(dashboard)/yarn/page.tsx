import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { DeleteYarnButton } from "@/components/admin/DeleteYarnButton";
import { FIBER_CATEGORY_LABELS, WEIGHT_CATEGORY_LABELS } from "@/lib/constants";
import { getYarnTypes } from "@/lib/yarn-queries";

export default async function AdminYarnListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const { items, total } = await getYarnTypes({ search, page });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Sợi ({total})</h1>
        <Link
          href="/admin/yarn/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Thêm sợi mới
        </Link>
      </div>

      <div className="mt-4 max-w-sm">
        <SearchBar placeholder="Tìm theo tên sợi..." />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
              <th className="px-4 py-3 font-medium">Tên sợi</th>
              <th className="px-4 py-3 font-medium">Chất liệu</th>
              <th className="px-4 py-3 font-medium">Độ dày</th>
              <th className="px-4 py-3 font-medium">Mô tả</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((yarn) => (
              <tr key={yarn.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{yarn.nameVi}</td>
                <td className="px-4 py-3 text-foreground/80">
                  {yarn.fiberCategory ? FIBER_CATEGORY_LABELS[yarn.fiberCategory] : "—"}
                </td>
                <td className="px-4 py-3 text-foreground/80">
                  {yarn.weightCategory ? WEIGHT_CATEGORY_LABELS[yarn.weightCategory] : "—"}
                </td>
                <td className="px-4 py-3">
                  {yarn.descriptionVi ? (
                    <span className="text-foreground/80">Đã có</span>
                  ) : (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      Chưa có mô tả
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/yarn/${yarn.id}/edit`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Sửa
                    </Link>
                    <DeleteYarnButton yarnId={yarn.id} yarnName={yarn.nameVi} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Không có sợi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
