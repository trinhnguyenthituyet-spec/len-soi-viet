"use client";

import { useEffect, useState } from "react";
import { SavedPatternCard } from "@/components/pattern/SavedPatternCard";
import { adjustPatternSavedCount } from "@/lib/actions/pattern-save-actions";
import type { PatternListItem } from "@/lib/pattern-queries";
import { useSavedPatterns } from "@/lib/use-saved-patterns";

export default function MyPatternsPage() {
  const { entries, hydrated, removeSaved, updateNotes } = useSavedPatterns();
  const [patterns, setPatterns] = useState<PatternListItem[]>([]);
  const [loading, setLoading] = useState(true);

  function handleRemove(patternId: string) {
    removeSaved(patternId);
    adjustPatternSavedCount(patternId, -1).catch(() => {});
  }

  useEffect(() => {
    if (!hydrated) return;
    if (entries.length === 0) {
      setPatterns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ids = entries.map((e) => e.patternId).join(",");
    fetch(`/api/patterns?ids=${encodeURIComponent(ids)}`)
      .then((res) => res.json())
      .then((data) => setPatterns(data.items))
      .finally(() => setLoading(false));
  }, [hydrated, entries]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Mẫu đã lưu</h1>
      <p className="mt-1 text-muted-foreground">
        Mẫu được lưu trên trình duyệt này — không đồng bộ giữa các thiết bị.
      </p>

      <div className="mt-6">
        {!hydrated || loading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : patterns.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-medium text-foreground">Bạn chưa lưu mẫu nào</p>
            <p className="text-sm text-muted-foreground">
              Vào trang chi tiết mẫu và bấm &quot;Lưu mẫu này&quot; để thêm vào đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {patterns.map((pattern) => {
              const entry = entries.find((e) => e.patternId === pattern.id);
              if (!entry) return null;
              return (
                <SavedPatternCard
                  key={pattern.id}
                  pattern={pattern}
                  entry={entry}
                  onRemove={handleRemove}
                  onNotesChange={updateNotes}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
