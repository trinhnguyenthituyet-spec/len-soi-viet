"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CRAFT_TYPE_LABELS,
  DIFFICULTY_LABELS,
  PATTERN_CATEGORY_LABELS,
  WEIGHT_CATEGORY_LABELS,
} from "@/lib/constants";
import type { PatternFormState, StepInput } from "@/lib/actions/pattern-admin-actions";
import { PatternGalleryEditor } from "./PatternGalleryEditor";
import { PatternStepsEditor } from "./PatternStepsEditor";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Đang lưu..." : "Lưu"}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export interface PatternFormPattern {
  title: string;
  craftType: string;
  difficulty: string;
  category: string;
  subcategory: string | null;
  yarnWeight: string | null;
  hookNeedleSize: string | null;
  gauge: string | null;
  finishedSize: string | null;
  yarnAmount: string | null;
  timeEstimate: string | null;
  description: string | null;
  tags: string[];
  sourceUrl: string | null;
  sourceCredit: string | null;
  isOriginal: boolean;
  images: string[];
  suitableYarns: { id: string; nameVi: string }[];
  steps: StepInput[];
}

export function PatternForm({
  pattern,
  allYarns,
  action,
}: {
  pattern?: PatternFormPattern;
  allYarns: { id: string; nameVi: string }[];
  action: (prevState: PatternFormState | undefined, formData: FormData) => Promise<PatternFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const selectedYarnIds = pattern?.suitableYarns.map((y) => y.id) ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên mẫu *">
          <input name="title" required defaultValue={pattern?.title} className={inputClass} />
        </Field>
        <Field label="Loại sản phẩm con">
          <input name="subcategory" defaultValue={pattern?.subcategory ?? ""} className={inputClass} />
        </Field>

        <Field label="Loại (đan/móc)">
          <select name="craftType" defaultValue={pattern?.craftType ?? "knitting"} className={inputClass}>
            {Object.entries(CRAFT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Độ khó">
          <select name="difficulty" defaultValue={pattern?.difficulty ?? "beginner"} className={inputClass}>
            {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Loại sản phẩm">
          <select name="category" defaultValue={pattern?.category ?? "accessories"} className={inputClass}>
            {Object.entries(PATTERN_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Độ dày sợi phù hợp">
          <select name="yarnWeight" defaultValue={pattern?.yarnWeight ?? ""} className={inputClass}>
            <option value="">— Chọn —</option>
            {Object.entries(WEIGHT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Kim/móc">
          <input name="hookNeedleSize" defaultValue={pattern?.hookNeedleSize ?? ""} className={inputClass} />
        </Field>
        <Field label="Gauge">
          <input name="gauge" defaultValue={pattern?.gauge ?? ""} className={inputClass} />
        </Field>

        <Field label="Kích cỡ hoàn thiện">
          <input name="finishedSize" defaultValue={pattern?.finishedSize ?? ""} className={inputClass} />
        </Field>
        <Field label="Lượng sợi cần">
          <input name="yarnAmount" defaultValue={pattern?.yarnAmount ?? ""} className={inputClass} />
        </Field>

        <Field label="Thời gian hoàn thành">
          <input name="timeEstimate" defaultValue={pattern?.timeEstimate ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Mô tả">
        <textarea
          name="description"
          rows={4}
          defaultValue={pattern?.description ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Tags (phân tách bằng dấu phẩy)">
        <input name="tags" defaultValue={pattern?.tags.join(", ") ?? ""} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Link nguồn gốc (nếu không phải mẫu tự thiết kế)">
          <input name="sourceUrl" defaultValue={pattern?.sourceUrl ?? ""} className={inputClass} />
        </Field>
        <Field label="Ghi nguồn tác giả">
          <input name="sourceCredit" defaultValue={pattern?.sourceCredit ?? ""} className={inputClass} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground/80">
        <input
          type="checkbox"
          name="isOriginal"
          defaultChecked={pattern?.isOriginal ?? true}
          className="h-4 w-4 rounded border-input accent-(--color-primary)"
        />
        Mẫu tự thiết kế / tự tạo
      </label>

      <Field label="Sợi phù hợp">
        <select
          name="suitableYarnIds"
          multiple
          defaultValue={selectedYarnIds}
          className={`${inputClass} h-32`}
        >
          {allYarns.map((yarn) => (
            <option key={yarn.id} value={yarn.id}>
              {yarn.nameVi}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">Giữ Ctrl/Cmd để chọn nhiều sợi.</span>
      </Field>

      <Field label="Ảnh thumbnail">
        <input name="thumbnail" type="file" accept="image/*" className={inputClass} />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground/80">Gallery ảnh</p>
        <PatternGalleryEditor existingImages={pattern?.images ?? []} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground/80">Các bước hướng dẫn</p>
        <PatternStepsEditor initialSteps={pattern?.steps ?? []} />
      </div>

      <SubmitButton />
    </form>
  );
}
