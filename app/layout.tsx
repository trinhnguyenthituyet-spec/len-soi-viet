import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sợi Len Việt — Tra cứu & so sánh giá len sợi",
  description:
    "Tra cứu chất liệu len sợi, so sánh giá nhiều shop tại Việt Nam, lưu mẫu đan/móc yêu thích và xem hướng dẫn làm từng bước.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTopButton />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
