// Dữ liệu mẫu đan/móc để seed vào DB.
//
// File này CHỈ CHỨA VÍ DỤ MẪU để seed.ts chạy được — KHÔNG phải nội dung thật.
// Theo PRD §10: nội dung hướng dẫn mẫu do founder tự viết. Trước khi seed dữ
// liệu thật, thay toàn bộ mảng dưới đây bằng 20 mẫu thật, giữ đúng shape của
// PatternSeedData. `suitableYarnNames` phải khớp đúng `nameVi` trong
// seed-data/yarns.ts để liên kết đúng quan hệ sợi phù hợp.
import type { CraftType, Difficulty, PatternCategory, WeightCategory } from "../../lib/generated/prisma/client";

export interface PatternStepSeedData {
  order: number;
  title: string;
  content: string;
  tip?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface PatternSeedData {
  title: string;
  craftType: CraftType;
  difficulty: Difficulty;
  category: PatternCategory;
  subcategory?: string;
  thumbnailUrl?: string;
  images?: string[];
  yarnWeight?: WeightCategory;
  hookNeedleSize?: string;
  gauge?: string;
  finishedSize?: string;
  yarnAmount?: string;
  timeEstimate?: string;
  description?: string;
  tags?: string[];
  sourceUrl?: string;
  sourceCredit?: string;
  isOriginal?: boolean;
  suitableYarnNames?: string[];
  steps: PatternStepSeedData[];
}

export const patternSeedData: PatternSeedData[] = [
  {
    title: "Áo Sweater Cơ Bản (VÍ DỤ — thay bằng nội dung thật)",
    craftType: "knitting",
    difficulty: "intermediate",
    category: "clothing",
    yarnWeight: "dk",
    gauge: "20 mũi x 28 hàng = 10cm x 10cm",
    finishedSize: "M (90-96cm ngực)",
    yarnAmount: "600g sợi DK",
    timeEstimate: "20-25 giờ",
    hookNeedleSize: "Kim 4mm",
    description: "VÍ DỤ — viết hướng dẫn tổng quan thật cho mẫu áo sweater cơ bản...",
    tags: ["áo len", "cơ bản"],
    isOriginal: true,
    suitableYarnNames: ["Len Merino (VÍ DỤ — thay bằng nội dung thật)"],
    steps: [
      {
        order: 1,
        title: "Lên mũi",
        content: "VÍ DỤ — viết hướng dẫn chi tiết bước lên mũi thật...",
        tip: "VÍ DỤ — mẹo nhỏ thật cho bước này.",
      },
      {
        order: 2,
        title: "Đan thân trước",
        content: "VÍ DỤ — viết hướng dẫn chi tiết bước đan thân trước thật...",
      },
    ],
  },
];
