import { ImageResponse } from "next/og";
import { getYarnBySlug } from "@/lib/yarn-queries";

export const alt = "Sợi Len Việt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const yarn = await getYarnBySlug(params.slug);
  const title = yarn?.nameVi ?? "Sợi Len Việt";

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
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 36, color: "#b87f7f", marginBottom: 24 }}>🧶 Sợi Len Việt</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#4a3528",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size },
  );
}
