"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SELLER_TYPE_LABELS } from "@/lib/constants";
import type { SellerFormState } from "@/lib/actions/seller-admin-actions";
import type { Seller } from "@/types";

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

export function SellerForm({
  seller,
  action,
}: {
  seller?: Seller;
  action: (prevState: SellerFormState | undefined, formData: FormData) => Promise<SellerFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Field label="Tên shop *">
        <input name="name" required defaultValue={seller?.name} className={inputClass} />
      </Field>

      <Field label="Loại shop">
        <select name="type" defaultValue={seller?.type ?? "unclassified"} className={inputClass}>
          {Object.entries(SELLER_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Link shop">
        <input name="url" type="url" defaultValue={seller?.url ?? ""} className={inputClass} />
      </Field>

      <Field label="Địa điểm">
        <input name="location" defaultValue={seller?.location ?? ""} className={inputClass} />
      </Field>

      <Field label="Logo URL">
        <input name="logoUrl" defaultValue={seller?.logoUrl ?? ""} className={inputClass} />
      </Field>

      <Field label="Ghi chú">
        <textarea name="notes" rows={3} defaultValue={seller?.notes ?? ""} className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-foreground/80">
        <input
          type="checkbox"
          name="verified"
          defaultChecked={seller?.verified ?? false}
          className="h-4 w-4 rounded border-input accent-(--color-primary)"
        />
        Đã xác minh
      </label>

      <SubmitButton />
    </form>
  );
}
