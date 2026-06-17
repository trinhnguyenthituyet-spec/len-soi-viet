import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/yarn", label: "Len sợi" },
  { href: "/patterns", label: "Mẫu đan/móc" },
  { href: "/compare", label: "So sánh giá" },
  { href: "/my-patterns", label: "Mẫu đã lưu" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">Sợi Len Việt</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Tra cứu len sợi, so sánh giá nhiều shop và lưu mẫu đan/móc yêu thích — dành cho
            cộng đồng đan/móc Việt Nam.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border px-4 sm:px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sợi Len Việt. Made with 🧶 cho cộng đồng đan/móc Việt Nam.
      </div>
    </footer>
  );
}
