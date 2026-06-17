# Sợi Len Việt — Project Overview

Web app tổng hợp len sợi cho cộng đồng đan/móc Việt Nam: tra cứu chất liệu, so sánh giá nhiều shop, lưu mẫu và xem hướng dẫn làm.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, React 19) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Images | Cloudinary / Supabase Storage |
| Auth (admin) | NextAuth.js |
| Deployment | Vercel |

## Tài liệu

- 📋 **PRD** (yêu cầu sản phẩm, data model, tính năng): [`docs/PRD.md`](docs/PRD.md)
- ✅ **Implementation Plan** (task list theo phase, thứ tự build): [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)

## Cấu trúc thư mục (dự kiến)

```
/
├── app/              # Next.js App Router pages
│   ├── yarn/         # Catalog sợi
│   ├── patterns/     # Thư viện mẫu
│   ├── compare/      # So sánh giá
│   ├── my-patterns/  # Mẫu đã lưu
│   └── admin/        # CMS admin
├── components/       # React components
├── lib/              # Prisma client, utils
├── prisma/           # Schema + migrations
├── types/            # TypeScript types
└── docs/             # PRD + Plan
```

## Trạng thái: 🟢 Đang build — Phase 0 (Setup & Foundation)
