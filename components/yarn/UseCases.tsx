import type { YarnDetail } from "@/lib/yarn-queries";

export function UseCases({ yarn }: { yarn: YarnDetail }) {
  if (yarn.useCases.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">Dùng sợi này để làm gì?</h2>
      <ul className="flex flex-wrap gap-2">
        {yarn.useCases.map((use) => (
          <li
            key={use}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80"
          >
            {use}
          </li>
        ))}
      </ul>
    </div>
  );
}
