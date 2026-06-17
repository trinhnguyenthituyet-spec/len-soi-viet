import { notFound } from "next/navigation";
import { SellerForm } from "@/components/admin/SellerForm";
import { updateSeller } from "@/lib/actions/seller-admin-actions";
import { getSellerById } from "@/lib/seller-queries";

export default async function EditSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = await getSellerById(id);

  if (!seller) notFound();

  const action = updateSeller.bind(null, seller.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Sửa: {seller.name}</h1>
      <div className="mt-6 max-w-2xl">
        <SellerForm seller={seller} action={action} />
      </div>
    </div>
  );
}
