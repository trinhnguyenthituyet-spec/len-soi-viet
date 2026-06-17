import { prisma } from "./prisma";
import { FiberCategory, WeightCategory } from "./generated/prisma/client";
import type { Prisma } from "./generated/prisma/client";

export type YarnSort = "name_asc" | "price_asc" | "popular";

export const YARN_PAGE_SIZE = 12;

export interface YarnFilters {
  search?: string;
  fiberCategory?: string[];
  weightCategory?: string[];
  useCase?: string[];
  sort?: YarnSort;
  page?: number;
}

export function parseEnumList<T extends string>(
  values: readonly T[],
  input: string[] | undefined,
): T[] {
  if (!input?.length) return [];
  return input.filter((v): v is T => (values as readonly string[]).includes(v));
}

const FIBER_CATEGORY_VALUES = Object.values(FiberCategory);
const WEIGHT_CATEGORY_VALUES = Object.values(WeightCategory);

export function parseFiberCategories(input: string[] | undefined) {
  return parseEnumList(FIBER_CATEGORY_VALUES, input);
}

export function parseWeightCategories(input: string[] | undefined) {
  return parseEnumList(WEIGHT_CATEGORY_VALUES, input);
}

export async function getYarnTypes(filters: YarnFilters) {
  const { search, fiberCategory, weightCategory, useCase, sort = "name_asc", page = 1 } = filters;

  const where: Prisma.YarnTypeWhereInput = {
    ...(fiberCategory?.length ? { fiberCategory: { in: fiberCategory as FiberCategory[] } } : {}),
    ...(weightCategory?.length
      ? { weightCategory: { in: weightCategory as WeightCategory[] } }
      : {}),
    ...(useCase?.length ? { useCases: { hasSome: useCase } } : {}),
  };

  const all = await prisma.yarnType.findMany({
    where,
    include: { priceListings: true },
  });

  const searchTerm = search?.trim().toLowerCase();
  const filtered = searchTerm
    ? all.filter(
        (y) =>
          y.nameVi.toLowerCase().includes(searchTerm) ||
          y.nameEn?.toLowerCase().includes(searchTerm) ||
          y.tags.some((t) => t.toLowerCase().includes(searchTerm)),
      )
    : all;

  const withMeta = filtered.map((y) => {
    const prices = y.priceListings.map((p) => p.pricePer100g);
    return {
      ...y,
      minPrice: prices.length ? Math.min(...prices) : null,
      shopCount: y.priceListings.length,
    };
  });

  const sorted = [...withMeta].sort((a, b) => {
    if (sort === "price_asc") return (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity);
    if (sort === "popular") return b.shopCount - a.shopCount;
    return a.nameVi.localeCompare(b.nameVi, "vi");
  });

  const total = sorted.length;
  const start = (page - 1) * YARN_PAGE_SIZE;
  const items = sorted.slice(start, start + YARN_PAGE_SIZE);

  return { items, total, page, pageSize: YARN_PAGE_SIZE, totalPages: Math.ceil(total / YARN_PAGE_SIZE) || 1 };
}

export type YarnListItem = Awaited<ReturnType<typeof getYarnTypes>>["items"][number];

export async function getDistinctUseCases(): Promise<string[]> {
  const rows = await prisma.yarnType.findMany({ select: { useCases: true } });
  const set = new Set<string>();
  rows.forEach((r) => r.useCases.forEach((u) => set.add(u)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
}
