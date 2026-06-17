import { notFound } from "next/navigation";
import { YarnForm } from "@/components/admin/YarnForm";
import { updateYarnType } from "@/lib/actions/yarn-admin-actions";
import { getYarnById } from "@/lib/yarn-queries";

export default async function EditYarnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const yarn = await getYarnById(id);

  if (!yarn) notFound();

  const action = updateYarnType.bind(null, yarn.id, yarn.heroImageUrl);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Sửa: {yarn.nameVi}</h1>
      <div className="mt-6 max-w-2xl">
        <YarnForm yarn={yarn} action={action} />
      </div>
    </div>
  );
}
