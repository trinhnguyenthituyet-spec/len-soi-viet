# PRD — Sợi Len Việt (Yarn Catalog & Pattern Hub)

> Phiên bản: 0.3  
> Ngày: 2026-06-17  
> Trạng thái: Đã review — chốt format Excel, brand mockup, không monetization

---

## 1. Tổng quan sản phẩm

**Sợi Len Việt** là web app tổng hợp thông tin các loại len sợi dành cho cộng đồng đan móc Việt Nam. Sản phẩm giải quyết ba nhu cầu cốt lõi:

1. **Tra cứu len sợi** — mô tả chất liệu, đặc tính, công dụng
2. **So sánh giá & nguồn mua** — bảng giá nhiều shop, cập nhật được
3. **Lưu mẫu & hướng dẫn làm** — thư viện mẫu kèm step-by-step

**Đối tượng người dùng:**
- Người mới bắt đầu học đan/móc, chưa biết chọn sợi nào
- Người đã có kinh nghiệm muốn so sánh giá trước khi mua
- Người muốn lưu trữ và chia sẻ mẫu đan/móc yêu thích

**Brand identity (giai đoạn MVP):**
- Chưa có tên thương hiệu chính thức, dùng domain mặc định của Vercel
- Linh vật/mockup logo: **bé chuột chibi dễ thương** — phong cách minh họa đáng yêu, phù hợp đối tượng người dùng (đa số là phụ nữ, yêu thích thủ công và thẩm mỹ ấm áp)
- Định hướng màu sắc: tông pastel ấm (be, hồng nhạt, nâu len) gợi liên tưởng đến sợi len và sự ấm áp, thủ công

---

## 2. Bối cảnh & phân tích cạnh tranh

| Sản phẩm | Điểm mạnh | Điểm yếu |
|---|---|---|
| Ravelry (quốc tế) | Database ~500k mẫu, cộng đồng lớn | UI cũ, không hỗ trợ tiếng Việt, giá VN không có |
| LoveCrafts | UX tốt, bán yarn online | Không có shop VN, giá USD |
| YarnBuddy / Loopsy (app) | Tracker dự án tốt | Không có catalog sợi, không so sánh giá |
| Facebook Groups VN | Cộng đồng sôi nổi | Thông tin phân tán, khó tìm kiếm |

**Khoảng trống:** Chưa có sản phẩm nào kết hợp **catalog sợi tiếng Việt + so sánh giá shop VN + thư viện mẫu** trong một nền tảng.

---

## 3. Mục tiêu sản phẩm (Goals & Non-Goals)

**Goals (MVP):**
- Catalog ≥ 30 loại sợi phổ biến tại VN với mô tả đầy đủ (content do founder tự viết)
- Bảng so sánh giá ≥ 3 shop/sợi, cập nhật hàng tuần qua import file Excel
- Thư viện mẫu có hình ảnh + hướng dẫn từng bước
- Người dùng lưu mẫu yêu thích (không cần đăng ký)
- Giao diện tiếng Việt, mobile-friendly

**Non-Goals (MVP):**
- Mua bán trực tiếp trên web (không phải sàn TMĐT)
- Social feed / comments phức tạp
- App mobile native
- Tích hợp thanh toán

---

## 4. Cấu trúc dữ liệu (Data Model)

### 4.1 YarnType — Loại sợi

```
YarnType {
  id                  UUID
  slug                string (url-friendly, unique)
  name_vi             string        // "Len Merino"
  name_en             string        // "Merino Wool"
  fiber_category      enum          // animal | plant | synthetic | blend
  fiber_composition   string        // "100% Merino" hoặc "80% Merino, 20% Nylon"
  weight_category     enum          // lace | fingering | sport | dk | worsted | bulky | super_bulky
  texture             string[]      // ["mềm mại", "có độ bóng", "dễ bị xù lông"]
  properties {
    warmth            1–5
    softness          1–5
    durability        1–5
    stretch           1–5
    washability       enum          // machine | hand | dry_clean_only
    allergy_risk      enum          // low | medium | high
  }
  use_cases           string[]      // ["áo sweater", "phụ kiện mùa đông", "đồ cho bé"]
  care_instructions   string
  description_vi      text
  pros                string[]
  cons                string[]
  tags                string[]      // ["mùa đông", "người mới", "cao cấp"]
  hero_image_url      string
  created_at          timestamp
  updated_at          timestamp
}
```

### 4.2 Seller — Nguồn bán

```
Seller {
  id          UUID
  name        string        // "Craft Yarn VN" — khớp theo tên trong file Excel (trim, case-insensitive)
  slug        string        // tự sinh từ name khi tạo mới
  type        enum          // online_shop | facebook_page | shopee | lazada | tiki | physical_store | unclassified
  url         string        // nullable — admin bổ sung sau khi auto-tạo từ Excel
  location    string        // nullable
  logo_url    string        // nullable
  verified    boolean       // default false khi auto-tạo, admin set true sau khi xác minh
  notes       string
  created_via enum          // manual | excel_auto_create
  created_at  timestamp
}
```

### 4.3 PriceListing — Bảng giá theo shop (1 dòng = 1 sợi + 1 shop + 1 giá/100g)

```
PriceListing {
  id              UUID
  yarn_type_id    FK → YarnType
  seller_id       FK → Seller
  price_per_100g  integer       // giá VNĐ / 100g — đơn vị chuẩn hóa duy nhất, đúng theo cột "Giá/100g" trong file
  in_stock        boolean       // default true (file Excel không có cột này — xem ghi chú dưới)
  last_verified   date          // ngày của lần import gần nhất chứa dòng này
  source          enum          // manual | excel_import
  import_batch_id FK → PriceImportBatch (nullable nếu nhập tay)
}
```

> **Ghi chú:** File Excel chỉ có 3 cột dữ liệu (Tên sợi, Tên Shop, Giá/100g) + STT. Vì vậy MVP **bỏ** các field `product_name`, `unit`, `weight_grams`, `yards_per_unit`, `url`, `notes` khỏi luồng import — các field này (nếu cần) chỉ điền được qua form nhập tay (D2), không bắt buộc.  
> Vì file không có cột "còn hàng", mặc định mọi dòng import là `in_stock = true`; admin có thể tự tay set `false` nếu cần.

### 4.3a Quy tắc tự tạo mới khi import (auto-create)

Khi 1 dòng trong file có **Tên sợi** hoặc **Tên Shop** chưa tồn tại trong hệ thống, **hệ thống tự tạo mới** (không chặn lại để duyệt tay):

- **Sợi mới** → tạo `YarnType` mới với `name_vi` = giá trị trong file, `slug` tự sinh (slugify tên), các field còn lại (mô tả, tính chất, ảnh...) để **trống / draft** — hiển thị badge "Chưa có mô tả" trên trang sợi cho đến khi founder vào bổ sung nội dung.
- **Shop mới** → tạo `Seller` mới với `name` = giá trị trong file, `type = unclassified`, `verified = false`.
- Vẫn ghi log các dòng "đã tự tạo mới" riêng trong `PriceImportBatch.error_log` (thực chất là "creation_log") để founder biết cần vào bổ sung mô tả/ảnh cho sợi mới hoặc xác minh shop mới.

### 4.3b PriceImportBatch — Lịch sử import file Excel

```
PriceImportBatch {
  id              UUID
  file_name       string        // tên file Excel gốc
  uploaded_at     timestamp
  uploaded_by     string        // admin user
  row_count       integer       // tổng số dòng trong file
  success_count   integer       // số dòng import thành công (bao gồm dòng tự tạo mới)
  new_yarn_count  integer       // số YarnType mới được tự tạo trong lần này
  new_seller_count integer      // số Seller mới được tự tạo trong lần này
  error_count     integer       // số dòng lỗi thật sự (giá không hợp lệ, dòng trống, sai format số...)
  status          enum          // processing | completed | completed_with_errors | failed
  log             json          // chi tiết: dòng nào tạo sợi mới, dòng nào tạo shop mới, dòng nào lỗi + lý do
}
```

> **Lý do thêm bảng này:** mỗi lần admin upload file giá hàng tuần cần biết: bao nhiêu dòng cập nhật giá thành công, bao nhiêu sợi/shop mới vừa được tự tạo (để founder vào bổ sung mô tả/xác minh), và dòng nào lỗi thật (ví dụ giá để trống hoặc không phải số).

### 4.4 Pattern — Mẫu đan/móc

```
Pattern {
  id              UUID
  slug            string
  title           string
  craft_type      enum          // knitting | crochet | both
  difficulty      enum          // beginner | intermediate | advanced
  category        enum          // clothing | accessories | home_decor | amigurumi | baby
  subcategory     string        // "áo len", "túi xách", "thú bông"
  thumbnail_url   string
  images          string[]
  suitable_yarns  FK[] → YarnType
  yarn_weight     enum          // weight phù hợp
  hook_needle_size string
  gauge           string        // "20 mũi x 28 hàng = 10cm x 10cm"
  finished_size   string
  yarn_amount     string        // "200g sợi Worsted"
  time_estimate   string        // "8–12 giờ"
  description     text
  steps           Step[]
  tags            string[]
  source_url      string        // link gốc nếu có
  source_credit   string
  is_original     boolean       // do admin/team tự tạo
  saved_count     integer
  created_at      timestamp
}
```

### 4.5 Step — Bước hướng dẫn (nested trong Pattern)

```
Step {
  order         integer
  title         string
  content       text
  image_url     string
  video_url     string   // optional, YouTube embed
  tip           string   // mẹo nhỏ cho bước này
}
```

### 4.6 UserSavedPattern — Lưu mẫu (local/session, không cần login)

```
UserSavedPattern {
  pattern_id    UUID
  saved_at      timestamp
  notes         string   // ghi chú cá nhân
}
// Lưu ở localStorage, option sync account về sau
```

---

## 5. Tính năng theo module

### Module A: Catalog Len Sợi

**A1 — Trang danh mục (`/yarn`)**
- Lưới card hiển thị các loại sợi, filter/sort được
- Filter: loại chất liệu (len cừu, cotton, acrylic, blend...), độ dày sợi, công dụng, mức giá
- Search full-text theo tên và tags
- Sort: A–Z, giá thấp→cao, phổ biến nhất

**A2 — Trang chi tiết sợi (`/yarn/[slug]`)**
- Hero image + tên, phân loại
- Tab: Mô tả | Giá & Nguồn mua | Mẫu phù hợp
- Property badges: độ ấm, độ mềm, độ bền (dạng icon + số)
- Bảng so sánh giá theo shop: tên shop | giá/50g | giá/100g | còn hàng | link mua
- Ngày cập nhật giá gần nhất
- Section "Dùng sợi này để làm gì?" — list use cases
- Section "Mẫu dùng sợi này" — 4–6 mẫu liên quan

### Module B: So sánh giá

**B1 — Trang so sánh (`/compare`)**
- Chọn 2–4 sợi để so sánh side-by-side
- Bảng so sánh: đặc tính + giá theo từng shop
- Share URL để chia sẻ kết quả so sánh

**B2 — Widget giá trên trang chi tiết**
- Giá đã chuẩn hóa theo /100g ngay từ lúc import, không cần tính lại
- Highlight shop rẻ nhất
- Badge "Còn hàng" / "Hết hàng", badge "Shop chưa xác minh" nếu auto-tạo từ Excel

### Module C: Thư viện mẫu

**C1 — Trang danh mục mẫu (`/patterns`)**
- Grid card có thumbnail, tên, độ khó, craft type (đan/móc)
- Filter: loại sản phẩm, độ khó, loại sợi phù hợp, craft type
- Search theo tên, tags

**C2 — Trang chi tiết mẫu (`/patterns/[slug]`)**
- Gallery ảnh (ảnh thành phẩm)
- Thông tin tổng quan: độ khó, thời gian, kích cỡ, số lượng sợi cần
- Nút "Lưu mẫu này" (lưu localStorage)
- Accordion các bước hướng dẫn (Steps), mỗi bước có ảnh minh họa
- Section "Sợi phù hợp" — link đến trang sợi + so sánh giá ngay tại đây
- Nút "Xem mẫu tương tự"

**C3 — Trang mẫu đã lưu (`/my-patterns`)**
- Danh sách mẫu đã lưu (từ localStorage)
- Ghi chú cá nhân cho mỗi mẫu
- Export PDF (nice-to-have)

### Module D: Admin (CMS đơn giản)

- CRUD YarnType, Seller, Pattern
- Upload ảnh
- Dashboard: số lượt xem, mẫu được lưu nhiều nhất

**D1 — Import bảng giá từ Excel (tính năng trọng tâm)**

Quy trình: admin upload file Excel (`.xlsx`) đã tự collect hàng tuần → hệ thống parse, validate, và update toàn bộ `PriceListing`.

- Trang `/admin/prices/import`
- Upload file `.xlsx` (dùng thư viện `xlsx`/`exceljs` để parse phía server)
- **Format file thật (4 cột, cố định):**

  | STT | Tên sợi | Tên Shop | Giá/100g |
  |---|---|---|---|
  | 1 | Len Merino | Craft Yarn VN | 85000 |
  | 2 | Len Merino | Len Handmade HN | 90000 |
  | 3 | Cotton Cake | Craft Yarn VN | 45000 |

- **Bước xử lý từng dòng:**
  1. Parse file, đọc từng dòng (bỏ qua cột STT)
  2. Tìm `YarnType` theo `name_vi` (so khớp không phân biệt hoa/thường, trim khoảng trắng) — **nếu không có, tự tạo mới** `YarnType` ở trạng thái draft (chỉ có tên, chưa có mô tả/ảnh)
  3. Tìm `Seller` theo `name` (tương tự) — **nếu không có, tự tạo mới** `Seller` với `type = unclassified`, `verified = false`
  4. Validate giá: phải là số dương. Nếu không hợp lệ (trống, chữ, âm) → ghi vào `error_log`, **bỏ qua dòng này** (không tạo gì cả)
  5. Tạo/update `PriceListing` cho cặp (sợi, shop): nếu tuần này đã có record cùng sợi+shop thì update giá + `last_verified`; nếu chưa có thì tạo mới
  6. Ghi nhận toàn bộ kết quả (số dòng OK, số sợi mới, số shop mới, số dòng lỗi) vào `PriceImportBatch`
- **Màn hình kết quả sau import:**
  - Tổng số dòng, số dòng cập nhật giá thành công
  - Danh sách sợi mới vừa tự tạo (để founder vào bổ sung mô tả + ảnh)
  - Danh sách shop mới vừa tự tạo (để founder xác minh / bổ sung link, logo)
  - Bảng dòng lỗi thật (giá không hợp lệ) kèm số dòng trong file gốc
  - Nút "Tải file mẫu" (template Excel chuẩn 4 cột)
- **Lịch sử import:** `/admin/prices/import/history` — danh sách các lần import, ngày, người upload, trạng thái, có thể xem lại log

**D2 — Quản lý giá & bổ sung dữ liệu (thủ công)**
- Form sửa nhanh giá 1 dòng thủ công ngoài chu kỳ import hàng tuần
- Toggle `in_stock` nhanh (vì Excel không có cột này, đây là cách duy nhất đánh dấu hết hàng)
- Trang "Sợi/Shop cần hoàn thiện" — liệt kê các `YarnType`/`Seller` được auto-tạo từ Excel còn thiếu thông tin (mô tả, ảnh, link, type), giúp founder không bỏ sót
- Đánh dấu giá "stale" (quá 14 ngày chưa cập nhật) hiển thị cảnh báo trên trang chi tiết sợi

---

## 6. Yêu cầu phi chức năng

| Yêu cầu | Mục tiêu |
|---|---|
| Performance | LCP < 2.5s, FCP < 1.5s |
| Mobile | Responsive, touch-friendly, min 375px |
| SEO | SSR/SSG cho trang catalog + mẫu |
| Accessibility | WCAG 2.1 AA cơ bản |
| Ngôn ngữ | Tiếng Việt là chính |
| Uptime | 99.5% (hosting đơn giản) |

---

## 7. Tech Stack đề xuất

| Layer | Lựa chọn | Lý do |
|---|---|---|
| Frontend | Next.js 16 (App Router, React 19) | SSR/SSG tốt cho SEO, React ecosystem |
| Styling | Tailwind CSS v4 + shadcn/ui | Nhanh, consistent, mobile-first |
| Backend/API | Next.js API Routes + Prisma | Full-stack trong một repo |
| Database | PostgreSQL (Supabase free tier) | Quan hệ tốt, free tier ổn |
| File/Image | Cloudinary hoặc Supabase Storage | Upload ảnh dễ, CDN có sẵn |
| Excel parsing | `exceljs` hoặc `xlsx` (SheetJS) | Đọc/parse file `.xlsx` phía server |
| Auth (admin) | NextAuth.js | Simple admin login |
| Deployment | Vercel | Zero-config, free tier, dùng domain mặc định `*.vercel.app` (chưa mua domain riêng) |
| Local storage | localStorage (browser) | Lưu mẫu không cần login |

---

## 8. Luồng người dùng chính

```
[Trang chủ]
    ↓
[Tìm sợi phù hợp] → [Chi tiết sợi] → [Xem giá & mua]
                           ↓
                   [Mẫu dùng sợi này] → [Hướng dẫn làm mẫu]
                                               ↓
                                        [Lưu mẫu]
                                               ↓
                                        [Trang mẫu đã lưu]
```

---

## 9. MVP Scope & Phân kỳ

### Phase 1 — MVP (8–10 tuần)
- Catalog 30 loại sợi cơ bản
- Bảng giá 3–5 shop phổ biến tại VN
- Thư viện 20 mẫu đan/móc cơ bản
- Lưu mẫu bằng localStorage
- Admin CRUD cơ bản
- Responsive web

### Phase 2 — Growth
- Tài khoản người dùng (sync mẫu lưu, notes)
- Gửi góp ý cập nhật giá (crowdsource)
- Tính năng đánh giá / review sợi
- So sánh sợi nâng cao (A/B/C)

### Phase 3 — Mở rộng
- App mobile (React Native / PWA)
- Tự động crawl giá từ Shopee/Lazada API (giảm phụ thuộc vào việc collect Excel thủ công)
- Cộng đồng: chia sẻ project đã làm
- Pattern designer upload mẫu

---

## 10. Quyết định đã chốt

- ✅ **Content strategy:** founder tự viết mô tả sợi và hướng dẫn mẫu
- ✅ **Cập nhật giá:** hàng tuần, qua import file Excel 4 cột (STT, Tên sợi, Tên Shop, Giá/100g) — không tự động crawl từ Shopee/Lazada ở MVP
- ✅ **Xử lý sợi/shop mới khi import:** hệ thống **tự động tạo mới** `YarnType`/`Seller` nếu chưa tồn tại, không chặn lại để duyệt tay. Founder sẽ vào bổ sung mô tả/ảnh sau qua trang "Sợi/Shop cần hoàn thiện"
- ✅ **Ảnh:** founder tự chụp toàn bộ ảnh sợi và mẫu — không cần lo bản quyền
- ✅ **Domain:** dùng domain mặc định của Vercel (`*.vercel.app`) ở giai đoạn này, chưa mua domain riêng
- ✅ **Brand/Logo:** chưa có brand chính thức — dùng mockup logo **bé chuột chibi dễ thương** làm linh vật tạm thời cho MVP
- ✅ **Monetization:** không có affiliate link, không commission — link "Mua ngay" (nếu có) chỉ trỏ thẳng đến shop, không qua tracking link nào

> Tất cả câu hỏi mở ở bản trước đã được giải đáp. Tài liệu sẵn sàng để bắt đầu implement.
