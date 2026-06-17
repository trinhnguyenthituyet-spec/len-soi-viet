import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { CRAFT_TYPE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import { getPatterns } from "@/lib/pattern-queries";

export default async function AdminPatternsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const { items, total } = await getPatterns({ search, page });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Mẫu đan/móc ({total})</h1>
        <Link
          href="/admin/patterns/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Thêm mẫu mới
        </Link>
      </div>

      <div className="mt-4 max-w-sm">
        <SearchBar placeholder="Tìm theo tên mẫu..." />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-foreground/80">
              <th className="px-4 py-3 font-medium">Tên mẫu</th>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Độ khó</th>
              <th className="px-4 py-3 font-medium">Đã lưu</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((pattern) => (
              <tr key={pattern.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{pattern.title}</td>
                <td className="px-4 py-3 text-foreground/80">{CRAFT_TYPE_LABELS[pattern.craftType]}</td>
                <td className="px-4 py-3 text-foreground/80">{DIFFICULTY_LABELS[pattern.difficulty]}</td>
                <td className="px-4 py-3 text-foreground/80">{pattern.savedCount}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/patterns/${pattern.id}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có mẫu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
