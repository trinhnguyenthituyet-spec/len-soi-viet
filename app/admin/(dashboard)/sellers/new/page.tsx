import { SellerForm } from "@/components/admin/SellerForm";
import { createSeller } from "@/lib/actions/seller-admin-actions";

export default function NewSellerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Thêm shop mới</h1>
      <div className="mt-6 max-w-2xl">
        <SellerForm action={createSeller} />
      </div>
    </div>
  );
}
