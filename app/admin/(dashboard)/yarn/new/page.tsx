import { YarnForm } from "@/components/admin/YarnForm";
import { createYarnType } from "@/lib/actions/yarn-admin-actions";

export default function NewYarnPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Thêm sợi mới</h1>
      <div className="mt-6 max-w-2xl">
        <YarnForm action={createYarnType} />
      </div>
    </div>
  );
}
