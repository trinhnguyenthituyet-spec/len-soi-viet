import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PriceTable } from "@/components/yarn/PriceTable";
import { PropertyBadges } from "@/components/yarn/PropertyBadges";
import { RelatedPatterns } from "@/components/yarn/RelatedPatterns";
import { UseCases } from "@/components/yarn/UseCases";
import { YarnHero } from "@/components/yarn/YarnHero";
import { YarnTabs } from "@/components/yarn/YarnTabs";
import { getAllYarnSlugs, getRelatedPatterns, getYarnBySlug } from "@/lib/yarn-queries";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllYarnSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yarn = await getYarnBySlug(slug);
  if (!yarn) return {};

  const description =
    yarn.descriptionVi ?? `Thông tin chất liệu và giá của ${yarn.nameVi} tại các shop Việt Nam.`;

  return {
    title: `${yarn.nameVi} — Sợi Len Việt`,
    description,
    openGraph: {
      title: yarn.nameVi,
      description,
      images: yarn.heroImageUrl ? [yarn.heroImageUrl] : undefined,
    },
  };
}

export default async function YarnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yarn = await getYarnBySlug(slug);

  if (!yarn) notFound();

  const relatedPatterns = await getRelatedPatterns(yarn.id);

  const hasDescriptionContent =
    yarn.descriptionVi || yarn.careInstructions || yarn.pros.length || yarn.cons.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <YarnHero yarn={yarn} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <YarnTabs
          description={
            hasDescriptionContent ? (
              <div className="flex flex-col gap-4">
                {yarn.descriptionVi && (
                  <p className="leading-relaxed text-foreground/90">{yarn.descriptionVi}</p>
                )}
                {yarn.careInstructions && (
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Hướng dẫn bảo quản</h3>
                    <p className="text-sm text-foreground/80">{yarn.careInstructions}</p>
                  </div>
                )}
                {yarn.pros.length > 0 && (
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Ưu điểm</h3>
                    <ul className="list-inside list-disc text-sm text-foreground/80">
                      {yarn.pros.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {yarn.cons.length > 0 && (
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Nhược điểm</h3>
                    <ul className="list-inside list-disc text-sm text-foreground/80">
                      {yarn.cons.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sợi này chưa có mô tả — founder sẽ bổ sung sớm.
              </p>
            )
          }
          price={<PriceTable yarn={yarn} />}
          patterns={<RelatedPatterns patterns={relatedPatterns} />}
        />

        <div className="flex flex-col gap-6">
          <PropertyBadges yarn={yarn} />
          <UseCases yarn={yarn} />
        </div>
      </div>
    </div>
  );
}
