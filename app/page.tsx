import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Tra cứu len sợi",
    description:
      "Mô tả chất liệu, đặc tính (độ ấm, độ mềm, độ bền) và công dụng của từng loại sợi — giúp bạn chọn đúng sợi cho mỗi dự án.",
    href: "/yarn",
    cta: "Xem catalog sợi",
  },
  {
    title: "So sánh giá & nguồn mua",
    description:
      "Bảng giá nhiều shop cho cùng một loại sợi, chuẩn hóa theo /100g, cập nhật hàng tuần — dễ dàng tìm nơi bán rẻ nhất.",
    href: "/compare",
    cta: "So sánh giá ngay",
  },
  {
    title: "Lưu mẫu & hướng dẫn làm",
    description:
      "Thư viện mẫu đan/móc kèm hướng dẫn từng bước, lưu mẫu yêu thích ngay trên trình duyệt — không cần đăng ký.",
    href: "/patterns",
    cta: "Khám phá mẫu",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 px-4 py-12 sm:px-6 sm:py-20 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Tìm đúng sợi len,
            <br />
            cho đúng mẫu đan của bạn
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg md:mx-0">
            Sợi Len Việt giúp bạn tra cứu chất liệu, so sánh giá nhiều shop và lưu mẫu đan/móc
            yêu thích — tất cả bằng tiếng Việt, dành riêng cho cộng đồng đan/móc Việt Nam.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/yarn"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Tra cứu len sợi
            </Link>
            <Link
              href="/patterns"
              className="inline-flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Xem thư viện mẫu
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/mascot-chuot-chibi.svg"
            alt="Bé chuột chibi ôm cuộn len — linh vật Sợi Len Việt"
            width={220}
            height={220}
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-card-foreground">{feature.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                {feature.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
