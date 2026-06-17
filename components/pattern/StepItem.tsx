import Image from "next/image";
import type { Step } from "@/types";

export function StepItem({ step }: { step: Step }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {step.imageUrl && (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-40">
          <Image src={step.imageUrl} alt={step.title} fill className="object-cover" sizes="160px" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed text-foreground/90">{step.content}</p>
        {step.videoUrl && (
          <a
            href={step.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem video hướng dẫn →
          </a>
        )}
        {step.tip && (
          <p className="rounded-lg bg-accent/40 px-3 py-2 text-sm text-foreground/80">
            💡 {step.tip}
          </p>
        )}
      </div>
    </div>
  );
}
