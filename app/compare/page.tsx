import type { Metadata } from "next";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { CopyLinkButton } from "@/components/compare/CopyLinkButton";
import { YarnSelector } from "@/components/compare/YarnSelector";
import { COMPARE_MAX_YARNS } from "@/lib/constants";
import { getAllYarnsBasic, getYarnsBySlugList } from "@/lib/yarn-queries";

export const metadata: Metadata = {
  title: "So sánh len sợi — Sợi Len Việt",
  description: "So sánh đặc tính và giá giữa nhiều loại len sợi để chọn đúng sợi cho dự án của bạn.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const yarnsParam = typeof params.yarns === "string" ? params.yarns : undefined;
  const requestedSlugs = (yarnsParam?.split(",").filter(Boolean) ?? []).slice(
    0,
    COMPARE_MAX_YARNS,
  );

  const [allYarns, selectedYarns] = await Promise.all([
    getAllYarnsBasic(),
    getYarnsBySlugList(requestedSlugs),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">So sánh len sợi</h1>
      <p className="mt-1 text-muted-foreground">
        Chọn 2–{COMPARE_MAX_YARNS} loại sợi để so sánh đặc tính và giá theo từng shop.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <YarnSelector
          options={allYarns}
          selected={selectedYarns.map((y) => ({ slug: y.slug, nameVi: y.nameVi }))}
        />
        {selectedYarns.length > 0 && <CopyLinkButton />}
      </div>

      <div className="mt-6">
        {selectedYarns.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Chọn ít nhất 2 loại sợi ở trên để bắt đầu so sánh.
          </p>
        ) : (
          <>
            {selectedYarns.length === 1 && (
              <p className="mb-4 text-sm text-muted-foreground">
                Chọn thêm ít nhất 1 sợi nữa để so sánh side-by-side.
              </p>
            )}
            <ComparisonTable yarns={selectedYarns} />
          </>
        )}
      </div>
    </div>
  );
}
