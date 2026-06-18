export const SITE_NAME = "Sợi Len Việt";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const PRICE_STALE_DAYS = 14;

export const FIBER_CATEGORY_LABELS: Record<string, string> = {
  animal: "Sợi động vật (len, lông)",
  plant: "Sợi thực vật (cotton, linen)",
  synthetic: "Sợi tổng hợp (acrylic, polyester)",
  blend: "Pha trộn (blend)",
};

export const WEIGHT_CATEGORY_LABELS: Record<string, string> = {
  lace: "Lace",
  fingering: "Fingering",
  sport: "Sport",
  dk: "DK",
  worsted: "Worsted",
  bulky: "Bulky",
  super_bulky: "Super Bulky",
};

export const CRAFT_TYPE_LABELS: Record<string, string> = {
  knitting: "Đan",
  crochet: "Móc",
  both: "Đan & Móc",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Mới bắt đầu",
  intermediate: "Trung bình",
  advanced: "Nâng cao",
};

export const PATTERN_CATEGORY_LABELS: Record<string, string> = {
  clothing: "Quần áo",
  accessories: "Phụ kiện",
  home_decor: "Trang trí nhà",
  amigurumi: "Amigurumi (thú bông)",
  baby: "Đồ cho bé",
};

export const WASHABILITY_LABELS: Record<string, string> = {
  machine: "Giặt máy được",
  hand: "Giặt tay",
  dry_clean_only: "Chỉ giặt khô",
};

export const ALLERGY_RISK_LABELS: Record<string, string> = {
  low: "Ít gây dị ứng",
  medium: "Có thể gây dị ứng",
  high: "Dễ gây dị ứng",
};

export const PROPERTY_LABELS = {
  warmth: "Độ ấm",
  softness: "Độ mềm",
  durability: "Độ bền",
  stretch: "Độ đàn hồi",
} as const;

export const SELLER_TYPE_LABELS: Record<string, string> = {
  online_shop: "Shop online",
  facebook_page: "Trang Facebook",
  shopee: "Shopee",
  lazada: "Lazada",
  tiki: "Tiki",
  physical_store: "Cửa hàng vật lý",
  unclassified: "Chưa phân loại",
};

export const SAVED_PATTERNS_STORAGE_KEY = "soi-len-viet:saved-patterns";

// Ảnh mặc định hiển thị khi sợi/mẫu chưa có ảnh riêng (thay cho chữ "Chưa có ảnh").
export const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/drubj3g1n/image/upload/v1781779641/soi-len-viet/default-yarn-pattern-image.png";

export const COMPARE_MAX_YARNS = 4;
