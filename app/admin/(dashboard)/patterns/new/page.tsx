import { PatternForm } from "@/components/admin/PatternForm";
import { createPattern } from "@/lib/actions/pattern-admin-actions";
import { getAllYarnsBasic } from "@/lib/yarn-queries";

export default async function NewPatternPage() {
  const allYarns = await getAllYarnsBasic();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Thêm mẫu mới</h1>
      <div className="mt-6 max-w-2xl">
        <PatternForm allYarns={allYarns} action={createPattern} />
      </div>
    </div>
  );
}
