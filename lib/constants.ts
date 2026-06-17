export const SITE_NAME = "Sợi Len Việt";

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

export const SAVED_PATTERNS_STORAGE_KEY = "soi-len-viet:saved-patterns";
