"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="vi">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "24px",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 64 }}>😵</span>
          <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 700 }}>
            Sợi Len Việt đang gặp lỗi nghiêm trọng
          </h1>
          <p style={{ marginTop: 8, maxWidth: 420, color: "#6b6b6b" }}>
            Vui lòng thử lại sau ít phút.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              height: 44,
              padding: "0 24px",
              borderRadius: 999,
              backgroundColor: "#c98686",
              color: "white",
              border: "none",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
