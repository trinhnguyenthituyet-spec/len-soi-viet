import { NextRequest, NextResponse } from "next/server";
import {
  getPatterns,
  getPatternsByIds,
  parseCraftTypes,
  parseDifficulties,
  parsePatternCategories,
  parsePatternYarnWeights,
  type PatternSort,
} from "@/lib/pattern-queries";

const VALID_SORTS: PatternSort[] = ["newest", "popular"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const ids = params.get("ids");
  if (ids) {
    const idList = ids.split(",").filter(Boolean);
    const items = await getPatternsByIds(idList);
    return NextResponse.json({ items });
  }

  const search = params.get("search") ?? undefined;
  const craftType = parseCraftTypes(params.getAll("craftType"));
  const difficulty = parseDifficulties(params.getAll("difficulty"));
  const category = parsePatternCategories(params.getAll("category"));
  const yarnWeight = parsePatternYarnWeights(params.getAll("yarnWeight"));
  const tag = params.getAll("tag");
  const sortParam = params.get("sort");
  const sort = VALID_SORTS.includes(sortParam as PatternSort) ? (sortParam as PatternSort) : "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const result = await getPatterns({ search, craftType, difficulty, category, yarnWeight, tag, sort, page });
  return NextResponse.json(result);
}
