import { DIFFICULTY_LABELS } from "@/lib/constants";
import type { PatternDetail } from "@/lib/pattern-queries";

function InfoItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function PatternInfo({ pattern }: { pattern: PatternDetail }) {
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5">
      <InfoItem label="Độ khó" value={DIFFICULTY_LABELS[pattern.difficulty]} />
      <InfoItem label="Thời gian" value={pattern.timeEstimate} />
      <InfoItem label="Kích cỡ hoàn thiện" value={pattern.finishedSize} />
      <InfoItem label="Lượng sợi cần" value={pattern.yarnAmount} />
      <InfoItem label="Gauge" value={pattern.gauge} />
      <InfoItem label="Kim/móc" value={pattern.hookNeedleSize} />
    </dl>
  );
}
