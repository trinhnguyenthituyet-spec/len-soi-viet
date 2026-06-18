import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fdf3ea",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🧶</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#4a3528" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 28, color: "#8a6f5e", marginTop: 16 }}>
          Tra cứu & so sánh giá len sợi Việt Nam
        </div>
      </div>
    ),
    { ...size },
  );
}
