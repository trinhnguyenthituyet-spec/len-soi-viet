import { CardGridSkeleton } from "@/components/ui/CardGridSkeleton";

export default function YarnLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-secondary" />

      <div className="mt-6 h-10 max-w-md animate-pulse rounded-full bg-secondary" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden flex-col gap-4 lg:flex">
          <div className="h-32 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-32 animate-pulse rounded-2xl bg-secondary" />
        </div>
        <CardGridSkeleton />
      </div>
    </div>
  );
}
