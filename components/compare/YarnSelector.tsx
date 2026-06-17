"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COMPARE_MAX_YARNS } from "@/lib/constants";

export interface YarnOption {
  slug: string;
  nameVi: string;
}

export function YarnSelector({
  options,
  selected,
}: {
  options: YarnOption[];
  selected: YarnOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSlugs = selected.map((s) => s.slug);
  const availableOptions = options.filter((o) => !selectedSlugs.includes(o.slug));
  const atLimit = selected.length >= COMPARE_MAX_YARNS;

  function setSlugs(slugs: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (slugs.length > 0) {
      params.set("yarns", slugs.join(","));
    } else {
      params.delete("yarns");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function addYarn(slug: string) {
    if (!slug || atLimit) return;
    setSlugs([...selectedSlugs, slug]);
  }

  function removeYarn(slug: string) {
    setSlugs(selectedSlugs.filter((s) => s !== slug));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {selected.map((yarn) => (
          <span
            key={yarn.slug}
            className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
          >
            {yarn.nameVi}
            <button
              type="button"
              onClick={() => removeYarn(yarn.slug)}
              aria-label={`Bỏ ${yarn.nameVi} khỏi so sánh`}
              className="text-secondary-foreground/60 hover:text-secondary-foreground"
            >
              ×
            </button>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="text-sm text-muted-foreground">Chưa chọn sợi nào để so sánh.</span>
        )}
      </div>

      <select
        value=""
        disabled={atLimit || availableOptions.length === 0}
        onChange={(e) => addYarn(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-input bg-card px-3 py-2 text-sm disabled:opacity-50"
      >
        <option value="" disabled>
          {atLimit
            ? `Đã chọn tối đa ${COMPARE_MAX_YARNS} sợi`
            : "+ Thêm sợi để so sánh..."}
        </option>
        {availableOptions.map((opt) => (
          <option key={opt.slug} value={opt.slug}>
            {opt.nameVi}
          </option>
        ))}
      </select>
    </div>
  );
}
