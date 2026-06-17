import { notFound } from "next/navigation";
import { PatternForm } from "@/components/admin/PatternForm";
import { updatePattern } from "@/lib/actions/pattern-admin-actions";
import { getPatternById } from "@/lib/pattern-queries";
import { getAllYarnsBasic } from "@/lib/yarn-queries";

export default async function EditPatternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [pattern, allYarns] = await Promise.all([getPatternById(id), getAllYarnsBasic()]);

  if (!pattern) notFound();

  const action = updatePattern.bind(null, pattern.id, pattern.images, pattern.thumbnailUrl);

  const steps = pattern.steps.map((s) => ({
    tempId: s.id,
    order: s.order,
    title: s.title,
    content: s.content,
    tip: s.tip ?? "",
    videoUrl: s.videoUrl ?? "",
    existingImageUrl: s.imageUrl ?? "",
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Sửa: {pattern.title}</h1>
      <div className="mt-6 max-w-2xl">
        <PatternForm
          pattern={{ ...pattern, steps }}
          allYarns={allYarns}
          action={action}
        />
      </div>
    </div>
  );
}
