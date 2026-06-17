"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/yarn", label: "Sợi" },
  { href: "/admin/sellers", label: "Shop" },
  { href: "/admin/patterns", label: "Mẫu đan/móc" },
  { href: "/admin/prices", label: "Bảng giá" },
  { href: "/admin/prices/import", label: "Import Excel" },
  { href: "/admin/needs-attention", label: "Cần hoàn thiện" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-1 lg:w-56">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-4 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent"
      >
        Đăng xuất
      </button>
    </aside>
  );
}
