import Link from "next/link";
import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterSidebar } from "@/components/yarn/FilterSidebar";
import { YarnGrid } from "@/components/yarn/YarnGrid";
import {
  getDistinctUseCases,
  getYarnTypes,
  parseFiberCategories,
  parseWeightCategories,
  type YarnListItem,
  type YarnSort,
} from "@/lib/yarn-queries";
import { SITE_URL } from "@/lib/constants";

function buildItemListJsonLd(items: YarnListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((yarn, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/yarn/${yarn.slug}`,
      name: yarn.nameVi,
    })),
  };
}

export const metadata: Metadata = {
  title: "Catalog len sợi — Sợi Len Việt",
  description: "Tra cứu các loại len sợi phổ biến tại Việt Nam: chất liệu, đặc tính, giá theo shop.",
};

const VALID_SORTS: YarnSort[] = ["name_asc", "price_asc", "popular"];

export default async function YarnCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const toArray = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

  const search = typeof params.search === "string" ? params.search : undefined;
  const fiberCategory = parseFiberCategories(toArray(params.fiberCategory));
  const weightCategory = parseWeightCategories(toArray(params.weightCategory));
  const useCase = toArray(params.useCase);
  const sortParam = typeof params.sort === "string" ? params.sort : undefined;
  const sort = VALID_SORTS.includes(sortParam as YarnSort) ? (sortParam as YarnSort) : "name_asc";
  const page = Math.max(1, Number(params.page) || 1);

  const [{ items, total, totalPages }, useCases] = await Promise.all([
    getYarnTypes({ search, fiberCategory, weightCategory, useCase, sort, page }),
    getDistinctUseCases(),
  ]);

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    fiberCategory.forEach((v) => sp.append("fiberCategory", v));
    weightCategory.forEach((v) => sp.append("weightCategory", v));
    useCase.forEach((v) => sp.append("useCase", v));
    if (sort !== "name_asc") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/yarn?${qs}` : "/yarn";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListJsonLd(items)) }}
      />
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Len sợi" }]} />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Catalog len sợi</h1>
      <p className="mt-1 text-muted-foreground">
        {total} loại sợi {search && <>khớp với &quot;{search}&quot;</>}
      </p>

      <div className="mt-6 max-w-md">
        <SearchBar placeholder="Tìm len sợi theo tên hoặc tag..." />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <FilterSidebar useCases={useCases} />

        <div className="flex flex-col gap-6">
          <YarnGrid yarns={items} />

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
