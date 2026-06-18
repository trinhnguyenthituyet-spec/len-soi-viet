"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Đã copy link so sánh");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Không thể copy link — thử lại hoặc copy thủ công từ thanh địa chỉ");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
    >
      {copied ? "Đã copy!" : "Copy link để chia sẻ"}
    </button>
  );
}
