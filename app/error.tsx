"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="text-6xl">😵</span>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Đã có lỗi xảy ra</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Rất xin lỗi, trang gặp lỗi không mong muốn. Thử lại hoặc về trang chủ.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Thử lại
        </button>
        <a
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium text-foreground hover:bg-accent"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
