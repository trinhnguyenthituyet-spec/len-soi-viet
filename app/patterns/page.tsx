import Link from "next/link";
import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternFilterSidebar } from "@/components/pattern/PatternFilterSidebar";
import { PatternGrid } from "@/components/pattern/PatternGrid";
import {
  getDistinctPatternTags,
  getPatterns,
  parseCraftTypes,
  parseDifficulties,
  parsePatternCategories,
  parsePatternYarnWeights,
} from "@/lib/pattern-queries";

export const metadata: Metadata = {
  title: "Thư viện mẫu đan/móc — Sợi Len Việt",
  description: "Khám phá các mẫu đan/móc kèm hướng dẫn từng bước, lọc theo độ khó, loại sản phẩm và sợi phù hợp.",
};

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const toArray = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

  const search = typeof params.search === "string" ? params.search : undefined;
  const craftType = parseCraftTypes(toArray(params.craftType));
  const difficulty = parseDifficulties(toArray(params.difficulty));
  const category = parsePatternCategories(toArray(params.category));
  const yarnWeight = parsePatternYarnWeights(toArray(params.yarnWeight));
  const tag = toArray(params.tag);
  const page = Math.max(1, Number(params.page) || 1);

  const [{ items, total, totalPages }, tags] = await Promise.all([
    getPatterns({ search, craftType, difficulty, category, yarnWeight, tag, page }),
    getDistinctPatternTags(),
  ]);

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    craftType.forEach((v) => sp.append("craftType", v));
    difficulty.forEach((v) => sp.append("difficulty", v));
    category.forEach((v) => sp.append("category", v));
    yarnWeight.forEach((v) => sp.append("yarnWeight", v));
    tag.forEach((v) => sp.append("tag", v));
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/patterns?${qs}` : "/patterns";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Mẫu đan/móc" }]} />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Thư viện mẫu đan/móc</h1>
      <p className="mt-1 text-muted-foreground">
        {total} mẫu {search && <>khớp với &quot;{search}&quot;</>}
      </p>

      <div className="mt-6 max-w-md">
        <SearchBar placeholder="Tìm mẫu theo tên..." />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <PatternFilterSidebar tags={tags} />

        <div className="flex flex-col gap-6">
          <PatternGrid patterns={items} />

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={`rounded-full border border-input px-4 py-2 text-sm ${
                  page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-accent"
                }`}
              >
                Trước
              </Link>
              <span className="text-sm text-muted-foreground">
                Trang {page} / {totalPages}
              </span>
              <Link
                href={pageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className={`rounded-full border border-input px-4 py-2 text-sm ${
                  page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-accent"
                }`}
              >
                Sau
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
