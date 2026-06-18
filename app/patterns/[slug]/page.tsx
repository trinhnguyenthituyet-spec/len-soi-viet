import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PatternGallery } from "@/components/pattern/PatternGallery";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternGrid } from "@/components/pattern/PatternGrid";
import { PatternInfo } from "@/components/pattern/PatternInfo";
import { SaveButton } from "@/components/pattern/SaveButton";
import { StepList } from "@/components/pattern/StepList";
import { SuitableYarns } from "@/components/pattern/SuitableYarns";
import { CRAFT_TYPE_LABELS } from "@/lib/constants";
import { getAllPatternSlugs, getPatternBySlug, getSimilarPatterns } from "@/lib/pattern-queries";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPatternSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);
  if (!pattern) return {};

  const description =
    pattern.description ?? `Hướng dẫn làm ${pattern.title} từng bước, kèm sợi phù hợp.`;

  return {
    title: `${pattern.title} — Sợi Len Việt`,
    description,
    openGraph: {
      title: pattern.title,
      description,
      images: pattern.thumbnailUrl ? [pattern.thumbnailUrl] : undefined,
    },
  };
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);

  if (!pattern) notFound();

  const similarPatterns = await getSimilarPatterns(pattern);
  const galleryImages = pattern.thumbnailUrl
    ? [pattern.thumbnailUrl, ...pattern.images]
    : pattern.images;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Mẫu đan/móc", href: "/patterns" },
          { label: pattern.title },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <PatternGallery images={galleryImages} title={pattern.title} />

          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {CRAFT_TYPE_LABELS[pattern.craftType]}
            </span>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{pattern.title}</h1>
            {pattern.description && (
              <p className="leading-relaxed text-foreground/90">{pattern.description}</p>
            )}
            <SaveButton patternId={pattern.id} />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Hướng dẫn từng bước</h2>
            <StepList steps={pattern.steps} />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Sợi phù hợp</h2>
            <SuitableYarns yarns={pattern.suitableYarns} />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Mẫu tương tự</h2>
            <PatternGrid patterns={similarPatterns} />
          </div>
        </div>

        <div>
          <PatternInfo pattern={pattern} />
        </div>
      </div>
    </div>
  );
}
