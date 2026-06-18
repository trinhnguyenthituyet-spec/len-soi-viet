// Dữ liệu sợi để seed vào DB.
//
// File này CHỈ CHỨA VÍ DỤ MẪU để seed.ts chạy được — KHÔNG phải nội dung thật.
// Theo PRD §10: nội dung mô tả sợi do founder tự viết. Trước khi seed dữ liệu
// thật, thay toàn bộ mảng dưới đây bằng 30 loại sợi thật, giữ đúng shape của
// YarnSeedData.
import type {
  AllergyRisk,
  FiberCategory,
  Washability,
  WeightCategory,
} from "../../lib/generated/prisma/client";

export interface YarnSeedData {
  nameVi: string;
  nameEn?: string;
  fiberCategory?: FiberCategory;
  fiberComposition?: string;
  weightCategory?: WeightCategory;
  texture?: string[];
  warmth?: number;
  softness?: number;
  durability?: number;
  stretch?: number;
  washability?: Washability;
  allergyRisk?: AllergyRisk;
  useCases?: string[];
  careInstructions?: string;
  descriptionVi?: string;
  pros?: string[];
  cons?: string[];
  tags?: string[];
  heroImageUrl?: string;
}

export const yarnSeedData: YarnSeedData[] = [
  {
    nameVi: "Len Merino (VÍ DỤ — thay bằng nội dung thật)",
    nameEn: "Merino Wool",
    fiberCategory: "animal",
    fiberComposition: "100% Merino",
    weightCategory: "dk",
    texture: ["mềm mại", "có độ bóng nhẹ"],
    warmth: 4,
    softness: 5,
    durability: 3,
    stretch: 4,
    washability: "hand",
    allergyRisk: "low",
    useCases: ["áo sweater", "phụ kiện mùa đông"],
    careInstructions: "Giặt tay nước lạnh, không vắt mạnh, phơi nơi thoáng mát tránh nắng trực tiếp.",
    descriptionVi:
      "VÍ DỤ — viết mô tả thật: cảm giác khi sờ, độ ấm thực tế khi mặc, độ phù hợp với người mới đan...",
    pros: ["Rất mềm", "Giữ ấm tốt", "Không gây ngứa"],
    cons: ["Giá cao hơn cotton/acrylic", "Cần giặt tay"],
    tags: ["mùa đông", "cao cấp"],
  },
  {
    nameVi: "Cotton Cake (VÍ DỤ — thay bằng nội dung thật)",
    nameEn: "Cotton",
    fiberCategory: "plant",
    fiberComposition: "100% Cotton",
    weightCategory: "worsted",
    texture: ["mát", "thấm hút tốt"],
    warmth: 2,
    softness: 3,
    durability: 4,
    stretch: 2,
    washability: "machine",
    allergyRisk: "low",
    useCases: ["đồ cho bé", "túi xách"],
    descriptionVi: "VÍ DỤ — viết mô tả thật cho sợi cotton...",
    pros: ["Mát mẻ", "Giặt máy được", "An toàn cho bé"],
    cons: ["Ít co giãn"],
    tags: ["mùa hè", "người mới"],
  },
];
