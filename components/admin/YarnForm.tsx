"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  ALLERGY_RISK_LABELS,
  FIBER_CATEGORY_LABELS,
  WASHABILITY_LABELS,
  WEIGHT_CATEGORY_LABELS,
} from "@/lib/constants";
import type { YarnFormState } from "@/lib/actions/yarn-admin-actions";
import type { YarnType } from "@/types";

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

export function YarnForm({
  yarn,
  action,
}: {
  yarn?: YarnType;
  action: (prevState: YarnFormState | undefined, formData: FormData) => Promise<YarnFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên sợi (tiếng Việt) *">
          <input
            name="nameVi"
            required
            defaultValue={yarn?.nameVi}
            className={inputClass}
          />
        </Field>
        <Field label="Tên sợi (tiếng Anh)">
          <input name="nameEn" defaultValue={yarn?.nameEn ?? ""} className={inputClass} />
        </Field>

        <Field label="Loại chất liệu">
          <select name="fiberCategory" defaultValue={yarn?.fiberCategory ?? ""} className={inputClass}>
            <option value="">— Chọn —</option>
            {Object.entries(FIBER_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Độ dày sợi">
          <select name="weightCategory" defaultValue={yarn?.weightCategory ?? ""} className={inputClass}>
            <option value="">— Chọn —</option>
            {Object.entries(WEIGHT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Thành phần (VD: 100% Merino)">
          <input
            name="fiberComposition"
            defaultValue={yarn?.fiberComposition ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Đặc điểm bề mặt (phân tách bằng dấu phẩy)">
          <input name="texture" defaultValue={yarn?.texture.join(", ") ?? ""} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Độ ấm (1-5)">
          <input
            type="number"
            min={1}
            max={5}
            name="warmth"
            defaultValue={yarn?.warmth ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Độ mềm (1-5)">
          <input
            type="number"
            min={1}
            max={5}
            name="softness"
            defaultValue={yarn?.softness ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Độ bền (1-5)">
          <input
            type="number"
            min={1}
            max={5}
            name="durability"
            defaultValue={yarn?.durability ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Độ đàn hồi (1-5)">
          <input
            type="number"
            min={1}
            max={5}
            name="stretch"
            defaultValue={yarn?.stretch ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cách giặt">
          <select name="washability" defaultValue={yarn?.washability ?? ""} className={inputClass}>
            <option value="">— Chọn —</option>
            {Object.entries(WASHABILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nguy cơ dị ứng">
          <select name="allergyRisk" defaultValue={yarn?.allergyRisk ?? ""} className={inputClass}>
            <option value="">— Chọn —</option>
            {Object.entries(ALLERGY_RISK_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Công dụng (phân tách bằng dấu phẩy)">
        <input name="useCases" defaultValue={yarn?.useCases.join(", ") ?? ""} className={inputClass} />
      </Field>

      <Field label="Mô tả">
        <textarea
          name="descriptionVi"
          rows={4}
          defaultValue={yarn?.descriptionVi ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Hướng dẫn bảo quản">
        <textarea
          name="careInstructions"
          rows={2}
          defaultValue={yarn?.careInstructions ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ưu điểm (phân tách bằng dấu phẩy)">
          <input name="pros" defaultValue={yarn?.pros.join(", ") ?? ""} className={inputClass} />
        </Field>
        <Field label="Nhược điểm (phân tách bằng dấu phẩy)">
          <input name="cons" defaultValue={yarn?.cons.join(", ") ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Tags (phân tách bằng dấu phẩy)">
        <input name="tags" defaultValue={yarn?.tags.join(", ") ?? ""} className={inputClass} />
      </Field>

      <Field label="Ảnh hero">
        <input name="heroImage" type="file" accept="image/*" className={inputClass} />
        {yarn?.heroImageUrl && (
          <span className="text-xs text-muted-foreground">
            Đang dùng ảnh hiện tại — chọn ảnh mới để thay thế.
          </span>
        )}
      </Field>

      <SubmitButton />
    </form>
  );
}
