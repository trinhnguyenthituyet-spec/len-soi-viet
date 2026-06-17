"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StepItem } from "./StepItem";
import type { Step } from "@/types";

export function StepList({ steps }: { steps: Step[] }) {
  const [openOrder, setOpenOrder] = useState<number | null>(steps[0]?.order ?? null);

  if (steps.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Chưa có hướng dẫn từng bước cho mẫu này.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
      {steps.map((step) => {
        const isOpen = openOrder === step.order;
        return (
          <div key={step.id}>
            <button
              type="button"
              onClick={() => setOpenOrder(isOpen ? null : step.order)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-medium text-foreground">
                Bước {step.order}: {step.title}
              </span>
              <span className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")}>
                ⌄
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <StepItem step={step} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
