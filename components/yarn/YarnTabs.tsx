"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "description", label: "Mô tả" },
  { key: "price", label: "Giá & Mua" },
  { key: "patterns", label: "Mẫu phù hợp" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function YarnTabs({
  description,
  price,
  patterns,
}: {
  description: React.ReactNode;
  price: React.ReactNode;
  patterns: React.ReactNode;
}) {
  const [active, setActive] = useState<TabKey>("description");
  const content: Record<TabKey, React.ReactNode> = { description, price, patterns };

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              active === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">{content[active]}</div>
    </div>
  );
}
