import { prisma } from "./prisma";
import { CraftType, Difficulty, PatternCategory, WeightCategory } from "./generated/prisma/client";
import type { Prisma } from "./generated/prisma/client";
import { parseEnumList } from "./yarn-queries";

export type PatternSort = "newest" | "popular";

export const PATTERN_PAGE_SIZE = 12;

export interface PatternFilters {
  search?: string;
  craftType?: string[];
  difficulty?: string[];
  category?: string[];
  yarnWeight?: string[];
  tag?: string[];
  sort?: PatternSort;
  page?: number;
}

const CRAFT_TYPE_VALUES = Object.values(CraftType);
const DIFFICULTY_VALUES = Object.values(Difficulty);
const PATTERN_CATEGORY_VALUES = Object.values(PatternCategory);
const WEIGHT_CATEGORY_VALUES = Object.values(WeightCategory);

export function parseCraftTypes(input: string[] | undefined) {
  return parseEnumList(CRAFT_TYPE_VALUES, input);
}
export function parseDifficulties(input: string[] | undefined) {
  return parseEnumList(DIFFICULTY_VALUES, input);
}
export function parsePatternCategories(input: string[] | undefined) {
  return parseEnumList(PATTERN_CATEGORY_VALUES, input);
}
export function parsePatternYarnWeights(input: string[] | undefined) {
  return parseEnumList(WEIGHT_CATEGORY_VALUES, input);
}

export async function getPatterns(filters: PatternFilters) {
  const {
    search,
    craftType,
    difficulty,
    category,
    yarnWeight,
    tag,
    sort = "newest",
    page = 1,
  } = filters;

  const where: Prisma.PatternWhereInput = {
    deletedAt: null,
    ...(craftType?.length ? { craftType: { in: craftType as CraftType[] } } : {}),
    ...(difficulty?.length ? { difficulty: { in: difficulty as Difficulty[] } } : {}),
    ...(category?.length ? { category: { in: category as PatternCategory[] } } : {}),
    ...(yarnWeight?.length ? { yarnWeight: { in: yarnWeight as WeightCategory[] } } : {}),
    ...(tag?.length ? { tags: { hasSome: tag } } : {}),
  };

  const all = await prisma.pattern.findMany({ where });

  const searchTerm = search?.trim().toLowerCase();
  const filtered = searchTerm
    ? all.filter((p) => p.title.toLowerCase().includes(searchTerm))
    : all;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.savedCount - a.savedCount;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const total = sorted.length;
  const start = (page - 1) * PATTERN_PAGE_SIZE;
  const items = sorted.slice(start, start + PATTERN_PAGE_SIZE);

  return {
    items,
    total,
    page,
    pageSize: PATTERN_PAGE_SIZE,
    totalPages: Math.ceil(total / PATTERN_PAGE_SIZE) || 1,
  };
}

export type PatternListItem = Awaited<ReturnType<typeof getPatterns>>["items"][number];

export async function getDistinctPatternTags(): Promise<string[]> {
  const rows = await prisma.pattern.findMany({ where: { deletedAt: null }, select: { tags: true } });
  const set = new Set<string>();
  rows.forEach((r) => r.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
}

export async function getAllPatternSlugs(): Promise<string[]> {
  const rows = await prisma.pattern.findMany({ where: { deletedAt: null }, select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getPatternBySlug(slug: string) {
  return prisma.pattern.findFirst({
    where: { slug, deletedAt: null },
    include: {
      steps: { orderBy: { order: "asc" } },
      suitableYarns: { include: { priceListings: true } },
    },
  });
}

export type PatternDetail = NonNullable<Awaited<ReturnType<typeof getPatternBySlug>>>;

export async function getSimilarPatterns(pattern: PatternDetail, limit = 4) {
  return prisma.pattern.findMany({
    where: {
      deletedAt: null,
      id: { not: pattern.id },
      OR: [{ category: pattern.category }, { craftType: pattern.craftType }],
    },
    take: limit,
    orderBy: { savedCount: "desc" },
  });
}

export async function getPatternsByIds(ids: string[]): Promise<PatternListItem[]> {
  if (ids.length === 0) return [];
  const patterns = await prisma.pattern.findMany({ where: { id: { in: ids }, deletedAt: null } });
  const byId = new Map(patterns.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is PatternListItem => Boolean(p));
}
