import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="text-6xl">🧶</span>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Không tìm thấy trang này</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Có thể đường dẫn đã sai hoặc nội dung đã bị xóa. Thử quay lại trang chủ hoặc tra cứu
        len sợi nhé.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Về trang chủ
        </Link>
        <Link
          href="/yarn"
          className="inline-flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium text-foreground hover:bg-accent"
        >
          Tra cứu len sợi
        </Link>
      </div>
    </div>
  );
}
