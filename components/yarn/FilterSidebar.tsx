"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FIBER_CATEGORY_LABELS, WEIGHT_CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { YarnSort } from "@/lib/yarn-queries";

const SORT_OPTIONS: { value: YarnSort; label: string }[] = [
  { value: "name_asc", label: "Tên A–Z" },
  { value: "price_asc", label: "Giá thấp → cao" },
  { value: "popular", label: "Phổ biến nhất" },
];

function CheckboxGroup({
  title,
  paramKey,
  options,
  selected,
  onToggle,
}: {
  title: string;
  paramKey: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (key: string, value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-foreground">{title}</legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(paramKey, opt.value)}
              className="h-4 w-4 rounded border-input accent-(--color-primary)"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterSidebar({ useCases }: { useCases: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fiberCategory = searchParams.getAll("fiberCategory");
  const weightCategory = searchParams.getAll("weightCategory");
  const useCase = searchParams.getAll("useCase");
  const sort = (searchParams.get("sort") as YarnSort) ?? "name_asc";

  function toggleMulti(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    next.forEach((v) => params.append(key, v));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const fiberOptions = Object.entries(FIBER_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
  const weightOptions = Object.entries(WEIGHT_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <aside className="flex flex-col gap-6">
      <div>
        <label htmlFor="yarn-sort" className="mb-2 block text-sm font-semibold text-foreground">
          Sắp xếp
        </label>
        <select
          id="yarn-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <CheckboxGroup
        title="Loại chất liệu"
        paramKey="fiberCategory"
        options={fiberOptions}
        selected={fiberCategory}
        onToggle={toggleMulti}
      />

      <CheckboxGroup
        title="Độ dày sợi"
        paramKey="weightCategory"
        options={weightOptions}
        selected={weightCategory}
        onToggle={toggleMulti}
      />

      {useCases.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Công dụng</p>
          <div className="flex flex-wrap gap-2">
            {useCases.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleMulti("useCase", tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  useCase.includes(tag)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card text-foreground/80 hover:bg-accent",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
