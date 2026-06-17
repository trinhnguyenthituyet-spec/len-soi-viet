import { NextRequest, NextResponse } from "next/server";
import { getYarnTypes, parseFiberCategories, parseWeightCategories, type YarnSort } from "@/lib/yarn-queries";

const VALID_SORTS: YarnSort[] = ["name_asc", "price_asc", "popular"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const search = params.get("search") ?? undefined;
  const fiberCategory = parseFiberCategories(params.getAll("fiberCategory"));
  const weightCategory = parseWeightCategories(params.getAll("weightCategory"));
  const useCase = params.getAll("useCase");
  const sortParam = params.get("sort");
  const sort = VALID_SORTS.includes(sortParam as YarnSort) ? (sortParam as YarnSort) : "name_asc";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const result = await getYarnTypes({ search, fiberCategory, weightCategory, useCase, sort, page });

  return NextResponse.json(result);
}
