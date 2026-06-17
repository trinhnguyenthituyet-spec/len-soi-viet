"use client";

import { useTransition } from "react";
import { toggleSellerVerified } from "@/lib/actions/seller-admin-actions";
import { cn } from "@/lib/utils";

export function ToggleVerifiedButton({ sellerId, verified }: { sellerId: string; verified: boolean }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      toggleSellerVerified(sellerId, !verified);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        verified
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-accent",
      )}
    >
      {verified ? "Đã xác minh" : "Chưa xác minh"}
    </button>
  );
}
