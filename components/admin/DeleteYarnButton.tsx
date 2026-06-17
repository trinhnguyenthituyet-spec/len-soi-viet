"use client";

import { useTransition } from "react";
import { softDeleteYarnType } from "@/lib/actions/yarn-admin-actions";

export function DeleteYarnButton({ yarnId, yarnName }: { yarnId: string; yarnName: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Xóa sợi "${yarnName}"? Sợi sẽ bị ẩn khỏi catalog nhưng dữ liệu vẫn được giữ lại.`)) {
      return;
    }
    startTransition(() => {
      softDeleteYarnType(yarnId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-medium text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      {pending ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
