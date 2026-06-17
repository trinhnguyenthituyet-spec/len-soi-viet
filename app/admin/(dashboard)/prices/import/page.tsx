import { PriceImportForm } from "@/components/admin/PriceImportForm";

export default function PriceImportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Import bảng giá từ Excel</h1>
      <p className="mt-1 text-muted-foreground">
        File cần đúng 4 cột: STT, Tên sợi, Tên Shop, Giá/100g. Sợi/shop chưa có sẽ được tự tạo.
      </p>

      <div className="mt-6">
        <PriceImportForm />
      </div>
    </div>
  );
}
