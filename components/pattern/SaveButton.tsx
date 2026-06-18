"use client";

import { adjustPatternSavedCount } from "@/lib/actions/pattern-save-actions";
import { cn } from "@/lib/utils";
import { useSavedPatterns } from "@/lib/use-saved-patterns";
import { useToast } from "@/components/ui/ToastProvider";

export function SaveButton({ patternId }: { patternId: string }) {
  const { isSaved, toggleSave, hydrated } = useSavedPatterns();
  const { showToast } = useToast();
  const saved = isSaved(patternId);

  function handleClick() {
    const willBeSaved = !saved;
    toggleSave(patternId);
    adjustPatternSavedCount(patternId, willBeSaved ? 1 : -1).catch(() => {});
    showToast(willBeSaved ? "Đã lưu mẫu vào danh sách của bạn" : "Đã bỏ lưu mẫu");
  }

  return (
    <button
      type="button"
      disabled={!hydrated}
      onClick={handleClick}
      className={cn(
        "inline-flex w-fit items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        saved
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "border border-input text-foreground hover:bg-accent",
      )}
    >
      {saved ? "Đã lưu ♥" : "Lưu mẫu này"}
    </button>
  );
}
