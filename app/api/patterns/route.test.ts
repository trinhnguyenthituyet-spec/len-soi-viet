import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { GET } from "./route";

const PREFIX = "TEST_INTEGRATION_PATTERN_ROUTE_";
let patternId: string;

beforeAll(async () => {
  const pattern = await prisma.pattern.create({
    data: {
      slug: slugify(`${PREFIX}Mau Test`),
      title: `${PREFIX}Mau Test`,
      craftType: "crochet",
      difficulty: "beginner",
      category: "amigurumi",
      images: [],
    },
  });
  patternId = pattern.id;
});

afterAll(async () => {
  await prisma.pattern.deleteMany({ where: { title: { startsWith: PREFIX } } });
});

describe("GET /api/patterns", () => {
  it("returns patterns matching a search query", async () => {
    const request = new NextRequest(
      `http://localhost/api/patterns?search=${encodeURIComponent(PREFIX)}`,
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].title).toBe(`${PREFIX}Mau Test`);
  });

  it("filters by craftType", async () => {
    const request = new NextRequest(
      `http://localhost/api/patterns?search=${encodeURIComponent(PREFIX)}&craftType=knitting`,
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toEqual([]);
  });

  it("returns patterns by ids", async () => {
    const request = new NextRequest(`http://localhost/api/patterns?ids=${patternId}`);
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toHaveLength(1);
    expect(data.items[0].id).toBe(patternId);
  });

  it("returns an empty list for ids that don't exist", async () => {
    const request = new NextRequest(
      "http://localhost/api/patterns?ids=00000000-0000-0000-0000-000000000000",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toEqual([]);
  });
});
