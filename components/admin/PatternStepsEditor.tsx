"use client";

import { useState } from "react";
import type { StepInput } from "@/lib/actions/pattern-admin-actions";

const inputClass =
  "rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function makeTempId() {
  return Math.random().toString(36).slice(2);
}

export function PatternStepsEditor({ initialSteps = [] }: { initialSteps?: StepInput[] }) {
  const [steps, setSteps] = useState<StepInput[]>(initialSteps);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        tempId: makeTempId(),
        order: prev.length + 1,
        title: "",
        content: "",
        tip: "",
        videoUrl: "",
        existingImageUrl: "",
      },
    ]);
  }

  function removeStep(tempId: string) {
    setSteps((prev) =>
      prev
        .filter((s) => s.tempId !== tempId)
        .map((s, i) => ({ ...s, order: i + 1 })),
    );
  }

  function moveStep(tempId: string, direction: -1 | 1) {
    setSteps((prev) => {
      const index = prev.findIndex((s) => s.tempId === tempId);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((s, i) => ({ ...s, order: i + 1 }));
    });
  }

  function updateStep(tempId: string, patch: Partial<StepInput>) {
    setSteps((prev) => prev.map((s) => (s.tempId === tempId ? { ...s, ...patch } : s)));
  }

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="stepsJson" value={JSON.stringify(steps)} />

      {steps.map((step, i) => (
        <div key={step.tempId} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Bước {i + 1}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveStep(step.tempId, -1)}
                disabled={i === 0}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveStep(step.tempId, 1)}
                disabled={i === steps.length - 1}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeStep(step.tempId)}
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Xóa
              </button>
            </div>
          </div>

          <input
            placeholder="Tiêu đề bước"
            value={step.title}
            onChange={(e) => updateStep(step.tempId, { title: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Nội dung hướng dẫn"
            rows={2}
            value={step.content}
            onChange={(e) => updateStep(step.tempId, { content: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Mẹo nhỏ (tùy chọn)"
            value={step.tip}
            onChange={(e) => updateStep(step.tempId, { tip: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Link video YouTube (tùy chọn)"
            value={step.videoUrl}
            onChange={(e) => updateStep(step.tempId, { videoUrl: e.target.value })}
            className={inputClass}
          />
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Ảnh cho bước này</span>
            <input type="file" name={`stepImage_${step.tempId}`} accept="image/*" className={inputClass} />
            {step.existingImageUrl && (
              <span className="text-xs text-muted-foreground">Đang dùng ảnh hiện tại nếu không chọn ảnh mới.</span>
            )}
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="inline-flex w-fit items-center justify-center rounded-full border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
      >
        + Thêm bước
      </button>
    </div>
  );
}
