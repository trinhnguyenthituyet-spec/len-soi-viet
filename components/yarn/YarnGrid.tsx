import { YarnCard } from "./YarnCard";
import type { YarnListItem } from "@/lib/yarn-queries";

export function YarnGrid({ yarns }: { yarns: YarnListItem[] }) {
  if (yarns.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="font-medium text-foreground">Không tìm thấy loại sợi nào</p>
        <p className="text-sm text-muted-foreground">
          Thử bỏ một vài bộ lọc hoặc tìm với từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {yarns.map((yarn) => (
        <YarnCard key={yarn.id} yarn={yarn} />
      ))}
    </div>
  );
}
