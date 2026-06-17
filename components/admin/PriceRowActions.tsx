"use client";

import { useState, useTransition } from "react";
import { toggleInStock, updatePriceListing } from "@/lib/actions/price-admin-actions";
import { cn } from "@/lib/utils";

export function PriceRowActions({
  id,
  price,
  inStock,
}: {
  id: string;
  price: number;
  inStock: boolean;
}) {
  const [value, setValue] = useState(String(price));
  const [pending, startTransition] = useTransition();

  function handleSave() {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
      setValue(String(price));
      return;
    }
    startTransition(() => {
      updatePriceListing(id, num);
    });
  }

  function handleToggleStock() {
    startTransition(() => {
      toggleInStock(id, !inStock);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        disabled={pending}
        className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-sm"
      />
      <button
        type="button"
        onClick={handleToggleStock}
        disabled={pending}
        className={cn(
          "rounded-full px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50",
          inStock ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground",
        )}
      >
        {inStock ? "Còn hàng" : "Hết hàng"}
      </button>
    </div>
  );
}
