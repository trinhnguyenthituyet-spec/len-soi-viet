"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CRAFT_TYPE_LABELS,
  DIFFICULTY_LABELS,
  PATTERN_CATEGORY_LABELS,
  WEIGHT_CATEGORY_LABELS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export function PatternFilterSidebar({ tags }: { tags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const craftType = searchParams.getAll("craftType");
  const difficulty = searchParams.getAll("difficulty");
  const category = searchParams.getAll("category");
  const yarnWeight = searchParams.getAll("yarnWeight");
  const tag = searchParams.getAll("tag");

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

  const craftTypeOptions = Object.entries(CRAFT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
  const difficultyOptions = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
  const categoryOptions = Object.entries(PATTERN_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
  const weightOptions = Object.entries(WEIGHT_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <aside className="flex flex-col gap-6">
      <CheckboxGroup
        title="Loại"
        paramKey="craftType"
        options={craftTypeOptions}
        selected={craftType}
        onToggle={toggleMulti}
      />
      <CheckboxGroup
        title="Độ khó"
        paramKey="difficulty"
        options={difficultyOptions}
        selected={difficulty}
        onToggle={toggleMulti}
      />
      <CheckboxGroup
        title="Loại sản phẩm"
        paramKey="category"
        options={categoryOptions}
        selected={category}
        onToggle={toggleMulti}
      />
      <CheckboxGroup
        title="Độ dày sợi phù hợp"
        paramKey="yarnWeight"
        options={weightOptions}
        selected={yarnWeight}
        onToggle={toggleMulti}
      />

      {tags.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleMulti("tag", t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  tag.includes(t)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card text-foreground/80 hover:bg-accent",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
