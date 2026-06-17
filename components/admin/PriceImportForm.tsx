"use client";

import Link from "next/link";
import { useState } from "react";

interface ImportResult {
  rowCount: number;
  successCount: number;
  newYarnCount: number;
  newSellerCount: number;
  errorCount: number;
  newYarns: { id: string; nameVi: string }[];
  newSellers: { id: string; name: string }[];
  errors: { row: number; reason: string }[];
}

export function PriceImportForm() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/prices/import", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lỗi không xác định.");
      } else {
        setResult(data);
        form.reset();
      }
    } catch {
      setError("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/api/admin/prices/template"
          className="inline-flex h-10 items-center justify-center rounded-full border border-input px-5 text-sm font-medium text-foreground hover:bg-accent"
        >
          Tải file mẫu
        </a>
        <Link
          href="/admin/prices/import/history"
          className="text-sm font-medium text-primary hover:underline"
        >
          Xem lịch sử import →
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground/80">File Excel (.xlsx)</span>
          <input
            type="file"
            name="file"
            accept=".xlsx"
            required
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Đang import..." : "Import"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {result && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Kết quả import</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Tổng số dòng" value={result.rowCount} />
            <Stat label="Thành công" value={result.successCount} />
            <Stat label="Sợi mới" value={result.newYarnCount} />
            <Stat label="Shop mới" value={result.newSellerCount} />
          </div>

          {result.newYarns.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-foreground">
                Sợi mới được tự tạo — vào sửa để bổ sung mô tả
              </h3>
              <ul className="flex flex-col gap-1">
                {result.newYarns.map((y) => (
                  <li key={y.id}>
                    <Link
                      href={`/admin/yarn/${y.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      {y.nameVi} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.newSellers.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-foreground">
                Shop mới được tự tạo — vào xác minh
              </h3>
              <ul className="flex flex-col gap-1">
                {result.newSellers.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/admin/sellers/${s.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      {s.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.errors.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-foreground">
                Dòng lỗi ({result.errorCount})
              </h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-left">
                      <th className="px-3 py-2 font-medium">Dòng</th>
                      <th className="px-3 py-2 font-medium">Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((e) => (
                      <tr key={e.row} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{e.row}</td>
                        <td className="px-3 py-2 text-destructive">{e.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
