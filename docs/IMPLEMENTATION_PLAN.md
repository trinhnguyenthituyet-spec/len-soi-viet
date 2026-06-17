# Implementation Plan — Sợi Len Việt

> Tham chiếu: [docs/PRD.md](./PRD.md)  
> Cập nhật ngày: 2026-06-17 (v0.3 — chốt format Excel 4 cột, auto-create sợi/shop mới, logo mockup chuột chibi)  
> Ghi chú: Đánh dấu `[x]` khi task hoàn thành

---

## Phase 0 — Setup & Foundation (Tuần 1)

### 0.1 Khởi tạo dự án
- [x] Tạo Next.js project với App Router (`npx create-next-app`) — thực tế dùng **Next.js 16** (xem ghi chú quyết định trong CLAUDE.md/PRD §7), không phải v14 do `@latest` đã lên version mới
- [x] Cấu hình TypeScript strict mode
- [x] Cài đặt và cấu hình Tailwind CSS (v4)
- [ ] Cài đặt shadcn/ui, chọn theme màu sắc phù hợp — *sẽ làm ở mục 0.4*
- [x] Tạo repo GitHub `trinhnguyenthituyet-spec/len-soi-viet` (public), push nhánh `main` — branch strategy `dev` chưa tạo, sẽ tạo khi cần làm việc song song
- [ ] Thiết lập Vercel project, link GitHub auto-deploy — *hoãn: founder tự làm hoặc nhờ hướng dẫn khi sẵn sàng deploy*

### 0.2 Database & Backend
- [ ] Tạo Supabase project (PostgreSQL) — *hoãn: dùng PostgreSQL 17 local (cài qua winget) để dev trước, đổi `DATABASE_URL` sang Supabase khi founder tạo project + sẵn sàng deploy*
- [x] Cài đặt Prisma ORM (v7.8.0), tạo `schema.prisma`
- [x] Định nghĩa models: `YarnType`, `Seller`, `PriceListing`, `PriceImportBatch`, `Pattern`, `Step` (kèm đầy đủ enum theo PRD §4)
- [x] Chạy `prisma migrate dev` — tạo bảng lần đầu (migration `20260617073729_init`, đã verify 6 bảng query được)
- [x] Tạo Prisma Client singleton cho Next.js (`lib/prisma.ts`, dùng driver adapter `@prisma/adapter-pg` theo yêu cầu của Prisma Client v7 thế hệ mới)
- [x] Thiết lập biến môi trường: `.env` (dev, gitignored) + `.env.example` (placeholder để track trong git) — *Vercel env vars hoãn cùng với việc deploy Vercel*

### 0.3 Cấu hình file & image
- [ ] Tạo tài khoản Cloudinary (hoặc dùng Supabase Storage) — *hoãn: chưa có credentials thật, dùng placeholder trong `.env`, founder điền sau*
- [x] Cấu hình Next.js `next.config.ts` cho image domain `res.cloudinary.com`
- [x] Tạo helper upload ảnh (server action `lib/upload-image.ts`) — throw lỗi rõ ràng nếu Cloudinary chưa cấu hình thật, không lỗi lúc build
- [x] Cài đặt `exceljs` cho parse file Excel

### 0.4 Cấu trúc thư mục
- [x] Tạo layout cấu trúc: `app/`, `components/`, `lib/`, `types/`, `public/`
- [x] Tạo file `types/index.ts` export tất cả TypeScript types từ Prisma schema
- [x] Tạo `lib/prisma.ts`, `lib/utils.ts`, `lib/constants.ts`
- [x] *(thêm so với plan gốc)* Cài shadcn/ui (`components/ui/`) + theme pastel ấm (be/hồng nhạt/nâu len) trong `app/globals.css`, build production verify sạch

---

## Phase 1 — Core Features (Tuần 2–6)

### 1.1 Layout & Navigation
- [x] Tạo mockup logo "bé chuột chibi" (SVG đơn giản, `public/mascot-chuot-chibi.svg` + `app/icon.svg` cho favicon) — dùng làm favicon + logo Navbar
- [x] Tạo `app/layout.tsx` — root layout với font tiếng Việt (Google Fonts: Be Vietnam Pro)
- [x] Chọn bảng màu pastel ấm (be, hồng nhạt, nâu len) cho theme Tailwind — *đã làm sớm ở mục 0.4 cùng lúc cài shadcn/ui*
- [x] Tạo `components/Navbar.tsx` — logo chuột chibi, nav links, search bar
- [x] Tạo `components/Footer.tsx` — links, credits
- [x] Tạo trang chủ `app/page.tsx` — hero section + 3 feature blocks
- [x] Mobile menu (hamburger) cho Navbar
- [x] Responsive kiểm tra trên 375px, 768px, 1280px — verify bằng Playwright (chạy tạm qua npx, không thêm vào package.json): phát hiện + sửa lỗi nav bị wrap/đè logo ở đúng 768px (đổi breakpoint nav từ `md` sang `lg`)

### 1.2 Module A — Catalog Len Sợi

#### Trang danh mục sợi (`/yarn`)
- [x] Tạo `app/yarn/page.tsx` — server component, fetch danh sách sợi
- [x] Tạo `components/yarn/YarnCard.tsx` — card hiển thị 1 loại sợi
- [x] Tạo `components/yarn/YarnGrid.tsx` — grid responsive 2/3/4 cols
- [x] Tạo `components/yarn/FilterSidebar.tsx` — bộ lọc phía trái
  - [x] Filter: fiber_category (checkbox group)
  - [x] Filter: weight_category (checkbox group)  
  - [x] Filter: use_cases (tags) — danh sách tag lấy động từ dữ liệu thật (distinct use_cases trong DB)
  - [x] Sort dropdown (A–Z, giá, phổ biến — phổ biến = số shop đang bán)
- [x] Tạo `components/SearchBar.tsx` — debounce search 300ms (component dùng chung, đặt URL query `search`)
- [x] Tạo API route `app/api/yarn/route.ts` — GET với query params (dùng chung logic `lib/yarn-queries.ts` với trang chính)
- [x] Implement pagination — page-based (12 sợi/trang), query param `page`
- [x] Empty state khi không có kết quả — verify bằng Playwright (chạy tạm, đã xóa sau khi xong) với 14 sợi test data: lọc, search, sort, pagination, empty state đều đúng

#### Trang chi tiết sợi (`/yarn/[slug]`)
- [x] Tạo `app/yarn/[slug]/page.tsx` — SSG với `generateStaticParams` (+ `revalidate = 3600` ISR)
- [x] Tạo `components/yarn/YarnHero.tsx` — ảnh + tên + badges
- [x] Tạo `components/yarn/PropertyBadges.tsx` — icon + số cho warmth/softness/durability...
- [x] Tạo `components/yarn/PriceTable.tsx` — bảng so sánh giá các shop
  - [x] Cột: shop | giá/100g | còn hàng | ngày cập nhật
  - [x] Highlight hàng rẻ nhất (trong số còn hàng) — thêm bonus: badge "Giá có thể đã cũ" (`isPriceStale`, >14 ngày) và link "Mua ngay" nếu shop có `url`
  - [x] Badge "Shop mới — chưa xác minh" nếu shop được auto-tạo từ Excel và chưa verified
- [x] Tạo `components/yarn/UseCases.tsx` — list công dụng
- [x] Tab navigation: Mô tả / Giá & Mua / Mẫu phù hợp (`YarnTabs.tsx`, client component)
- [x] Section "Mẫu dùng sợi này" — grid 4-6 mẫu liên quan (`RelatedPatterns.tsx`, bên trong tab "Mẫu phù hợp"; hiện trống vì chưa có Pattern nào — Module C ở mục 1.4)
- [x] SEO metadata (title, description) qua `generateMetadata` + `openGraph` cơ bản — *OG image động (`@vercel/og`) là task riêng ở Phase 2.1, chưa làm ở đây*
- *(đã verify bằng Playwright tạm + data test 14 sợi: tabs, property bars, price table với rẻ nhất/hết hàng/giá cũ/chưa xác minh, badge "Chưa có mô tả", trang 404 khi slug không tồn tại — đều đúng; đã xóa toàn bộ data test khỏi DB sau khi xong)*

### 1.3 Module B — So sánh giá

- [x] Tạo `app/compare/page.tsx` — trang so sánh
- [x] Tạo `components/compare/YarnSelector.tsx` — dropdown chọn sợi (combobox đơn giản bằng `<select>`, tối đa 4 sợi), chip hiển thị + bỏ chọn
- [x] Tạo `components/compare/ComparisonTable.tsx` — bảng so sánh side-by-side
  - [x] Rows: các đặc tính (chất liệu, độ dày, thành phần, warmth/softness/durability/stretch, cách giặt, dị ứng, công dụng) + giá theo từng shop (union các shop của các sợi đã chọn)
  - [x] Sticky header với tên sợi — bảng nằm trong container scroll riêng (`max-h-[70vh] overflow-auto`) để sticky hoạt động đúng; phát hiện + sửa bug: sticky trên `<th>` không có scroll container riêng làm đè lên dòng đầu
- [x] Logic URL state: `/compare?yarns=slug1,slug2,slug3` (giới hạn tối đa 4)
- [x] Nút "Copy link để chia sẻ" — dùng Clipboard API, có try/catch khi quyền clipboard bị chặn
- [x] Nút "So sánh sợi này" trên trang chi tiết sợi — điều hướng đến `/compare?yarns=<slug-hiện-tại>`
- *(verify bằng Playwright tạm: chọn sợi qua dropdown, bảng hiển thị đúng, copy link, điều hướng từ trang chi tiết — đều đúng sau khi sửa 2 bug: import sai làm lộ `pg` vào bundle browser, và sticky header đè dòng đầu; đã xóa data test khỏi DB)*

### 1.4 Module C — Thư viện mẫu

#### Trang danh mục mẫu (`/patterns`)
- [x] Tạo `app/patterns/page.tsx` — server component (cùng `lib/pattern-queries.ts` + `app/api/patterns/route.ts`, kiến trúc giống Module A)
- [x] Tạo `components/pattern/PatternCard.tsx` — card với thumbnail, difficulty badge
- [x] Tạo `components/pattern/PatternGrid.tsx`
- [x] Filter: craft_type (đan/móc), difficulty, category, yarn_weight (`PatternFilterSidebar.tsx`)
- [x] Tag filter: tags phổ biến dạng chip/pill
- [x] Search theo tên mẫu (dùng lại `components/SearchBar.tsx`)

#### Trang chi tiết mẫu (`/patterns/[slug]`)
- [x] Tạo `app/patterns/[slug]/page.tsx` — SSG (`generateStaticParams` + ISR 1h, giống `/yarn/[slug]`)
- [x] Tạo `components/pattern/PatternGallery.tsx` — lightbox ảnh (click mở overlay, prev/next, đóng bằng click ra ngoài/nút X)
- [x] Tạo `components/pattern/PatternInfo.tsx` — overview (độ khó, thời gian, kích cỡ, gauge, kim/móc, lượng sợi)
- [x] Tạo `components/pattern/StepList.tsx` — accordion danh sách các bước (mặc định mở bước 1)
- [x] Tạo `components/pattern/StepItem.tsx` — ảnh + nội dung + tip từng bước
- [x] Nút "Lưu mẫu" — toggle save/unsave, lưu vào localStorage (`SaveButton.tsx` + `lib/use-saved-patterns.ts`)
- [x] Section "Sợi phù hợp" với giá inline (`SuitableYarns.tsx`, dùng quan hệ `suitableYarns` có sẵn trong schema)
- [x] Section "Mẫu tương tự" (cùng category hoặc craft_type, dùng lại `PatternGrid`)
- [x] SEO metadata (title, description, openGraph) — OG image động vẫn để Phase 2.1

#### Trang mẫu đã lưu (`/my-patterns`)
- [x] Tạo `app/my-patterns/page.tsx` — client component đọc localStorage qua `useSavedPatterns`, fetch dữ liệu đầy đủ qua `/api/patterns?ids=...`
- [x] Hiển thị grid mẫu đã lưu (`SavedPatternCard.tsx`)
- [x] Ô ghi chú cá nhân cho từng mẫu (lưu localStorage, lưu khi blur textarea)
- [x] Nút bỏ lưu
- [x] Empty state khi chưa lưu mẫu nào
- *(verify bằng Playwright tạm với 2 mẫu test: filter, accordion, lightbox component dựng đúng, toggle lưu mẫu, ghi chú cá nhân, "Sợi phù hợp" hiển thị giá inline đúng — đều pass; đã xóa data test khỏi DB)*

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
