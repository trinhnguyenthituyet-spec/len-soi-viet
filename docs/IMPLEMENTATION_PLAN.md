# Implementation Plan — Sợi Len Việt

> Tham chiếu: [docs/PRD.md](./PRD.md)  
> Cập nhật ngày: 2026-06-17 (v0.3 — chốt format Excel 4 cột, auto-create sợi/shop mới, logo mockup chuột chibi)  
> Ghi chú: Đánh dấu `[x]` khi task hoàn thành

---

## Phase 0 — Setup & Foundation (Tuần 1)

### 0.1 Khởi tạo dự án
- [ ] Tạo Next.js 14 project với App Router (`npx create-next-app`)
- [ ] Cấu hình TypeScript strict mode
- [ ] Cài đặt và cấu hình Tailwind CSS
- [ ] Cài đặt shadcn/ui, chọn theme màu sắc phù hợp
- [ ] Tạo repo GitHub, thiết lập branch strategy (main / dev)
- [ ] Thiết lập Vercel project, link GitHub auto-deploy

### 0.2 Database & Backend
- [ ] Tạo Supabase project (PostgreSQL)
- [ ] Cài đặt Prisma ORM, tạo `schema.prisma`
- [ ] Định nghĩa models: `YarnType`, `Seller`, `PriceListing`, `PriceImportBatch`, `Pattern`, `Step`
- [ ] Chạy `prisma migrate dev` — tạo bảng lần đầu
- [ ] Tạo Prisma Client singleton cho Next.js
- [ ] Thiết lập biến môi trường: `.env.local` + Vercel env vars

### 0.3 Cấu hình file & image
- [ ] Tạo tài khoản Cloudinary (hoặc dùng Supabase Storage)
- [ ] Cấu hình Next.js `next.config.js` cho image domains
- [ ] Tạo helper upload ảnh (server action hoặc API route)
- [ ] Cài đặt `exceljs` (hoặc `xlsx`/SheetJS) cho parse file Excel

### 0.4 Cấu trúc thư mục
- [ ] Tạo layout cấu trúc: `app/`, `components/`, `lib/`, `types/`, `public/`
- [ ] Tạo file `types/index.ts` export tất cả TypeScript types từ Prisma schema
- [ ] Tạo `lib/prisma.ts`, `lib/utils.ts`, `lib/constants.ts`

---

## Phase 1 — Core Features (Tuần 2–6)

### 1.1 Layout & Navigation
- [ ] Tạo mockup logo "bé chuột chibi" (SVG/illustration đơn giản) — dùng làm favicon + logo Navbar
- [ ] Tạo `app/layout.tsx` — root layout với font tiếng Việt (Google Fonts: Be Vietnam Pro)
- [ ] Chọn bảng màu pastel ấm (be, hồng nhạt, nâu len) cho theme Tailwind
- [ ] Tạo `components/Navbar.tsx` — logo chuột chibi, nav links, search bar
- [ ] Tạo `components/Footer.tsx` — links, credits
- [ ] Tạo trang chủ `app/page.tsx` — hero section + 3 feature blocks
- [ ] Mobile menu (hamburger) cho Navbar
- [ ] Responsive kiểm tra trên 375px, 768px, 1280px

### 1.2 Module A — Catalog Len Sợi

#### Trang danh mục sợi (`/yarn`)
- [ ] Tạo `app/yarn/page.tsx` — server component, fetch danh sách sợi
- [ ] Tạo `components/yarn/YarnCard.tsx` — card hiển thị 1 loại sợi
- [ ] Tạo `components/yarn/YarnGrid.tsx` — grid responsive 2/3/4 cols
- [ ] Tạo `components/yarn/FilterSidebar.tsx` — bộ lọc phía trái
  - [ ] Filter: fiber_category (checkbox group)
  - [ ] Filter: weight_category (checkbox group)  
  - [ ] Filter: use_cases (tags)
  - [ ] Sort dropdown (A–Z, giá, phổ biến)
- [ ] Tạo `components/SearchBar.tsx` — debounce search 300ms
- [ ] Tạo API route `app/api/yarn/route.ts` — GET với query params
- [ ] Implement pagination hoặc infinite scroll
- [ ] Empty state khi không có kết quả

#### Trang chi tiết sợi (`/yarn/[slug]`)
- [ ] Tạo `app/yarn/[slug]/page.tsx` — SSG với `generateStaticParams`
- [ ] Tạo `components/yarn/YarnHero.tsx` — ảnh + tên + badges
- [ ] Tạo `components/yarn/PropertyBadges.tsx` — icon + số cho warmth/softness/durability...
- [ ] Tạo `components/yarn/PriceTable.tsx` — bảng so sánh giá các shop
  - [ ] Cột: shop | giá/100g | còn hàng | ngày cập nhật
  - [ ] Highlight hàng rẻ nhất
  - [ ] Badge "Shop mới — chưa xác minh" nếu shop được auto-tạo từ Excel và chưa verified
- [ ] Tạo `components/yarn/UseCases.tsx` — list công dụng
- [ ] Tab navigation: Mô tả / Giá & Mua / Mẫu phù hợp
- [ ] Section "Mẫu dùng sợi này" — grid 4 mẫu liên quan
- [ ] SEO metadata (title, description, OG image)

### 1.3 Module B — So sánh giá

- [ ] Tạo `app/compare/page.tsx` — trang so sánh
- [ ] Tạo `components/compare/YarnSelector.tsx` — combobox chọn sợi
- [ ] Tạo `components/compare/ComparisonTable.tsx` — bảng so sánh side-by-side
  - [ ] Rows: các đặc tính + giá theo shop
  - [ ] Sticky header với tên sợi
- [ ] Logic URL state: `/compare?yarns=slug1,slug2,slug3`
- [ ] Nút "Copy link để chia sẻ"
- [ ] Nút "So sánh sợi này" trên trang chi tiết sợi

### 1.4 Module C — Thư viện mẫu

#### Trang danh mục mẫu (`/patterns`)
- [ ] Tạo `app/patterns/page.tsx` — server component
- [ ] Tạo `components/pattern/PatternCard.tsx` — card với thumbnail, difficulty badge
- [ ] Tạo `components/pattern/PatternGrid.tsx`
- [ ] Filter: craft_type (đan/móc), difficulty, category, yarn_weight
- [ ] Tag filter: tags phổ biến dạng chip/pill
- [ ] Search theo tên mẫu

#### Trang chi tiết mẫu (`/patterns/[slug]`)
- [ ] Tạo `app/patterns/[slug]/page.tsx` — SSG
- [ ] Tạo `components/pattern/PatternGallery.tsx` — lightbox ảnh
- [ ] Tạo `components/pattern/PatternInfo.tsx` — overview (độ khó, thời gian, kích cỡ)
- [ ] Tạo `components/pattern/StepList.tsx` — accordion danh sách các bước
- [ ] Tạo `components/pattern/StepItem.tsx` — ảnh + nội dung + tip từng bước
- [ ] Nút "Lưu mẫu" — toggle save/unsave, lưu vào localStorage
- [ ] Section "Sợi phù hợp" với giá inline
- [ ] Section "Mẫu tương tự"
- [ ] SEO metadata

#### Trang mẫu đã lưu (`/my-patterns`)
- [ ] Tạo `app/my-patterns/page.tsx` — client component đọc localStorage
- [ ] Hiển thị grid mẫu đã lưu
- [ ] Ô ghi chú cá nhân cho từng mẫu (lưu localStorage)
- [ ] Nút bỏ lưu
- [ ] Empty state khi chưa lưu mẫu nào

### 1.5 Module D — Admin CMS

#### Setup Admin
- [ ] Cài đặt NextAuth.js — email/password login đơn giản
- [ ] Tạo admin user seed trong database
- [ ] Tạo middleware bảo vệ route `/admin/*`
- [ ] Tạo `app/admin/layout.tsx` — admin sidebar layout
- [ ] Trang đăng nhập admin `/admin/login`

#### CRUD YarnType
- [ ] Danh sách sợi `/admin/yarn` — table với search + filter
- [ ] Form tạo mới `/admin/yarn/new`
- [ ] Form chỉnh sửa `/admin/yarn/[id]/edit`
- [ ] Upload ảnh hero
- [ ] Xóa (soft delete)

#### CRUD Seller
- [ ] Danh sách shop `/admin/sellers`
- [ ] Form thêm/sửa shop
- [ ] Toggle verified status

#### Import & quản lý giá (Excel — tính năng trọng tâm)
- [ ] Thiết kế template Excel chuẩn 4 cột: STT, Tên sợi, Tên Shop, Giá/100g
- [ ] Tạo file template mẫu `.xlsx` để admin download tại `/admin/prices/import`
- [ ] Trang `/admin/prices/import` — UI upload file
- [ ] API route `app/api/admin/prices/import/route.ts` — nhận file, xử lý server-side
- [ ] Viết hàm parse Excel → array object (dùng `exceljs`), bỏ qua cột STT
- [ ] Viết hàm tìm-hoặc-tạo (find-or-create) cho từng dòng:
  - [ ] Tìm `YarnType` theo `name_vi` (case-insensitive, trim) — nếu không có, tạo mới với slug tự sinh, các field mô tả để trống/draft
  - [ ] Tìm `Seller` theo `name` (case-insensitive, trim) — nếu không có, tạo mới với `type = unclassified`, `verified = false`
  - [ ] Validate giá: phải là số dương — nếu không hợp lệ, ghi vào error log và bỏ qua dòng đó (không tạo gì)
- [ ] Logic update `PriceListing`: nếu đã có record cùng sợi+shop thì update giá + `last_verified`; nếu chưa có thì tạo mới, set `source = excel_import`
- [ ] Lưu kết quả vào `PriceImportBatch` (row_count, success_count, new_yarn_count, new_seller_count, error_count, log)
- [ ] Trang kết quả sau import:
  - [ ] Tổng quan số dòng xử lý thành công
  - [ ] Danh sách sợi mới vừa tự tạo (link nhanh đến trang edit để bổ sung mô tả)
  - [ ] Danh sách shop mới vừa tự tạo (link nhanh đến trang edit để xác minh)
  - [ ] Bảng dòng lỗi thật (giá không hợp lệ) kèm số dòng gốc
- [ ] Trang `/admin/prices/import/history` — danh sách các lần import trước đó
- [ ] Trang `/admin/prices` — xem toàn bộ `PriceListing` hiện tại, filter theo sợi/shop
- [ ] Trang `/admin/needs-attention` — liệt kê `YarnType`/`Seller` được auto-tạo còn thiếu mô tả/ảnh/thông tin
- [ ] Form sửa nhanh 1 dòng giá thủ công (ngoài chu kỳ import hàng tuần)
- [ ] Toggle `in_stock` nhanh trên danh sách (vì Excel không có cột này)
- [ ] Badge cảnh báo "Giá đã cũ" nếu `last_verified` quá 14 ngày (hiển thị cả ở admin và trang chi tiết sợi)

#### CRUD Pattern
- [ ] Danh sách mẫu `/admin/patterns`
- [ ] Form tạo/sửa mẫu — rich text editor cho description
- [ ] Quản lý Steps — drag-drop reorder (hoặc đơn giản hơn: up/down buttons)
- [ ] Upload nhiều ảnh cho gallery + step images
- [ ] Link mẫu → sợi phù hợp (multi-select)

#### Admin Dashboard
- [ ] Trang `/admin` — số liệu: tổng sợi, mẫu, lượt xem hôm nay
- [ ] Danh sách mẫu được lưu nhiều nhất

---

## Phase 2 — Polish & SEO (Tuần 7–8)

### 2.1 SEO & Performance
- [ ] Tạo `sitemap.xml` động (Next.js sitemap)
- [ ] Tạo `robots.txt`
- [ ] OG image cho từng trang (dùng `@vercel/og`)
- [ ] Structured data JSON-LD cho catalog sợi
- [ ] Kiểm tra Core Web Vitals với Lighthouse
- [ ] Tối ưu ảnh: lazy loading, blur placeholder, WebP

### 2.2 UX Polish
- [ ] Loading skeleton cho danh sách sợi và mẫu
- [ ] Error boundary + error pages (404, 500)
- [ ] Toast notifications (lưu mẫu thành công, copy link...)
- [ ] Scroll to top button
- [ ] Breadcrumb navigation
- [ ] "Back to top" khi scroll dài trên trang chi tiết

### 2.3 Content Seed
- [ ] Viết nội dung 30 loại sợi cơ bản (founder tự viết: mô tả, đặc tính, công dụng)
- [ ] Chuẩn bị file Excel giá đầu tiên theo template chuẩn, import thử qua `/admin/prices/import`
- [ ] Kiểm tra kết quả import đầu tiên — sửa lỗi mapping tên sợi/shop nếu có
- [ ] Tạo 20 mẫu đan/móc cơ bản với hướng dẫn (founder tự viết)
- [ ] Chuẩn bị ảnh cho tất cả sợi và mẫu
- [ ] Tạo seed script `prisma/seed.ts` (cho YarnType, Pattern — không seed PriceListing vì sẽ import qua Excel)

### 2.4 Testing
- [ ] Unit test cho utils functions (tính giá/100g, filter logic)
- [ ] Unit test cho hàm parse & validate Excel import (file đúng format, file thiếu cột, file sai tên sợi/shop, file rỗng)
- [ ] Integration test cho API routes chính (bao gồm `/api/admin/prices/import`)
- [ ] Manual testing: luồng người dùng đầu-cuối trên mobile
- [ ] Cross-browser: Chrome, Safari, Firefox

---

## Phase 3 — Launch (Tuần 9–10)

### 3.1 Pre-launch
- [ ] (Tùy chọn, không bắt buộc cho MVP) Thiết lập domain riêng nếu cần — MVP dùng domain mặc định `*.vercel.app`
- [ ] Cấu hình SSL (tự động với Vercel)
- [ ] Kiểm tra tất cả links không bị 404
- [ ] Kiểm tra form admin hoạt động đúng trên production
- [ ] Backup database trước launch

### 3.2 Monitoring
- [ ] Tích hợp Vercel Analytics (page views, traffic)
- [ ] Tích hợp Sentry (error tracking, free tier)
- [ ] Thiết lập alert khi site down

### 3.3 Sau launch
- [ ] Announce trong các Facebook group đan/móc VN
- [ ] Thu thập feedback người dùng đầu tiên
- [ ] Lập backlog cho Phase 2 (tài khoản người dùng, crowdsource giá)

---

## Checklist phụ thuộc quan trọng

```
Database schema ──→ API routes ──→ UI components
                         ↓
                  Admin CRUD ──→ Seed data ──→ Frontend có data thật
```

**Thứ tự ưu tiên bắt buộc:**
1. Database schema + Prisma migrate
2. API routes (GET) cho yarn và patterns
3. Trang danh sách → trang chi tiết
4. Admin CRUD để nhập data
5. Lưu mẫu (localStorage)
6. So sánh giá
7. SEO + polish

---

## Ước tính thời gian

| Phase | Tuần | Effort |
|---|---|---|
| Phase 0 — Setup | 1 | ~20h |
| Phase 1 — Core features | 2–6 | ~80h |
| Phase 2 — Polish + Content | 7–8 | ~30h |
| Phase 3 — Launch | 9–10 | ~15h |
| **Tổng** | **10 tuần** | **~145h** |

> Ước tính với 1 developer làm part-time (~15h/tuần).  
> Nếu full-time (~40h/tuần), có thể xong trong 4 tuần.
