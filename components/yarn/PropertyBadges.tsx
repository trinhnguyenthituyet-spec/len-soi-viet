import { ALLERGY_RISK_LABELS, PROPERTY_LABELS, WASHABILITY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { YarnDetail } from "@/lib/yarn-queries";

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-foreground/80">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              i < value ? "bg-primary" : "bg-secondary",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PropertyBadges({ yarn }: { yarn: YarnDetail }) {
  const hasScores = [yarn.warmth, yarn.softness, yarn.durability, yarn.stretch].some(
    (v) => v != null,
  );

  if (!hasScores && !yarn.washability && !yarn.allergyRisk) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {hasScores && (
        <div className="flex flex-col gap-2">
          <ScoreBar label={PROPERTY_LABELS.warmth} value={yarn.warmth} />
          <ScoreBar label={PROPERTY_LABELS.softness} value={yarn.softness} />
          <ScoreBar label={PROPERTY_LABELS.durability} value={yarn.durability} />
          <ScoreBar label={PROPERTY_LABELS.stretch} value={yarn.stretch} />
        </div>
      )}

      {(yarn.washability || yarn.allergyRisk) && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          {yarn.washability && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {WASHABILITY_LABELS[yarn.washability]}
            </span>
          )}
          {yarn.allergyRisk && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {ALLERGY_RISK_LABELS[yarn.allergyRisk]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
